from pathlib import Path

from dotenv import load_dotenv
from pydantic import PostgresDsn
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings

load_dotenv()

PROJECT_DIR = Path(__file__).parent.parent


class Settings(BaseSettings):
    # Auth
    AUTH_SECRET: str = ""

    BACKEND_APP_NAME: str = "Invoice API"
    DEBUG: bool = False

    # CORS
    CORS_ORIGINS: list[str] = []

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = ""
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    SQLALCHEMY_LOG_ENABLED: bool = False

    # auth settings
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 600  # min
    TOKEN_TYPE: str = "bearer"  # S105

    # Google
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = ""

    # Front-end
    FRONTEND_URL: str = ""

    # Files
    INVOICE_CSS: Path = Path(f"{PROJECT_DIR}/app/templates/invoice.css")

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
