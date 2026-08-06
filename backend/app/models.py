from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ApiModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class ExtractPaperRequest(ApiModel):
    import_job_id: UUID = Field(alias="importJobId")
    storage_path: str = Field(alias="storagePath", min_length=1)
    kind: Literal["question_paper", "marking_scheme"] = "question_paper"
    subject: str | None = None
    year: int | None = Field(default=None, ge=1980, le=2100)
    paper_type: str | None = Field(default=None, alias="paperType")


class ExtractedQuestion(BaseModel):
    question_number: str
    body: str
    format: Literal[
        "multiple_choice",
        "structured",
        "short_answer",
        "essay",
        "calculation",
        "diagram",
        "mixed",
    ]
    options: list[str] | None = None
    marks: float = Field(default=1, gt=0)
    topic: str = ""
    subtopic: str = ""
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    tags: list[str] = Field(default_factory=list)
    confidence: float = Field(default=0, ge=0, le=1)
    page: int = Field(default=1, ge=1)
    asset_notes: list[str] = Field(default_factory=list)


class QuestionPaperExtraction(BaseModel):
    questions: list[ExtractedQuestion]


class MarkingSchemeEntry(BaseModel):
    question_number: str
    model_answer: str
    marks: float = Field(default=1, gt=0)
    mark_allocation: list[str] = Field(default_factory=list)
    grading_guidance: str = ""
    confidence: float = Field(default=0, ge=0, le=1)


class MarkingSchemeExtraction(BaseModel):
    entries: list[MarkingSchemeEntry]


class GradeSubmissionRequest(ApiModel):
    submission_id: UUID = Field(alias="submissionId")


class GeminiGrade(BaseModel):
    marks_earned: float = Field(ge=0)
    is_correct: bool
    feedback: str
    mistake_explanation: str = ""
    suggested_answer: str = ""
    topic_weakness_signal: float = Field(default=0, ge=0, le=1)
    recommended_content: list[str] = Field(default_factory=list)


class CurrentUser(BaseModel):
    id: UUID
    role: Literal["student", "admin"]
