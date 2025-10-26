from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # API_V1_PREFIX = "api/v1"

    DB_HOST: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    DB_PORT: int

    @property
    def DB_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    model_config = SettingsConfigDict(env_file="src/.env", extra="ignore")


settings = Settings()