"""Lightweight regex PII scrub for transcript dialogue (subset of Clinic-AI reference)."""
from __future__ import annotations

import re
from typing import Any

_PHONE = re.compile(
    r"\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b",
    re.IGNORECASE,
)
_EMAIL = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
_SSN = re.compile(r"\b\d{3}-?\d{2}-?\d{4}\b")


def scrub_text(text: str) -> str:
    if not text:
        return text
    cleaned = _PHONE.sub("[PHONE]", text)
    cleaned = _EMAIL.sub("[EMAIL]", cleaned)
    cleaned = _SSN.sub("[SSN]", cleaned)
    return cleaned


def scrub_dialogue_turns(dialogue: list[dict[str, Any]]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    for turn in dialogue:
        if not isinstance(turn, dict) or len(turn) != 1:
            continue
        speaker, content = next(iter(turn.items()))
        out.append({str(speaker): scrub_text(str(content))})
    return out
