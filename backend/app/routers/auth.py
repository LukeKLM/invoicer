from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.tokens import Token
from app.schemas.users import UserDetail
from app.services.api.auth import AuthApiService
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
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionLocal = Depends(get_session),
) -> Token:
    user = await AuthApiService(session).authenticate_user(
        form_data.username,
        form_data.password,
    )
    return generate_access_token(user)


@router.get("/users/me/", response_model=UserDetail)
async def read_users_me(
    current_user: Annotated[UserDetail, Depends(get_current_active_user)],
):
    return current_user
