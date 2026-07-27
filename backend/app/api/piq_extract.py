"""
PIQ Extract API
===============
POST /api/user/piq/extract
  Accepts a typed/digital PIQ PDF, extracts all fields using pdfplumber + Groq,
  and returns the structured data for the frontend to pre-fill the form.
  Data is NOT saved to DB here — the user edits and saves via PUT /api/user/piq.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.core.security import get_current_user
from app.models.models import User
from app.services.piq_extraction_service import PIQExtractionService

router = APIRouter(prefix="/user", tags=["PIQ Extract"])

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/x-pdf",
}

MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024  # 8 MB


@router.post("/piq/extract")
async def extract_piq_from_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Extract PIQ form data from a typed/digital PDF.

    - Accepts PDF files up to 8 MB
    - Uses pdfplumber for text extraction
    - Uses Groq (or OpenRouter fallback) for structured JSON parsing
    - Returns the extracted PIQData for frontend pre-filling
    - Does NOT save to the database — user must confirm via PUT /api/user/piq
    """
    # Validate content type
    content_type = file.content_type or ""
    filename = file.filename or "upload.pdf"

    if content_type not in ALLOWED_CONTENT_TYPES and not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=415,
            detail="Only PDF files are supported. Please upload a typed/digital PIQ form PDF.",
        )

    # Read file bytes
    file_bytes = await file.read()

    # Validate file size
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File is too large ({len(file_bytes) // (1024*1024)} MB). Maximum allowed size is 8 MB.",
        )

    # Extract and parse
    try:
        extracted = PIQExtractionService.extract(file_bytes, filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Extraction failed unexpectedly: {str(e)}",
        )

    return {
        "success": True,
        "extracted": extracted,
        "message": "PIQ data extracted successfully. Please review and edit before saving.",
    }
