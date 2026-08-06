import math
from typing import Any

from starlette.concurrency import run_in_threadpool
from supabase import Client, create_client

from app.config import Settings
from app.models import CurrentUser, GeminiGrade


class SupabaseGateway:
    def __init__(self, settings: Settings) -> None:
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key.get_secret_value(),
        )

    async def authenticate(self, token: str) -> CurrentUser | None:
        try:
            auth_response = await run_in_threadpool(self.client.auth.get_user, token)
            auth_user = auth_response.user
            if auth_user is None:
                return None
            response = await run_in_threadpool(
                lambda: self.client.table("profiles").select("role").eq("id", str(auth_user.id)).single().execute()
            )
            if not response.data:
                return None
            return CurrentUser(id=auth_user.id, role=response.data["role"])
        except Exception:
            return None

    async def import_job_exists(self, import_job_id: str) -> bool:
        response = await run_in_threadpool(
            lambda: self.client.table("import_jobs").select("id").eq("id", import_job_id).maybe_single().execute()
        )
        return bool(response.data)

    async def update_import_job(self, import_job_id: str, values: dict[str, Any]) -> None:
        await run_in_threadpool(
            lambda: self.client.table("import_jobs").update(values).eq("id", import_job_id).execute()
        )

    async def download_paper(self, storage_path: str) -> bytes:
        return await run_in_threadpool(self.client.storage.from_("papers").download, storage_path)

    async def get_submission_and_question(self, submission_id: str) -> tuple[dict, dict] | None:
        submission_response = await run_in_threadpool(
            lambda: self.client.table("submissions").select("*").eq("id", submission_id).maybe_single().execute()
        )
        submission = submission_response.data
        if not submission:
            return None
        question_response = await run_in_threadpool(
            lambda: self.client.table("questions").select("*").eq("id", submission["question_id"]).single().execute()
        )
        return submission, question_response.data

    async def save_grade(
        self,
        *,
        submission_id: str,
        total_marks: float,
        grade: GeminiGrade,
        model: str,
    ) -> dict:
        safe_marks = max(0.0, min(total_marks, grade.marks_earned))
        payload = {
            "submission_id": submission_id,
            "marks_earned": safe_marks,
            "total_marks": total_marks,
            "is_correct": grade.is_correct,
            "feedback": grade.feedback,
            "mistake_explanation": grade.mistake_explanation,
            "suggested_answer": grade.suggested_answer,
            "topic_weakness_signal": grade.topic_weakness_signal,
            "recommended_content": grade.recommended_content,
            "model": model,
            "raw_response": grade.model_dump(mode="json"),
            "leaderboard_points": math.ceil(total_marks * 15) if safe_marks == total_marks else 5,
        }
        response = await run_in_threadpool(
            lambda: self.client.table("grading_results")
            .upsert(payload, on_conflict="submission_id")
            .execute()
        )
        await run_in_threadpool(
            lambda: self.client.table("submissions")
            .update({"status": "auto_graded"})
            .eq("id", submission_id)
            .execute()
        )
        if not response.data:
            raise RuntimeError("Supabase did not return the saved grading result")
        return response.data[0]
