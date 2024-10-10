from collections.abc import AsyncGenerator
from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import declarative_base

from core.config import settings

engine = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI))
print(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
