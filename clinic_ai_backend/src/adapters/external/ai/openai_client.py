"""OpenAI client module."""
from __future__ import annotations

import json
from pathlib import Path
from urllib import request

from src.core.config import get_settings


class OpenAIQuestionClient:
    """Simple OpenAI wrapper for intake, summary, and vitals generation."""

    def generate_intake_turn(self, context: dict) -> dict:
        """Generate one intake turn from the dynamic intake template."""
        template_path = Path(__file__).resolve().parent / "prompt_templates" / "intake_prompt.txt"
        template = template_path.read_text(encoding="utf-8")
        replacements = {
            "{{patient_name}}": str(context.get("patient_name", "") or ""),
            "{{patient_age}}": str(context.get("patient_age", "") or ""),
            "{{gender}}": str(context.get("gender", "") or ""),
            "{{language}}": str(context.get("language", "en") or "en"),
            "{{question_number}}": str(int(context.get("question_number", 0) or 0)),
            "{{max_questions}}": str(int(context.get("max_questions", 8) or 8)),
            "{{previous_qa_json}}": json.dumps(context.get("previous_qa_json", []), ensure_ascii=True),
            "{{has_travelled_recently}}": "true" if bool(context.get("has_travelled_recently", False)) else "false",
            "{{chief_complaint}}": str(context.get("chief_complaint", "") or ""),
        }
        prompt = template
        for placeholder, value in replacements.items():
            prompt = prompt.replace(placeholder, value)

        content = self._chat_completion(
            prompt=prompt,
            system_role=(
                "You are an expert clinical intake orchestration engine. "
                "Follow the provided instructions exactly and return strict JSON only."
            ),
        )
        result = json.loads(content)
        if not isinstance(result, dict):
            raise RuntimeError("Model did not return object")
        return result

    def generate_pre_visit_summary(self, language: str, intake_answers: list[dict]) -> dict:
        """Generate a structured five-section pre-visit summary."""
        template_path = Path(__file__).resolve().parent / "prompt_templates" / "summary_prompt.txt"
        template = template_path.read_text(encoding="utf-8")
        prompt = template.replace("{{language}}", language).replace(
            "{{intake_answers_json}}", json.dumps(intake_answers, ensure_ascii=True)
        )
        content = self._chat_completion(
            prompt=prompt,
            system_role="You generate structured pre-visit summaries for doctors.",
        )
        summary = json.loads(content)
        if not isinstance(summary, dict):
            raise RuntimeError("Model did not return object")
        return summary

    def generate_vitals_form(self, context: dict) -> dict:
        """Generate context-aware vitals requirement form."""
        template_path = Path(__file__).resolve().parent / "prompt_templates" / "vitals_prompt.txt"
        template = template_path.read_text(encoding="utf-8")
        prompt = template.replace("{{context_json}}", json.dumps(context, ensure_ascii=True))
        content = self._chat_completion(
            prompt=prompt,
            system_role="You decide if vitals are needed and generate a safe structured vitals form.",
        )
        result = json.loads(content)
        if not isinstance(result, dict):
            raise RuntimeError("Model did not return object")
        return result

    @staticmethod
    def _chat_completion(prompt: str, system_role: str) -> str:
        settings = get_settings()
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not configured")

        payload = {
            "model": settings.openai_model,
            "messages": [
                {"role": "system", "content": system_role},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        }
        req = request.Request(
            url="https://api.openai.com/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with request.urlopen(req, timeout=20) as resp:
            body = json.loads(resp.read().decode("utf-8"))
        return body["choices"][0]["message"]["content"]
