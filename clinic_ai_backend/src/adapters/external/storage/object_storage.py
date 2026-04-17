"""Azure Blob object storage adapter."""
from __future__ import annotations

import base64
import hashlib
import hmac
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote_plus
from urllib.request import Request, urlopen

from src.core.config import get_settings


class AzureBlobStorage:
    """Minimal Azure Blob client via REST API."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self.account_name = self.settings.azure_storage_account_name
        self.account_key = self.settings.azure_storage_account_key
        self.container = self.settings.azure_blob_container_audio

    def upload_audio(self, *, blob_path: str, audio_bytes: bytes, mime_type: str) -> str:
        """Upload bytes to Azure Blob or local path."""
        if self.settings.use_local_adapters:
            local_path = Path(self.settings.local_audio_storage_path) / blob_path
            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_bytes(audio_bytes)
            return str(local_path)

        return self._upload_azure(blob_path=blob_path, audio_bytes=audio_bytes, mime_type=mime_type)

    def _upload_azure(self, *, blob_path: str, audio_bytes: bytes, mime_type: str) -> str:
        """Upload bytes to Azure Blob and return blob URL."""
        if not self.account_name or not self.account_key:
            raise RuntimeError("Azure Storage credentials are not configured")

        encoded_blob_path = quote_plus(blob_path, safe="/")
        url = f"https://{self.account_name}.blob.core.windows.net/{self.container}/{encoded_blob_path}"
        x_ms_date = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
        x_ms_version = "2021-12-02"
        content_length = len(audio_bytes)

        canonicalized_headers = (
            f"x-ms-blob-type:BlockBlob\n"
            f"x-ms-date:{x_ms_date}\n"
            f"x-ms-version:{x_ms_version}\n"
        )
        canonicalized_resource = (
            f"/{self.account_name}/{self.container}/{blob_path}\n"
            "comp:\n"
            "restype:"
        )
        string_to_sign = (
            f"PUT\n\n\n{content_length}\n\n{mime_type}\n\n\n\n\n\n\n"
            f"{canonicalized_headers}{canonicalized_resource}"
        )
        decoded_key = base64.b64decode(self.account_key)
        signature = base64.b64encode(
            hmac.new(decoded_key, string_to_sign.encode("utf-8"), hashlib.sha256).digest()
        ).decode("utf-8")
        auth_header = f"SharedKey {self.account_name}:{signature}"

        req = Request(url=url, data=audio_bytes, method="PUT")
        req.add_header("x-ms-date", x_ms_date)
        req.add_header("x-ms-version", x_ms_version)
        req.add_header("x-ms-blob-type", "BlockBlob")
        req.add_header("Authorization", auth_header)
        req.add_header("Content-Type", mime_type)
        req.add_header("Content-Length", str(content_length))
        with urlopen(req, timeout=self.settings.transcription_timeout_sec):
            return url
