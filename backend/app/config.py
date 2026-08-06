from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str
    supabase_service_role_key: SecretStr
    gemini_api_key: SecretStr
    gemini_model: str = "gemini-2.5-flash"
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        frozen=True,
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
