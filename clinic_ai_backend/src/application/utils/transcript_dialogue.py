"""Build structured Doctor/Patient-style turns from diarized segments."""
from __future__ import annotations

from typing import Any


def segments_to_structured_dialogue(segments: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Merge consecutive segments from the same clinical speaker into bundle-style turns."""
    label_to_role = {
        "doctor": "Doctor",
        "patient": "Patient",
        "attendant": "Family Member",
        "unknown": "Patient",
    }
    out: list[dict[str, str]] = []
    for seg in segments:
        raw_label = str(seg.get("speaker_label") or "unknown").lower()
        role = label_to_role.get(raw_label, "Patient")
        text = str(seg.get("text") or "").strip()
        if not text:
            continue
        if out and role in out[-1]:
            out[-1][role] = f"{out[-1][role]} {text}".strip()
        else:
            out.append({role: text})
    return out


def audio_duration_from_segments_ms(segments: list[dict[str, Any]]) -> float | None:
    if not segments:
        return None
    try:
        end_ms = max(int(s.get("end_ms", 0) or 0) for s in segments)
    except (TypeError, ValueError):
        return None
    if end_ms <= 0:
        return None
    return round(end_ms / 1000.0, 3)
