from datetime import UTC
from datetime import datetime
from datetime import timedelta
from typing import Annotated

import jwt
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from passlib.context import CryptContext

from app.exceptions.api_exceptions import UnauthorizedException
from app.repositories.auth import AuthRepository
from app.schemas.tokens import Token
from app.schemas.tokens import TokenData
from app.schemas.users import UserDetail
from core.config import settings
from core.db import SessionLocal
from core.db import get_session

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "is_active": False,
    },
}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Custom auth implementation
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionLocal = Depends(get_session),
):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        email: str = payload.get("sub")
        if email is None:
            raise UnauthorizedException
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise UnauthorizedException from None

    user = await AuthRepository(session).get_by_email(email=token_data.email)

    if user is None:
        raise UnauthorizedException
    return user


async def get_current_active_user(
    current_user: Annotated[UserDetail, Depends(get_current_user)],
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def generate_access_token(user):
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type=settings.TOKEN_TYPE)
