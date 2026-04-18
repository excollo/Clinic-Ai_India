"""LLM-based structuring of raw transcript into Doctor/Patient JSON (OpenAI API)."""
from __future__ import annotations

import json
import re
from typing import Any
from urllib import request

from src.core.config import get_settings


def _extract_dialogue_array(content: str) -> list[dict[str, str]] | None:
    text = (content or "").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text).strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict) and isinstance(parsed.get("dialogue"), list):
            parsed = parsed["dialogue"]
        if isinstance(parsed, list):
            normalized: list[dict[str, str]] = []
            for item in parsed:
                if isinstance(item, dict) and len(item) == 1:
                    k, v = next(iter(item.items()))
                    normalized.append({str(k): str(v)})
            return normalized or None
    except json.JSONDecodeError:
        pass
    m = re.search(r"\[\s*\{[\s\S]*\}\s*\]", text)
    if m:
        try:
            arr = json.loads(m.group(0))
            if isinstance(arr, list):
                return [dict(t) for t in arr if isinstance(t, dict) and len(t) == 1]  # type: ignore[misc]
        except json.JSONDecodeError:
            return None
    return None


def structure_dialogue_from_transcript_sync(*, raw_transcript: str, language: str = "en") -> list[dict[str, str]]:
    """
    Call OpenAI chat completions to produce [{Doctor: ...}, {Patient: ...}, ...].

    Uses OPENAI_API_KEY / OPENAI_MODEL from Settings (public OpenAI, not Azure OpenAI).
    """
    settings = get_settings()
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    if not (raw_transcript or "").strip():
        return []

    lang = (language or "en").strip().lower()
    output_language = "Spanish" if lang in {"sp", "es", "es-es", "es-mx", "spanish", "español"} else "English"

    system = (
        "You are a medical dialogue analyst. Convert the raw consultation transcript into a JSON array. "
        "Each element must be a single-key object: {\"Doctor\": \"text\"} or {\"Patient\": \"text\"} "
        "or {\"Family Member\": \"text\"} when applicable. "
        "Remove direct identifiers (names used as people, phone numbers, emails, SSN). "
        "Do NOT remove medication names or clinical terms. "
        "Preserve meaning; minor cleanup of disfluencies is allowed. "
        f"Write spoken text in {output_language}. "
        "Return ONLY valid JSON array, no markdown."
    )
    user = f"TRANSCRIPT:\n{raw_transcript}\n\nReturn ONLY the JSON array."

    payload = {
        "model": settings.openai_model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.1,
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
    with request.urlopen(req, timeout=120) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    content = body["choices"][0]["message"]["content"] or ""
    parsed = _extract_dialogue_array(content)
    if not parsed:
        raise RuntimeError("STRUCTURE_DIALOGUE_PARSE_FAILED")
    return parsed
