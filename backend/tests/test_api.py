import os
from uuid import uuid4

from httpx import ASGITransport, AsyncClient

os.environ.setdefault("SUPABASE_URL", "http://127.0.0.1:54321")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("GEMINI_API_KEY", "test-gemini-key")

from app.dependencies import get_current_user, get_gemini, get_supabase, require_admin  # noqa: E402
from app.main import app  # noqa: E402
from app.models import (  # noqa: E402
    CurrentUser,
    GeminiGrade,
    QuestionPaperExtraction,
)


class FakeSupabase:
    def __init__(self, student_id=None) -> None:
        self.student_id = student_id
        self.job_updates: list[dict] = []

    async def import_job_exists(self, import_job_id: str) -> bool:
        return True

    async def update_import_job(self, import_job_id: str, values: dict) -> None:
        self.job_updates.append(values)

    async def download_paper(self, storage_path: str) -> bytes:
        return b"%PDF-1.7"

    async def get_submission_and_question(self, submission_id: str):
        return (
            {"id": submission_id, "student_id": str(self.student_id), "answer": "4"},
            {
                "id": str(uuid4()),
                "marks": 2,
                "body": "What is 2 + 2?",
                "format": "short_answer",
                "model_answer": "4",
            },
        )

    async def save_grade(self, **kwargs):
        return {"submission_id": kwargs["submission_id"], "marks_earned": 2}


class FakeGemini:
    model = "test-gemini"

    async def extract_paper(self, **kwargs):
        return QuestionPaperExtraction(questions=[])

    async def grade_submission(self, **kwargs):
        return GeminiGrade(
            marks_earned=2,
            is_correct=True,
            feedback="Correct.",
            topic_weakness_signal=0,
        )


async def test_health() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_admin_can_extract_paper() -> None:
    admin = CurrentUser(id=uuid4(), role="admin")
    database = FakeSupabase()
    app.dependency_overrides[require_admin] = lambda: admin
    app.dependency_overrides[get_supabase] = lambda: database
    app.dependency_overrides[get_gemini] = lambda: FakeGemini()
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/v1/extract-paper",
                json={
                    "importJobId": str(uuid4()),
                    "storagePath": "papers/maths.pdf",
                    "kind": "question_paper",
                },
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["questions"] == []
    assert database.job_updates[-1]["status"] == "review_ready"


async def test_student_can_grade_own_submission() -> None:
    student = CurrentUser(id=uuid4(), role="student")
    database = FakeSupabase(student_id=student.id)
    app.dependency_overrides[get_current_user] = lambda: student
    app.dependency_overrides[get_supabase] = lambda: database
    app.dependency_overrides[get_gemini] = lambda: FakeGemini()
    submission_id = uuid4()
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/v1/grade-submission",
                json={"submissionId": str(submission_id)},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == {"submission_id": str(submission_id), "marks_earned": 2}


async def test_student_cannot_grade_another_students_submission() -> None:
    student = CurrentUser(id=uuid4(), role="student")
    database = FakeSupabase(student_id=uuid4())
    app.dependency_overrides[get_current_user] = lambda: student
    app.dependency_overrides[get_supabase] = lambda: database
    app.dependency_overrides[get_gemini] = lambda: FakeGemini()
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/v1/grade-submission",
                json={"submissionId": str(uuid4())},
            )
    finally:
        app.dependency_overrides.clear()

    assert response.status_code == 403
