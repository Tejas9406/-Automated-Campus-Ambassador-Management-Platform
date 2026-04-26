from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "CampusConnect API"
    environment: str = "dev"

    cors_origins: str = "http://localhost:3000"

    mongodb_uri: str | None = None
    mongodb_db: str = "campusconnect"

    github_token: str | None = None

    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.0-flash"


settings = Settings()

