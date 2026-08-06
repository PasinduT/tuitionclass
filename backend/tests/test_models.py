from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.models import ExtractPaperRequest, GeminiGrade, GradeSubmissionRequest


def test_extract_request_preserves_edge_function_field_names() -> None:
    job_id = uuid4()
    request = ExtractPaperRequest.model_validate(
        {
            "importJobId": str(job_id),
            "storagePath": "admin/paper.pdf",
            "paperType": "Paper I",
        }
    )

    assert request.import_job_id == job_id
    assert request.storage_path == "admin/paper.pdf"
    assert request.paper_type == "Paper I"


def test_grade_request_requires_uuid() -> None:
    with pytest.raises(ValidationError):
        GradeSubmissionRequest.model_validate({"submissionId": "not-a-uuid"})


def test_grade_rejects_out_of_range_weakness_signal() -> None:
    with pytest.raises(ValidationError):
        GeminiGrade(
            marks_earned=1,
            is_correct=True,
            feedback="Good work",
            topic_weakness_signal=1.1,
        )
