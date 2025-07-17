from pydantic import BaseModel
from pydantic import Field
from pydantic import model_validator

from app.schemas.users import UserDetail


class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(BaseModel):
    email: str
    password1: str = Field(..., min_length=10)
    password2: str

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.password1 != self.password2:
            message = "Passwords do not match"
            raise ValueError(message)
        return self


class GoogleCallbackLogin(BaseModel):
    state: str
    code: str
    prompt: str = None
    authuser: str = None


class GoogleToken(BaseModel):
    access_token: str
    expires_in: int
    token_type: str
    scope: str
    id_token: str


class GoogleIdTokenDetail(BaseModel):
    aud: str
    exp: int
    iat: int
    iss: str
    sub: str
    at_hash: str | None = None
    azp: str | None = None
    email: str
    email_verified: bool = False
    family_name: str | None = None
    given_name: str | None = None
    locale: str | None = None
    name: str | None = None
    picture: str | None = None
    nonce: str | None = None
    profile: str | None = None


class OAuthAccountDetail:
    id: int
    identifier: str
    oauth_type: str
    user_id: str
    user: UserDetail
