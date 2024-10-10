import uuid

from fastapi import Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication import BearerTransport
from fastapi_users.authentication import JWTStrategy
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.users import User
from app.services.managers import UserManager
from core.config import settings
from core.db import get_session

bearer_transport = BearerTransport(tokenUrl="auth/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.AUTH_SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    get_strategy=get_jwt_strategy,
    name="jwt",
    transport=bearer_transport,
)


async def get_user_db(session: AsyncSession = Depends(get_session)):  # B008
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)
