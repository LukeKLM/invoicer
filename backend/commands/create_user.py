import asyncio
import contextlib

from app.services.api.auth import AuthApiService
from core.db import get_session

get_async_session_context = contextlib.asynccontextmanager(get_session)


async def create_user(
    email: str,
    password: str,
    password2: str,
    is_superuser: bool = False,
):
    try:
        async with get_async_session_context() as session:
            user = await AuthApiService(session).create_user(email, password, password2)

            print(f"User created {user}")
            return user
    except Exception:
        print(f"User {email} already exists")
        raise


if __name__ == "__main__":
    asyncio.run(create_user("test2@test.cz", "test", "test"))
