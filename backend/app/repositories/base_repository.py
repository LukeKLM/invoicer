from pydantic import BaseModel
from sqlalchemy import Delete
from sqlalchemy import Insert
from sqlalchemy import Select
from sqlalchemy import Update
from sqlalchemy import delete
from sqlalchemy import insert
from sqlalchemy import select
from sqlalchemy import update

from app.models.users import User
from core.db import SessionLocal


class BaseRepository:
    def __init__(self, db_session: SessionLocal):
        self.db_session = db_session
        self.model = None

    def _select(self) -> Select:
        return self._base_query(select(self.model))

    def _update(self) -> Update:
        return self._base_query(update(self.model))

    def _delete(self) -> Delete:
        return self._base_query(delete(self.model))

    def _insert(self, data: any) -> Insert:
        if not isinstance(data, BaseModel) and not isinstance(data, dict):
            message = "Data must be a BaseModel or a dict"
            raise ValueError(message)

        data_dict = data.model_dump() if isinstance(data, BaseModel) else data

        return insert(self.model).values(data_dict)

    def _base_query(self, query) -> Select | Insert | Update | Delete:
        return query

    async def get_list(self):
        query = self._select()

        list = await self.db_session.execute(query)
        return list.scalars().all()

    async def get_detail(self, object_id: int):
        detail = await self.db_session.execute(
            self._select().where(self.model.id == object_id),
        )
        return detail.scalars().first()

    async def create(self, data: any):
        query = self._insert(data).returning(self.model)
        result = await self.db_session.execute(query)

        new_record = result.scalars().first()
        if new_record:
            await self.db_session.commit()
            await self.db_session.refresh(new_record)

            return new_record

        return None

    async def update(self, object_id: int, data: BaseModel):
        data = data.model_dump(exclude_none=True)

        query = (
            self._update()
            .where(self.model.id == object_id)
            .values(data)
            .returning(self.model)
        )
        result = await self.db_session.execute(query)

        updated_record = result.scalars().first()

        if updated_record:
            await self.db_session.commit()
            await self.db_session.refresh(updated_record)

            return updated_record

        return None

    async def delete(self, object_id: int):
        query = self._delete().where(self.model.id == object_id).returning(self.model)
        result = await self.db_session.execute(query)
        deleted_object = result.fetchone()
        await self.db_session.commit()

        return deleted_object


class BaseRepositoryWithUser(BaseRepository):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(db_session)
        self.user = user

    def _base_query(self, query) -> Select | Insert | Update | Delete:
        return query.where(self.model.user_id == self.user.id)

    def _insert(self, data: any) -> Insert:
        if not isinstance(data, BaseModel) and not isinstance(data, dict):
            message = "Custom: Data must be a BaseModel or a dict"
            raise ValueError(message)

        data_dict = data.model_dump() if isinstance(data, BaseModel) else data
        data_dict.update({"user_id": self.user.id})

        return super()._insert(data_dict)
