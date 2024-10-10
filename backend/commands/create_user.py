import asyncio
import contextlib

from fastapi_users.exceptions import UserAlreadyExists

from app.schemas.users import UserCreate
from app.services.managers import get_user_manager
from core.db import get_session
from core.security import get_user_db

get_async_session_context = contextlib.asynccontextmanager(get_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(email: str, password: str, is_superuser: bool = False):
    try:
        async with get_async_session_context() as session, get_user_db_context(
            session,
        ) as user_db, get_user_manager_context(user_db) as user_manager:
            user = await user_manager.create(
                UserCreate(
                    email=email,
                    password=password,
                    is_superuser=is_superuser,
                ),
            )
            print(f"User created {user}")
            return user
    except UserAlreadyExists:
        print(f"User {email} already exists")
        raise


if __name__ == "__main__":
    asyncio.run(create_user("test@test.cz", "test"))
