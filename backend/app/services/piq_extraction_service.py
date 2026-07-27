"""
PIQ Extraction Service
======================
Extracts structured data from a typed/digital PIQ PDF using:
  1. pdfplumber  — pulls plain text from the PDF pages
  2. Groq API    — parses raw text into structured PIQ JSON
     (falls back to OpenRouter free models if Groq fails)
"""

import json
import re
import requests
from io import BytesIO
from typing import Optional

import pdfplumber

from app.core.config import settings


# ---------------------------------------------------------------------------
# JSON schema skeleton sent to the LLM as part of the prompt
# ---------------------------------------------------------------------------
PIQ_JSON_SCHEMA = """
{
  "full_name": "",
  "father_name": "",
  "date_of_birth": "",
  "religion": "",
  "category": "",
  "mother_tongue": "",
  "marital_status": "",
  "state_district": "",
  "selection_board": "",
  "batch_no": "",
  "chest_no": "",
  "upsc_roll_no": "",
  "max_residence": {"place": "", "district": "", "state": "", "population": ""},
  "parents_residence": {"place": "", "district": "", "state": "", "population": ""},
  "permanent_residence": {"place": "", "district": "", "state": "", "population": "", "is_district_hq": false},
  "parents_alive": null,
  "mother_death_age": "",
  "father_death_age": "",
  "family_members": [
    {"relation": "Father", "education": "", "occupation": "", "income": ""},
    {"relation": "Mother", "education": "", "occupation": "", "income": ""},
    {"relation": "Guardian", "education": "", "occupation": "", "income": ""},
    {"relation": "Elder Brother / Sister", "education": "", "occupation": "", "income": ""},
    {"relation": "Elder Brother / Sister", "education": "", "occupation": "", "income": ""},
    {"relation": "Younger Brother / Sister", "education": "", "occupation": "", "income": ""},
    {"relation": "Younger Brother / Sister", "education": "", "occupation": "", "income": ""}
  ],
  "academic_records": [
    {"qualification": "Matric / Hr. Sec.", "institution": "", "board_university": "", "year": "", "division_marks": "", "medium": "", "boarder_day": "", "achievement": ""},
    {"qualification": "10+2 / Equivalent", "institution": "", "board_university": "", "year": "", "division_marks": "", "medium": "", "boarder_day": "", "achievement": ""},
    {"qualification": "Graduation", "institution": "", "board_university": "", "year": "", "division_marks": "", "medium": "", "boarder_day": "", "achievement": ""},
    {"qualification": "Post-Graduation / Professional", "institution": "", "board_university": "", "year": "", "division_marks": "", "medium": "", "boarder_day": "", "achievement": ""}
  ],
  "age_years": null,
  "age_months": null,
  "height": "",
  "weight": "",
  "present_occupation": "",
  "monthly_income": "",
  "ncc_training": null,
  "ncc_details": [],
  "sports": [{"game": "", "duration": "", "represented": "", "achievement": ""}],
  "hobbies": "",
  "extracurricular": [],
  "responsibility_positions": "",
  "nature_of_commission": "",
  "choice_of_service": "",
  "commission_attempts": null,
  "previous_interviews": [{"sl_no": 1, "type_of_entry": "", "ssb_place": "", "date": "", "chest_batch_no": "", "result": ""}],
  "exam": "",
  "level": ""
}
"""

OPENROUTER_FALLBACK_MODELS = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-2-9b-it:free",
    "qwen/qwen-2.5-72b-instruct:free",
]


def _extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Use pdfplumber to extract plain text from a digital/typed PDF.
    Returns the concatenated text of all pages, stripped of excessive whitespace.
    """
    text_parts = []
    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text(x_tolerance=3, y_tolerance=3)
                if page_text:
                    text_parts.append(page_text.strip())
    except Exception as e:
        raise ValueError(f"Failed to read PDF: {str(e)}")

    full_text = "\n\n".join(text_parts)
    if not full_text.strip():
        raise ValueError(
            "No readable text found in the PDF. "
            "Only typed/digital PIQ forms are supported (not scanned or image-based PDFs)."
        )
    return full_text


def _build_extraction_prompt(raw_text: str) -> str:
    return f"""You are an expert at reading Indian Armed Forces SSB PIQ forms (DIPR Questionnaire No. 107-A Revised).

Below is the raw text extracted from a candidate's filled PIQ form (Personal Information Questionnaire).

Your task: Parse the text and return ONLY a valid JSON object that follows the exact schema below.
Rules:
- Fill every field you can find in the text. Leave fields as "" or null if not found.
- For "parents_alive": return true, false, or null.
- For "ncc_training": return true if Yes, false if No, null if not mentioned.
- For "date_of_birth": use "YYYY-MM-DD" format if possible, otherwise the raw string found.
- For "age_years" and "age_months": return integers or null.
- For "commission_attempts": return an integer or null.
- For "previous_interviews" result field: extract result as "Screen Out", "Conference Out", or "Recommended" if found, else "".
- For arrays like "sports", "ncc_details", "extracurricular", "previous_interviews": 
  extract all rows you find. Use empty array [] if none found.
- For "family_members": always return exactly 7 rows with the fixed relations in the schema. 
  Fill in what you find, leave blanks if not found.
- For "academic_records": always return exactly 4 rows with fixed qualifications. Fill what you find.
- Do NOT add any explanation, markdown formatting, or text outside the JSON.

JSON SCHEMA TO FILL:
{PIQ_JSON_SCHEMA}

RAW TEXT FROM PIQ FORM:
{raw_text}

Return only the filled JSON object:"""


def _call_groq(prompt: str) -> Optional[str]:
    """Call Groq API (llama-3.3-70b-versatile) for structured JSON extraction."""
    if not settings.GROQ_API_KEY:
        return None
    try:
        res = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a precise data extraction assistant. Always respond with valid JSON only.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.1,  # Low temperature for deterministic extraction
                "max_tokens": 4096,
                "response_format": {"type": "json_object"},
            },
            timeout=30,
        )
        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"]
        print(f"Groq error {res.status_code}: {res.text[:200]}")
    except Exception as e:
        print(f"Groq call failed: {e}")
    return None


def _call_openrouter(prompt: str) -> Optional[str]:
    """Try OpenRouter free models as fallback."""
    for model in OPENROUTER_FALLBACK_MODELS:
        try:
            headers = {
                "Content-Type": "application/json",
                "HTTP-Referer": "https://ssb-ai-rag.local",
                "X-Title": "SSB AI Mentor",
            }
            if settings.OPENROUTER_API_KEY:
                headers["Authorization"] = f"Bearer {settings.OPENROUTER_API_KEY}"

            res = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a precise data extraction assistant. Always respond with valid JSON only.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.1,
                },
                timeout=30,
            )
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
            print(f"OpenRouter {model} error {res.status_code}")
        except Exception as e:
            print(f"OpenRouter {model} failed: {e}")
    return None


def _parse_llm_json(raw_response: str) -> dict:
    """
    Parse the LLM response into a dict.
    Handles cases where the model wraps JSON in markdown code fences.
    """
    text = raw_response.strip()

    # Strip markdown fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        text = text.strip()

    return json.loads(text)


class PIQExtractionService:
    @staticmethod
    def extract(file_bytes: bytes, filename: str) -> dict:
        """
        Main entry point:
        1. Extract text from the digital PDF using pdfplumber
        2. Send to Groq (fallback: OpenRouter) for structured parsing
        3. Return PIQData-shaped dict

        Raises:
            ValueError: if the PDF has no readable text or LLM parsing fails
        """
        # Step 1: Text extraction
        raw_text = _extract_text_from_pdf(file_bytes)

        # Limit text sent to LLM (avoid token overflows on large PDFs)
        truncated_text = raw_text[:8000] if len(raw_text) > 8000 else raw_text

        # Step 2: Build prompt
        prompt = _build_extraction_prompt(truncated_text)

        # Step 3: Try Groq first, then OpenRouter
        llm_response = _call_groq(prompt)
        if not llm_response:
            llm_response = _call_openrouter(prompt)

        if not llm_response:
            raise ValueError(
                "AI parsing service is currently unavailable (Groq + OpenRouter both failed). "
                "Please fill the form manually."
            )

        # Step 4: Parse JSON
        try:
            extracted = _parse_llm_json(llm_response)
        except json.JSONDecodeError as e:
            raise ValueError(f"AI returned invalid JSON. Please try again. (Detail: {e})")

        return extracted
