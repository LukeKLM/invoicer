from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from core.db import Base
from core.db import get_db


class User(SQLAlchemyBaseUserTableUUID, Base):
    pass


async def get_user_db(session: AsyncSession = Depends(get_db)):  # B008
    yield SQLAlchemyUserDatabase(session, User)
