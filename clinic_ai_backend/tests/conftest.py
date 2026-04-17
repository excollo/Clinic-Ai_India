"""Pytest fixtures and in-memory DB fakes."""
from __future__ import annotations

from copy import deepcopy

import pytest
from fastapi.testclient import TestClient

from src.app import create_app
from src.core import config as config_module


class InsertOneResult:
    def __init__(self, inserted_id: int) -> None:
        self.inserted_id = inserted_id


class InMemoryCollection:
    def __init__(self) -> None:
        self.docs: list[dict] = []
        self._next_id = 1

    def create_index(self, *_args, **_kwargs) -> None:
        return None

    def insert_one(self, doc: dict) -> InsertOneResult:
        item = deepcopy(doc)
        if "_id" not in item:
            item["_id"] = self._next_id
            self._next_id += 1
        self.docs.append(item)
        return InsertOneResult(item["_id"])

    def _matches(self, doc: dict, query: dict) -> bool:
        return all(doc.get(key) == value for key, value in query.items())

    def find_one(self, query: dict | None = None, sort: list[tuple[str, int]] | None = None) -> dict | None:
        query = query or {}
        filtered = [doc for doc in self.docs if self._matches(doc, query)]
        if not filtered:
            return None
        if sort:
            for field, direction in reversed(sort):
                reverse = direction < 0
                filtered.sort(key=lambda item: item.get(field), reverse=reverse)
        return deepcopy(filtered[0])

    def delete_one(self, query: dict) -> None:
        for index, doc in enumerate(self.docs):
            if self._matches(doc, query):
                self.docs.pop(index)
                return

    def update_one(self, query: dict, update: dict) -> None:
        for index, doc in enumerate(self.docs):
            if self._matches(doc, query):
                updated = deepcopy(doc)
                for key, value in update.get("$set", {}).items():
                    updated[key] = value
                for key, value in update.get("$inc", {}).items():
                    updated[key] = int(updated.get(key, 0)) + int(value)
                self.docs[index] = updated
                return

    def replace_one(self, query: dict, replacement: dict, upsert: bool = False) -> None:
        for index, doc in enumerate(self.docs):
            if self._matches(doc, query):
                item = deepcopy(replacement)
                item["_id"] = doc["_id"]
                self.docs[index] = item
                return
        if upsert:
            self.insert_one(replacement)


class InMemoryDatabase:
    def __init__(self) -> None:
        self.audio_files = InMemoryCollection()
        self.transcription_jobs = InMemoryCollection()
        self.transcription_results = InMemoryCollection()
        self.transcription_queue = InMemoryCollection()
        self.pre_visit_summaries = InMemoryCollection()


@pytest.fixture
def fake_db() -> InMemoryDatabase:
    return InMemoryDatabase()


@pytest.fixture(autouse=True)
def force_azure_mode(monkeypatch: pytest.MonkeyPatch) -> None:
    """Keep tests deterministic regardless of your local `.env`."""
    settings = config_module.get_settings()
    settings.use_local_adapters = False
    monkeypatch.setattr("src.core.config.get_settings", lambda: settings)


@pytest.fixture
def patched_db(fake_db: InMemoryDatabase, monkeypatch: pytest.MonkeyPatch) -> InMemoryDatabase:
    monkeypatch.setattr("src.adapters.db.mongo.client.get_database", lambda: fake_db)
    monkeypatch.setattr("src.api.routers.workflow.get_database", lambda: fake_db)
    monkeypatch.setattr("src.api.routers.transcription.get_database", lambda: fake_db)
    monkeypatch.setattr("src.adapters.external.queue.producer.get_database", lambda: fake_db)
    monkeypatch.setattr("src.adapters.external.queue.consumer.get_database", lambda: fake_db)
    monkeypatch.setattr("src.adapters.db.mongo.repositories.audio_repository.get_database", lambda: fake_db)
    monkeypatch.setattr("src.workers.transcription_worker.get_database", lambda: fake_db)
    return fake_db


@pytest.fixture
def app_client(patched_db: InMemoryDatabase) -> TestClient:
    app = create_app()
    return TestClient(app)
