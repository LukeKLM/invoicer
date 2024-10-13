from pydantic import BaseModel
from sqlalchemy import Select
from sqlalchemy import insert
from sqlalchemy import select
from sqlalchemy import update

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

    async def get_detail(self, id: int):
        detail = await self.db_session.execute(
            self._base_query().where(self.model.id == id),
        )
        return detail.scalars().first()

    def _get_data_for_create(self, data: BaseModel):
        return data.model_dump()

    async def create(self, data: BaseModel):
        data = self._get_data_for_create(data)

        query = insert(self.model).values(data).returning(self.model)
        result = await self.db_session.execute(query)

        new_record = result.scalars().first()
        self.db_session.commit()
        return new_record

    async def update(self, id: int, data: BaseModel):
        data = data.model_dump(exclude_none=True)

        query = (
            update(self.model)
            .where(self.model.id == id)
            .values(data)
            .returning(self.model)
        )
        result = await self.db_session.execute(query)

        updated_record = result.scalars().first()
        self.db_session.commit()
        return updated_record


class BaseRepositoryWithUser(BaseRepository):
    def _base_query(self):
        return select(self.model).where(self.model.user_id == self.user.id)

    def _get_data_for_create(self, data: BaseModel):
        return {
            **data.model_dump(),
            "user_id": self.user.id,
        }
