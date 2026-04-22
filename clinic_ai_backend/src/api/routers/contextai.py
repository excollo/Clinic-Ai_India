"""ContextAI compatibility routes for provider visit sidebar cards."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from src.adapters.db.mongo.client import get_database

router = APIRouter(prefix="/api/contextai", tags=["ContextAI"])


def _get_patient_or_404(patient_id: str) -> dict:
    db = get_database()
    patient = db.patients.find_one({"patient_id": patient_id}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/context/{patient_id}")
def get_patient_context(patient_id: str) -> dict:
    patient = _get_patient_or_404(patient_id)
    name = str(patient.get("name") or "").strip()
    parts = [p for p in name.split(" ") if p]
    first_name = parts[0] if parts else "Unknown"
    last_name = " ".join(parts[1:]) if len(parts) > 1 else ""
    age = patient.get("age")
    birth_year = datetime.now(timezone.utc).year - age if isinstance(age, int) and age > 0 else 1970

    return {
        "patient_id": patient_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "data_sources": ["patients"],
        "demographics": {
            "patient_id": patient_id,
            "mrn": str(patient.get("mrn") or patient_id),
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": str(patient.get("date_of_birth") or f"{birth_year:04d}-01-01"),
            "age": int(age) if isinstance(age, int) else 0,
            "gender": str(patient.get("gender") or "unknown"),
            "phone": patient.get("phone_number"),
            "email": str(patient.get("email") or ""),
            "address": {
                "street": "",
                "city": "",
                "state": "",
                "zip_code": "",
            },
            "emergency_contact": {
                "name": "",
                "phone": "",
            },
        },
        "medical_history": {},
        "previsit": {
            "has_responses": False,
            "last_response_date": None,
            "chief_complaint": None,
            "triage_level": None,
            "urgency": None,
        },
        "summary": {
            "has_data": True,
            "data_completeness": 60.0,
            "alerts": [],
            "highlights": ["ContextAI profile connected"],
        },
    }


@router.get("/risk-assessment/{patient_id}")
def get_risk_assessment(patient_id: str) -> dict:
    _get_patient_or_404(patient_id)
    return {
        "patient_id": patient_id,
        "assessed_at": datetime.now(timezone.utc).isoformat(),
        "overall_risk_level": "moderate",
        "risk_scores": [
            {
                "risk_type": "general",
                "score": 45,
                "category": "moderate",
                "factors": ["Age and routine clinical profile"],
                "recommendations": ["Review vitals and recent history during visit"],
            }
        ],
    }


@router.get("/care-gaps/{patient_id}")
def get_care_gaps(patient_id: str) -> dict:
    _get_patient_or_404(patient_id)
    return {
        "patient_id": patient_id,
        "gaps": [],
        "total_gaps": 0,
        "high_priority_count": 0,
        "overdue_count": 0,
    }


@router.get("/medication-review/{patient_id}")
def get_medication_review(patient_id: str) -> dict:
    _get_patient_or_404(patient_id)
    return {
        "patient_id": patient_id,
        "medications": [],
        "interactions": [],
        "allergies": [],
        "total_medications": 0,
        "interaction_count": 0,
        "severe_interaction_count": 0,
    }
