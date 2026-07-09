from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SentinelIQ"
    environment: str = "development"
    database_url: str = "postgresql://sentineliq:sentineliq@localhost:5432/sentineliq"
    upload_storage_dir: str = "storage/uploads"
    log_level: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
