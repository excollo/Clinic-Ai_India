"""Send WhatsApp template reminders at T-3 days and T-24 hours before next visit."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from src.adapters.external.whatsapp.meta_whatsapp_client import MetaWhatsAppClient
from src.core.config import get_settings


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ProcessFollowUpRemindersUseCase:
    """Scan scheduled follow-ups and send due Meta template messages."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.whatsapp = MetaWhatsAppClient()

    def execute(self, *, db: Any, now: datetime | None = None) -> dict[str, int]:
        now_utc = now or _utc_now()
        if now_utc.tzinfo is None:
            now_utc = now_utc.replace(tzinfo=timezone.utc)
        else:
            now_utc = now_utc.astimezone(timezone.utc)

        sent_3d = 0
        sent_24h = 0
        skipped = 0

        if not (self.settings.whatsapp_access_token or "").strip() or not (
            self.settings.whatsapp_phone_number_id or ""
        ).strip():
            skipped = len(list(db.follow_up_reminders.find({})))
            return {"sent_3d": 0, "sent_24h": 0, "skipped": skipped}

        template_name = (self.settings.whatsapp_followup_template_name or "").strip()
        if not template_name:
            template_name = (self.settings.whatsapp_intake_template_name or "").strip()
        if not template_name:
            skipped = len(list(db.follow_up_reminders.find({})))
            return {"sent_3d": 0, "sent_24h": 0, "skipped": skipped}

        param_count = max(0, int(self.settings.whatsapp_followup_template_param_count))

        for doc in list(db.follow_up_reminders.find({})):
            nv = doc.get("next_visit_at")
            if nv is None:
                skipped += 1
                continue
            if isinstance(nv, datetime):
                if nv.tzinfo is None:
                    nv = nv.replace(tzinfo=timezone.utc)
                nv = nv.astimezone(timezone.utc)
            else:
                skipped += 1
                continue
            if nv <= now_utc:
                skipped += 1
                continue

            to_number = str(doc.get("to_number") or "")
            if not to_number:
                skipped += 1
                continue

            lang = str(doc.get("preferred_language") or "en").strip().lower()
            language_code = (
                self.settings.whatsapp_followup_template_lang_hi
                if lang == "hi"
                else self.settings.whatsapp_followup_template_lang_en
            )

            t3 = nv - timedelta(days=3)
            t24 = nv - timedelta(hours=24)
            rid = doc.get("reminder_id")

            if doc.get("remind_3d_sent_at") is None and now_utc >= t3 and now_utc < nv:
                body_values = self._template_body_values(
                    reminder_kind="3d",
                    next_visit_at=nv,
                    follow_up_text=str(doc.get("follow_up_text") or ""),
                )
                if param_count > 0 and not body_values:
                    body_values = [self._default_body_line("3d", nv, doc)]
                self.whatsapp.send_template(
                    to_number=to_number,
                    template_name=template_name,
                    language_code=language_code,
                    body_values=body_values[:param_count] if param_count else body_values,
                )
                db.follow_up_reminders.update_one(
                    {"reminder_id": rid},
                    {"$set": {"remind_3d_sent_at": now_utc, "updated_at": now_utc}},
                )
                sent_3d += 1

            fresh = db.follow_up_reminders.find_one({"reminder_id": rid}) or doc
            if fresh.get("remind_24h_sent_at") is None and now_utc >= t24 and now_utc < nv:
                body_values = self._template_body_values(
                    reminder_kind="24h",
                    next_visit_at=nv,
                    follow_up_text=str(doc.get("follow_up_text") or ""),
                )
                if param_count > 0 and not body_values:
                    body_values = [self._default_body_line("24h", nv, fresh)]
                self.whatsapp.send_template(
                    to_number=to_number,
                    template_name=template_name,
                    language_code=language_code,
                    body_values=body_values[:param_count] if param_count else body_values,
                )
                db.follow_up_reminders.update_one(
                    {"reminder_id": rid},
                    {"$set": {"remind_24h_sent_at": now_utc, "updated_at": now_utc}},
                )
                sent_24h += 1

        return {"sent_3d": sent_3d, "sent_24h": sent_24h, "skipped": skipped}

    @staticmethod
    def _default_body_line(kind: str, next_visit_at: datetime, doc: dict) -> str:
        date_s = next_visit_at.strftime("%Y-%m-%d %H:%M UTC")
        if kind == "24h":
            return f"Reminder: your follow-up visit is in about 24 hours ({date_s}). {doc.get('follow_up_text', '')}".strip()
        return f"Reminder: your follow-up visit is in 3 days ({date_s}). {doc.get('follow_up_text', '')}".strip()

    @staticmethod
    def _template_body_values(
        *,
        reminder_kind: str,
        next_visit_at: datetime,
        follow_up_text: str,
    ) -> list[str]:
        """Single-parameter templates (e.g. hello_world) receive one line of text."""
        date_s = next_visit_at.strftime("%Y-%m-%d")
        if reminder_kind == "24h":
            return [f"Follow-up visit tomorrow ({date_s}). {follow_up_text}".strip()[:900]]
        return [f"Follow-up visit in 3 days on {date_s}. {follow_up_text}".strip()[:900]]
