import json

from google import genai
from google.genai import types
from pydantic import BaseModel, ValidationError

from app.config import Settings
from app.models import GeminiGrade, MarkingSchemeExtraction, QuestionPaperExtraction


class GeminiResponseError(RuntimeError):
    """Raised when Gemini returns an empty or schema-invalid response."""


class GeminiService:
    def __init__(self, settings: Settings) -> None:
        self.model = settings.gemini_model
        self.client = genai.Client(api_key=settings.gemini_api_key.get_secret_value())

    async def extract_paper(
        self,
        *,
        pdf_bytes: bytes,
        kind: str,
        subject: str | None,
        year: int | None,
        paper_type: str | None,
    ) -> QuestionPaperExtraction | MarkingSchemeExtraction:
        context = (
            f"Subject: {subject or 'not supplied'}; year: {year or 'not supplied'}; "
            f"paper type: {paper_type or 'not supplied'}."
        )
        if kind == "marking_scheme":
            schema: type[BaseModel] = MarkingSchemeExtraction
            prompt = (
                "Extract every marking-scheme entry from this Sri Lankan English-medium O/L paper. "
                f"{context} Preserve numbering, mathematical notation, units, mark allocations, and "
                "alternative accepted answers. Never invent unreadable content; describe uncertainty "
                "in grading_guidance. Confidence must be a number from 0 to 1."
            )
        else:
            schema = QuestionPaperExtraction
            prompt = (
                "Extract every question from this Sri Lankan English-medium O/L paper. "
                f"{context} Preserve multi-part numbering, equations, tables, answer options, and diagram "
                "references. Never infer missing text; describe unreadable or missing content in "
                "asset_notes. Confidence must be a number from 0 to 1."
            )

        return await self._generate_structured(
            prompt=prompt,
            schema=schema,
            system_instruction=(
                "You are a precise Sri Lankan O/L examination document analyst. "
                "Return only content supported by the supplied document."
            ),
            parts=[types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf")],
        )

    async def grade_submission(self, *, submission: dict, question: dict) -> GeminiGrade:
        maximum_marks = float(question["marks"])
        prompt = f"""Grade this response fairly using the supplied marking guidance.
Question: {question['body']}
Format: {question['format']}
Subject/topic identifiers: {question.get('topic_id') or question.get('subject_id')}
Maximum marks: {maximum_marks:g}
Expected answer: {json.dumps(question.get('correct_answer') if question.get('correct_answer') is not None else question.get('model_answer'), ensure_ascii=False)}
Marking guidance: {question.get('grading_guidance') or 'Use standard O/L marking principles.'}
Student answer: {json.dumps(submission.get('answer'), ensure_ascii=False)}

marks_earned must be between 0 and {maximum_marks:g}. Feedback must be specific, encouraging,
concise, and appropriate for ages 14–18. topic_weakness_signal must be from 0 to 1.
"""
        result = await self._generate_structured(
            prompt=prompt,
            schema=GeminiGrade,
            system_instruction=(
                "You are a consistent Sri Lankan O/L examiner. Follow the supplied marking guidance "
                "and do not award more than the question's maximum marks."
            ),
        )
        if not isinstance(result, GeminiGrade):
            raise GeminiResponseError("Gemini returned the wrong grading response shape")
        return result

    async def _generate_structured(
        self,
        *,
        prompt: str,
        schema: type[BaseModel],
        system_instruction: str,
        parts: list[types.Part] | None = None,
    ) -> BaseModel:
        contents: list[str | types.Part] = [prompt, *(parts or [])]
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.1,
                    response_mime_type="application/json",
                    response_json_schema=schema.model_json_schema(),
                ),
            )
        except Exception as exc:
            raise GeminiResponseError("Gemini request failed") from exc
        if not response.text:
            raise GeminiResponseError("Gemini returned an empty response")
        try:
            return schema.model_validate_json(response.text)
        except ValidationError as exc:
            raise GeminiResponseError("Gemini returned a response that did not match the schema") from exc
