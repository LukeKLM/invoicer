from sqlalchemy import Select
from sqlalchemy import select

from app.models.users import User
from core.db import SessionLocal


class BaseRepository:
    def __init__(self, user: User, db_session: SessionLocal):
        self.user = user
        self.db_session = db_session
        self.model = None

    def _base_query(self) -> Select:
        return select(self.model)

    async def get_list(self):
        list = await self.db_session.execute(self._base_query())
        return list.scalars().all()


class BaseRepositoryWithUser(BaseRepository):
    def _base_query(self):
        return select(self.model).where(self.model.user_id == self.user.id)
