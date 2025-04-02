from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped

from core.config import settings
from core.db_utils import default_now
from core.db_utils import update_now

engine = create_async_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    echo=settings.SQLALCHEMY_LOG_ENABLED,
)
print(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


class BaseModel(DeclarativeBase):
    __abstract__ = True

    created_at: Mapped[default_now]
    updated_at: Mapped[update_now]
