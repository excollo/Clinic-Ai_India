"""Mongo GridFS object storage adapter."""
from __future__ import annotations

from io import BytesIO

from bson import ObjectId
from gridfs import GridFSBucket

from src.adapters.db.mongo.client import get_database
from src.core.config import get_settings


class AzureBlobStorage:
    """Audio storage adapter backed by Mongo GridFS."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.bucket_name = self.settings.mongo_audio_bucket_name
        self.bucket = GridFSBucket(get_database(), bucket_name=self.bucket_name)

    def upload_audio(self, *, blob_path: str, audio_bytes: bytes, mime_type: str) -> str:
        """Upload bytes to Mongo GridFS and return a storage reference."""
        file_id = self.bucket.upload_from_stream(
            blob_path,
            BytesIO(audio_bytes),
            metadata={"mime_type": mime_type, "blob_path": blob_path},
        )
        return f"gridfs://{file_id}"

    def download_audio(self, storage_ref: str) -> bytes:
        """Download bytes from Mongo GridFS by `gridfs://<object_id>` reference."""
        prefix = "gridfs://"
        if not storage_ref.startswith(prefix):
            raise RuntimeError("Unsupported storage reference format")
        object_id_str = storage_ref[len(prefix) :].strip()
        if not object_id_str:
            raise RuntimeError("Missing GridFS object id in storage reference")
        stream = BytesIO()
        self.bucket.download_to_stream(ObjectId(object_id_str), stream)
        return stream.getvalue()
