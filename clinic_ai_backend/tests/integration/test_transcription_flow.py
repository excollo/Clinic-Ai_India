"""Integration tests for transcription V2 endpoints and worker."""
from __future__ import annotations

from datetime import datetime, timezone

import pytest

from src.workers.transcription_worker import TranscriptionWorker


def _insert_previsit(fake_db, patient_id: str) -> None:
    fake_db.pre_visit_summaries.insert_one(
        {
            "patient_id": patient_id,
            "status": "generated",
            "updated_at": datetime.now(timezone.utc),
        }
    )


def test_upload_happy_path(app_client, fake_db, monkeypatch: pytest.MonkeyPatch) -> None:
    _insert_previsit(fake_db, "p1")
    monkeypatch.setattr(
        "src.api.routers.transcription.AzureBlobStorage.upload_audio",
        lambda self, **_kwargs: "https://blob.example/audio.wav",
    )

    response = app_client.post(
        "/notes/transcribe",
        data={
            "patient_id": "p1",
            "visit_id": "v1",
            "noise_environment": "quiet_clinic",
            "language_mix": "hi-en",
            "speaker_mode": "two_speakers",
        },
        files={"audio_file": ("sample.wav", b"abc123", "audio/wav")},
    )

    assert response.status_code == 202
    payload = response.json()
    assert payload["patient_id"] == "p1"
    assert payload["visit_id"] == "v1"
    assert payload["status"] == "queued"
    assert len(fake_db.audio_files.docs) == 1
    assert len(fake_db.transcription_jobs.docs) == 1
    assert len(fake_db.transcription_queue.docs) == 1


def test_upload_rejects_when_previsit_missing(app_client, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "src.api.routers.transcription.AzureBlobStorage.upload_audio",
        lambda self, **_kwargs: "https://blob.example/audio.wav",
    )
    response = app_client.post(
        "/notes/transcribe",
        data={
            "patient_id": "missing-patient",
            "visit_id": "v1",
            "noise_environment": "quiet_clinic",
            "language_mix": "hi-en",
            "speaker_mode": "two_speakers",
        },
        files={"audio_file": ("sample.wav", b"abc123", "audio/wav")},
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "PREVISIT_MISSING"


def test_worker_defensive_gate_fails_cleanly(fake_db, patched_db) -> None:
    fake_db.audio_files.insert_one(
        {
            "audio_id": "a1",
            "patient_id": "p2",
            "visit_id": "v2",
            "blob_url": "https://blob.example/audio.wav",
        }
    )
    fake_db.transcription_jobs.insert_one(
        {
            "job_id": "j1",
            "audio_id": "a1",
            "patient_id": "p2",
            "visit_id": "v2",
            "status": "queued",
            "retry_count": 0,
            "max_retries": 2,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
    )
    fake_db.transcription_queue.insert_one({"job_id": "j1", "queued_at": datetime.now(timezone.utc)})

    worker = TranscriptionWorker()
    worked = worker.process_next()

    assert worked is True
    job = fake_db.transcription_jobs.find_one({"job_id": "j1"})
    assert job["status"] == "failed"
    assert job["error_code"] == "PREVISIT_MISSING"


def test_result_retrieval_completed(app_client, fake_db) -> None:
    fake_db.transcription_jobs.insert_one(
        {
            "job_id": "j2",
            "patient_id": "p2",
            "visit_id": "v2",
            "status": "completed",
            "created_at": datetime.now(timezone.utc),
            "started_at": datetime.now(timezone.utc),
            "completed_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
    )
    fake_db.transcription_results.insert_one(
        {
            "job_id": "j2",
            "patient_id": "p2",
            "visit_id": "v2",
            "language_detected": "hi-en",
            "overall_confidence": 0.88,
            "requires_manual_review": False,
            "full_transcript_text": "hello",
            "segments": [
                {
                    "segment_id": "seg_1",
                    "start_ms": 0,
                    "end_ms": 1000,
                    "speaker_label": "doctor",
                    "text": "hello",
                    "confidence": 0.88,
                    "needs_manual_review": False,
                }
            ],
            "created_at": datetime.now(timezone.utc),
        }
    )
    response = app_client.get("/notes/transcribe/jobs/j2/result")
    assert response.status_code == 200
    payload = response.json()
    assert payload["job_id"] == "j2"
    assert payload["segments"][0]["speaker_label"] == "doctor"


def test_low_confidence_triggers_manual_review(
    fake_db, patched_db, monkeypatch: pytest.MonkeyPatch
) -> None:
    _insert_previsit(fake_db, "p3")
    fake_db.audio_files.insert_one(
        {
            "audio_id": "a3",
            "patient_id": "p3",
            "visit_id": "v3",
            "blob_url": "https://blob.example/audio.wav",
        }
    )
    fake_db.transcription_jobs.insert_one(
        {
            "job_id": "j3",
            "audio_id": "a3",
            "patient_id": "p3",
            "visit_id": "v3",
            "status": "queued",
            "noise_environment": "crowded_opd",
            "language_mix": "hi-en",
            "speaker_mode": "two_speakers",
            "retry_count": 0,
            "max_retries": 2,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
    )
    fake_db.transcription_queue.insert_one({"job_id": "j3", "queued_at": datetime.now(timezone.utc)})
    monkeypatch.setattr(
        "src.workers.transcription_worker.TranscriptionWorker._call_azure_speech",
        lambda self, **_kwargs: {
            "language_detected": "hi-en",
            "segments": [
                {
                    "start_ms": 0,
                    "end_ms": 500,
                    "speaker_label": "doctor",
                    "text": "namaste",
                    "confidence": 0.4,
                },
                {
                    "start_ms": 501,
                    "end_ms": 1000,
                    "speaker_label": "patient",
                    "text": "dard",
                    "confidence": 0.45,
                },
            ],
        },
    )
    worker = TranscriptionWorker()
    worker.process_next()

    result = fake_db.transcription_results.find_one({"job_id": "j3"})
    assert result is not None
    assert result["requires_manual_review"] is True
    assert all(segment["needs_manual_review"] for segment in result["segments"])
