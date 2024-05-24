from pydantic.v1 import BaseSettings


class Settings(BaseSettings):
    BACKEND_APP_NAME: str = "My API"
    DEBUG: bool = False

    class Config:
        env_file = "../.env"


settings = Settings()
