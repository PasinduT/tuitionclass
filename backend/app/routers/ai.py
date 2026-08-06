from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user, get_gemini, get_supabase, require_admin
from app.models import CurrentUser, ExtractPaperRequest, GradeSubmissionRequest
from app.services.gemini import GeminiResponseError, GeminiService
from app.services.supabase import SupabaseGateway


router = APIRouter(tags=["AI workflows"])


@router.post("/extract-paper")
async def extract_paper(
    request: ExtractPaperRequest,
    _: Annotated[CurrentUser, Depends(require_admin)],
    supabase: Annotated[SupabaseGateway, Depends(get_supabase)],
    gemini: Annotated[GeminiService, Depends(get_gemini)],
) -> dict:
    import_job_id = str(request.import_job_id)
    if not await supabase.import_job_exists(import_job_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Import job not found")

    await supabase.update_import_job(
        import_job_id,
        {"status": "processing", "progress": 10, "error_message": None},
    )
    try:
        pdf_bytes = await supabase.download_paper(request.storage_path)
        extracted = await gemini.extract_paper(
            pdf_bytes=pdf_bytes,
            kind=request.kind,
            subject=request.subject,
            year=request.year,
            paper_type=request.paper_type,
        )
        result = extracted.model_dump(mode="json")
        count = len(result.get("questions", result.get("entries", [])))
        await supabase.update_import_job(
            import_job_id,
            {
                "status": "review_ready",
                "progress": 100,
                "provider_model": gemini.model,
                "result_summary": {"count": count},
            },
        )
        return {"importJobId": import_job_id, **result}
    except Exception as exc:
        try:
            await supabase.update_import_job(
                import_job_id,
                {"status": "failed", "error_message": str(exc)[:1000]},
            )
        except Exception:
            pass
        if isinstance(exc, GeminiResponseError):
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
        raise


@router.post("/grade-submission")
async def grade_submission(
    request: GradeSubmissionRequest,
    user: Annotated[CurrentUser, Depends(get_current_user)],
    supabase: Annotated[SupabaseGateway, Depends(get_supabase)],
    gemini: Annotated[GeminiService, Depends(get_gemini)],
) -> dict:
    submission_id = str(request.submission_id)
    record = await supabase.get_submission_and_question(submission_id)
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    submission, question = record
    if user.role != "admin" and str(submission["student_id"]) != str(user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This submission belongs to another user")

    try:
        grade = await gemini.grade_submission(submission=submission, question=question)
    except GeminiResponseError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc
    return await supabase.save_grade(
        submission_id=submission_id,
        total_marks=float(question["marks"]),
        grade=grade,
        model=gemini.model,
    )
