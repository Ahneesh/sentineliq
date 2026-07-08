from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SentinelIQ"
    environment: str = "development"
    database_url: str = "postgresql://sentineliq:sentineliq@localhost:5432/sentineliq"
    upload_dir: str = "storage/uploads"

    class Config:
        env_file = ".env"


settings = Settings()
