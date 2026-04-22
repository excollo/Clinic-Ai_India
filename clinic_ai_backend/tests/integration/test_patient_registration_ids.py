"""Integration tests for opaque patient_id + CONSULT visit_id flow."""
from __future__ import annotations

import re

from src.application.utils.patient_id_crypto import decode_patient_id


def test_register_returns_opaque_patient_id_and_consult_visit_id(app_client) -> None:
    payload = {
        "name": "John",
        "phone_number": "+1 (555) 123-4567",
        "age": 30,
        "gender": "male",
        "preferred_language": "en",
        "travelled_recently": False,
        "constant": True,
    }
    res = app_client.post("/api/patients/register", json=payload)
    assert res.status_code == 200
    data = res.json()

    opaque_patient_id = data["patient_id"]
    internal = decode_patient_id(opaque_patient_id)
    assert internal == "john_15551234567"
    assert re.fullmatch(r"^CONSULT-\d{8}-\d{3}$", data["visit_id"]) is not None


def test_create_visit_accepts_opaque_patient_id(app_client, monkeypatch) -> None:
    monkeypatch.setattr(
        "src.application.services.intake_chat_service.IntakeChatService.start_intake",
        lambda *args, **kwargs: None,
    )
    register_payload = {
        "name": "Asha",
        "phone_number": "9876543210",
        "age": 29,
        "gender": "female",
        "preferred_language": "en",
        "travelled_recently": False,
        "constant": True,
    }
    reg = app_client.post("/api/patients/register", json=register_payload)
    assert reg.status_code == 200
    opaque_patient_id = reg.json()["patient_id"]

    res = app_client.post(f"/api/patients/{opaque_patient_id}/visits", json={})
    assert res.status_code == 200
    body = res.json()
    assert re.fullmatch(r"^CONSULT-\d{8}-\d{3}$", body["visit_id"]) is not None
    assert decode_patient_id(body["patient_id"]) == "asha_9876543210"
