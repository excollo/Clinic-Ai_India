"""Intake chat orchestration service module."""
from __future__ import annotations

from datetime import datetime, timezone

from src.adapters.db.mongo.client import get_database
from src.adapters.external.ai.openai_client import OpenAIQuestionClient
from src.adapters.external.whatsapp.meta_whatsapp_client import MetaWhatsAppClient
from src.application.use_cases.generate_pre_visit_summary import GeneratePreVisitSummaryUseCase
from src.core.config import get_settings


STOP_WORDS = {"stop", "enough", "exit", "quit", "band", "rok do", "bas"}
GREETING_WORDS = {
    "hi",
    "hii",
    "hiii",
    "hello",
    "hey",
    "namaste",
    "namaskar",
    "good morning",
    "good evening",
}


class IntakeChatService:
    """Coordinates intake question flow on WhatsApp."""

    def __init__(self) -> None:
        self.db = get_database()
        self.whatsapp = MetaWhatsAppClient()
        self.openai = OpenAIQuestionClient()

    def start_intake(self, patient_id: str, to_number: str, language: str) -> None:
        """Start intake with one-time greeting and first illness question."""
        normalized_to_number = self._normalize_phone_number(to_number)
        greeting = (
            "Hello! Welcome to Clinic AI India. "
            if language == "en"
            else "Namaste! Clinic AI India mein aapka swagat hai. "
        )
        first_question = self._chief_complaint_question(language)

        self.db.intake_sessions.update_one(
            {"patient_id": patient_id},
            {
                "$set": {
                    "patient_id": patient_id,
                    "to_number": normalized_to_number,
                    "language": language,
                    "status": "awaiting_illness",
                    "greeting_sent": True,
                    "illness": None,
                    "answers": [],
                    "pending_question": None,
                    "pending_topic": None,
                    "question_number": 1,
                    "max_questions": 8,
                    "updated_at": datetime.now(timezone.utc),
                },
                "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
            },
            upsert=True,
        )
        settings = get_settings()
        if settings.whatsapp_intake_template_name:
            language_code = (
                settings.whatsapp_intake_template_lang_hi
                if language == "hi"
                else settings.whatsapp_intake_template_lang_en
            )
            body_values = [first_question] if settings.whatsapp_intake_template_param_count > 0 else []
            # Send first business-initiated message as approved template for better reliability.
            self.whatsapp.send_template(
                to_number=normalized_to_number,
                template_name=settings.whatsapp_intake_template_name,
                language_code=language_code,
                body_values=body_values,
            )
        else:
            self.whatsapp.send_text(normalized_to_number, greeting + first_question)

    def handle_patient_reply(self, from_number: str, message_text: str) -> None:
        """Handle incoming WhatsApp reply and continue intake."""
        normalized_from = self._normalize_phone_number(from_number)
        session = self.db.intake_sessions.find_one(
            {
                "to_number": normalized_from,
                "status": {"$in": ["awaiting_illness", "in_progress"]},
            },
            sort=[("updated_at", -1)],
        )
        if not session and normalized_from:
            # Backward compatibility for older records saved with + prefix.
            session = self.db.intake_sessions.find_one(
                {
                    "to_number": f"+{normalized_from}",
                    "status": {"$in": ["awaiting_illness", "in_progress"]},
                },
                sort=[("updated_at", -1)],
            )
        if not session:
            return

        cleaned = (message_text or "").strip()
        if cleaned.lower() in STOP_WORDS:
            self.db.intake_sessions.update_one(
                {"_id": session["_id"]},
                {"$set": {"status": "stopped", "updated_at": datetime.now(timezone.utc)}},
            )
            end_msg = (
                "Thank you. We will continue with your submitted answers."
                if session.get("language") == "en"
                else "Dhanyavaad. Hum aapke diye gaye jawaabon ke saath aage badhenge."
            )
            self.whatsapp.send_text(from_number, end_msg)
            self._auto_generate_pre_visit_summary(session)
            return

        status = session.get("status")
        if status == "awaiting_illness":
            if self._looks_like_greeting(cleaned):
                self.whatsapp.send_text(
                    session["to_number"],
                    self._chief_complaint_question(session.get("language", "en")),
                )
                return
            self._save_illness_and_generate_questions(session, cleaned)
            return

        if status == "in_progress":
            self._save_answer_and_ask_next(session, cleaned)

    def _save_illness_and_generate_questions(self, session: dict, illness_text: str) -> None:
        self.db.intake_sessions.update_one(
            {"_id": session["_id"]},
            {
                "$set": {
                    "illness": illness_text,
                    "status": "in_progress",
                    "updated_at": datetime.now(timezone.utc),
                },
                "$push": {"answers": {"question": "illness", "answer": illness_text}},
            },
        )
        refreshed = self.db.intake_sessions.find_one({"_id": session["_id"]}) or session
        self._generate_and_send_next_turn(refreshed)

    def _save_answer_and_ask_next(self, session: dict, answer_text: str) -> None:
        current_question = str(session.get("pending_question", "") or "").strip()
        if not current_question:
            self._generate_and_send_next_turn(session)
            return
        self.db.intake_sessions.update_one(
            {"_id": session["_id"]},
            {
                "$push": {
                    "answers": {
                        "question": current_question,
                        "topic": session.get("pending_topic"),
                        "answer": answer_text,
                    }
                },
                "$set": {
                    "pending_question": None,
                    "pending_topic": None,
                    "status": "in_progress",
                    "updated_at": datetime.now(timezone.utc),
                },
            },
        )
        refreshed = self.db.intake_sessions.find_one({"_id": session["_id"]}) or session
        self._generate_and_send_next_turn(refreshed)

    def _generate_and_send_next_turn(self, session: dict) -> None:
        language = session.get("language", "en")
        fallback_question = self._fallback_questions(language)[0]
        try:
            patient = self.db.patients.find_one({"patient_id": session.get("patient_id")}) or {}
            context = {
                "patient_name": patient.get("name", ""),
                "patient_age": patient.get("age", ""),
                "gender": patient.get("gender", ""),
                "language": language,
                "question_number": int(session.get("question_number", 1) or 1),
                "max_questions": int(session.get("max_questions", 8) or 8),
                "previous_qa_json": session.get("answers", []),
                "has_travelled_recently": bool(patient.get("travelled_recently", False)),
                "chief_complaint": session.get("illness", ""),
            }
            ai_turn = self.openai.generate_intake_turn(context)
            message = str(ai_turn.get("message", "") or "").strip()
            if not message:
                raise RuntimeError("Empty message in AI turn")
            is_complete = bool(ai_turn.get("is_complete", False))
            topic = str(ai_turn.get("topic", "") or "")
            question_number = int(ai_turn.get("question_number", session.get("question_number", 1)) or 1)

            if is_complete:
                self.db.intake_sessions.update_one(
                    {"_id": session["_id"]},
                    {
                        "$set": {
                            "status": "completed",
                            "pending_question": None,
                            "pending_topic": topic,
                            "question_number": question_number,
                            "updated_at": datetime.now(timezone.utc),
                        }
                    },
                )
                self.whatsapp.send_text(session["to_number"], message)
                self._auto_generate_pre_visit_summary(session)
                return

            self.db.intake_sessions.update_one(
                {"_id": session["_id"]},
                {
                    "$set": {
                        "status": "in_progress",
                        "pending_question": message,
                        "pending_topic": topic,
                        "question_number": max(question_number + 1, int(session.get("question_number", 1) or 1) + 1),
                        "updated_at": datetime.now(timezone.utc),
                    }
                },
            )
            self.whatsapp.send_text(session["to_number"], message)
            return
        except Exception:
            pass

        # Safe fallback if model call/parsing fails.
        self.db.intake_sessions.update_one(
            {"_id": session["_id"]},
            {
                "$set": {
                    "status": "in_progress",
                    "pending_question": fallback_question,
                    "pending_topic": "associated_symptoms",
                    "updated_at": datetime.now(timezone.utc),
                }
            },
        )
        self.whatsapp.send_text(session["to_number"], fallback_question)

    @staticmethod
    def _fallback_questions(language: str) -> list[str]:
        if language == "hi":
            return [
                "Yeh samasya kab se hai?",
                "Dard ya takleef kahan hai?",
                "Lakshan lagataar hain ya beech-beech mein aate hain?",
                "Kya aap abhi koi dawa le rahe hain?",
                "Kya bukhar, ulti, ya saans lene mein dikkat hai?",
            ]
        return [
            "Since when are you facing this issue?",
            "Where exactly is the discomfort or pain?",
            "Are symptoms constant or on and off?",
            "Are you currently taking any medicines?",
            "Any fever, vomiting, or breathing difficulty?",
        ]

    @staticmethod
    def _auto_generate_pre_visit_summary(session: dict) -> None:
        patient_id = str(session.get("patient_id", "")).strip()
        if not patient_id:
            return
        try:
            GeneratePreVisitSummaryUseCase().execute(patient_id=patient_id)
        except Exception:
            # Do not block intake completion on summary generation errors.
            return

    @staticmethod
    def _normalize_phone_number(phone_number: str) -> str:
        """Normalize phone number for reliable matching across webhook/provider formats."""
        return "".join(ch for ch in str(phone_number or "") if ch.isdigit())

    @staticmethod
    def _chief_complaint_question(language: str) -> str:
        """Return the question that asks for patient's primary problem."""
        return (
            "Please describe your main health problem in a few words."
            if language == "en"
            else "Kripya apni mukhya swasthya samasya kuch shabdon mein batayen."
        )

    @staticmethod
    def _looks_like_greeting(message_text: str) -> bool:
        """Detect greeting-only replies that should not be treated as illness."""
        normalized = " ".join((message_text or "").strip().lower().split())
        return normalized in GREETING_WORDS
