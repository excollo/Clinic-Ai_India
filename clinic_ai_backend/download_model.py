import traceback

import whisper

print("Downloading small model...")

try:
    whisper.load_model("small")
    print("Done. Model is ready.")
except Exception as error:  # noqa: BLE001
    print("ERROR:", error)
    traceback.print_exc()
