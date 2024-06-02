from pydantic import PostgresDsn
from pydantic.v1 import BaseSettings
from pydantic_core import MultiHostUrl


class Settings(BaseSettings):
    # Auth
    AUTH_SECRET: str = ""

    BACKEND_APP_NAME: str = "My API"
    DEBUG: bool = False

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = ""
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    class Config:
        env_file = ".env"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:  # noqa N802 should be lowercase
        return MultiHostUrl.build(
            scheme="postgresql+asyncpg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )


settings = Settings()
