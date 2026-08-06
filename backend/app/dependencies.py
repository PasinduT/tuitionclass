from functools import lru_cache
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import Settings, get_settings
from app.models import CurrentUser
from app.services.gemini import GeminiService
from app.services.supabase import SupabaseGateway


bearer_scheme = HTTPBearer(auto_error=False)


@lru_cache
def _supabase_gateway(settings: Settings) -> SupabaseGateway:
    return SupabaseGateway(settings)


@lru_cache
def _gemini_service(settings: Settings) -> GeminiService:
    return GeminiService(settings)


def get_supabase(settings: Annotated[Settings, Depends(get_settings)]) -> SupabaseGateway:
    return _supabase_gateway(settings)


def get_gemini(settings: Annotated[Settings, Depends(get_settings)]) -> GeminiService:
    return _gemini_service(settings)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    supabase: Annotated[SupabaseGateway, Depends(get_supabase)],
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token is required")
    user = await supabase.authenticate(credentials.credentials)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return user


def require_admin(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access is required")
    return user
