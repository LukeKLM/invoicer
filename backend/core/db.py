from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped

from core.config import settings
from core.db_utils import default_now

engine: AsyncEngine = create_async_engine(
    str(settings.SQLALCHEMY_DATABASE_URI),
    echo=settings.SQLALCHEMY_LOG_ENABLED,
    pool_size=20,
    max_overflow=0,
    pool_pre_ping=True,
)
SessionLocal: async_sessionmaker = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


class BaseModel(DeclarativeBase):
    __abstract__ = True

    created_at: Mapped[default_now]
    updated_at: Mapped[
        default_now
    ]  # onupdate is solved in db (trigger - trigger_set_updated_at)
