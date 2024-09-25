import uuid

from fastapi import FastAPI
from fastapi_users import FastAPIUsers

from app.models.users import User
from app.schemas.users import UserCreate
from app.schemas.users import UserRead
from app.services.managers import get_user_manager
from core.config import settings
from core.security import auth_backend

app = FastAPI(
    title=settings.BACKEND_APP_NAME,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
