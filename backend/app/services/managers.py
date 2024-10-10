import uuid
from urllib.request import Request

from fastapi_users import BaseUserManager
from fastapi_users import UUIDIDMixin

from app.models.users import User
from core.config import settings


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.AUTH_SECRET
    verification_token_secret = settings.AUTH_SECRET

    async def on_after_register(self, user: User, request: Request | None = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self,
        user: User,
        token: str,
        request: Request | None = None,
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self,
        user: User,
        token: str,
        request: Request | None = None,
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")
