from typing import Annotated

import httpx
from fastapi import APIRouter
from fastapi import Depends
from fastapi.responses import RedirectResponse

from app.schemas.auth import GoogleCallbackLogin
from app.schemas.auth import UserLogin

# from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.tokens import Token
from app.schemas.users import UserDetail
from app.services.api.auth import AuthApiService
from app.services.api.auth.google_auth import GoogleAuthenticatorService
from core.config import settings
from core.db import SessionLocal
from core.db import get_session
from core.security import generate_access_token
from core.security import get_current_active_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/token")
async def login_for_access_token(
    form_data: UserLogin,
    # form_data: Annotated[OAuth2PasswordRequestForm, Depends()],  # from Swagger
    session: SessionLocal = Depends(get_session),
) -> Token:
    user = await AuthApiService(session).authenticate_user(
        form_data.email,
        # form_data.username,
        form_data.password,
    )
    return generate_access_token(user)


@router.get("/users/me/", response_model=UserDetail)
async def read_users_me(
    current_user: Annotated[UserDetail, Depends(get_current_active_user)],
):
    return current_user


@router.get("/google/callback")
async def google_login_callback(
    login_data: Annotated[GoogleCallbackLogin, Depends()],
    session: SessionLocal = Depends(get_session),
):
    google_service = GoogleAuthenticatorService(session)
    detail_google_token = await google_service.identify_user(login_data.code)
    user = await google_service.get_or_create_user(detail_google_token)
    token = generate_access_token(user)

    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/oauth-login?token={token.access_token}",
        status_code=httpx.codes.FOUND,
    )
