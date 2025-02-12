from pydantic import BaseModel
from sqlalchemy import Delete
from sqlalchemy import Insert
from sqlalchemy import Select
from sqlalchemy import Update
from sqlalchemy import delete
from sqlalchemy import desc
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
        return self._base_query(select(self.model)).order_by(desc(self.model.id))

    def _update(self) -> Update:
        return self._base_query(update(self.model))

    def _delete(self) -> Delete:
        return self._base_query(delete(self.model))

    def format_insert_data(self, data):
        data = data if isinstance(data, list) else [data]

        new_data = []
        for item_data in data:
            if not isinstance(item_data, BaseModel) and not isinstance(item_data, dict):
                message = "Custom: Data must be a BaseModel or a dict"
                raise ValueError(message)

            new_data_item = (
                item_data.model_dump()
                if isinstance(item_data, BaseModel)
                else item_data
            )
            new_data.append(new_data_item)

        return new_data

    def _insert(self, data: any) -> Insert:
        data_list = self.format_insert_data(data)

        return insert(self.model).values(data_list)

    def _base_query(self, query) -> Select | Insert | Update | Delete:
        return query

    async def get_list(self, options=None):
        query = self._select()
        if options:
            query = query.options(options)

        list = await self.db_session.execute(query)
        return list.scalars().all()

    async def get_detail(self, object_id: int):
        detail = await self.db_session.execute(
            self._select().where(self.model.id == object_id),
        )
        return detail.scalars().first()

    async def create(self, data: any, commit=False):
        query = self._insert(data).returning(self.model)
        result = await self.db_session.execute(query)

        new_record = result.scalars().first()
        if new_record and commit:
            await self.db_session.commit()
            await self.db_session.refresh(new_record)

        return new_record

    async def bulk_create(self, data: list[any], commit=False):
        if not data:
            return []

        query = self._insert(data).returning(self.model)
        result = await self.db_session.execute(query)

        new_records = result.scalars().all()

        if commit:
            await self.db_session.commit()

        return new_records

    async def update(self, object_id: int, data: dict, commit=False):
        query = (
            self._update()
            .where(self.model.id == object_id)
            .values(data)
            .returning(self.model)
        )
        result = await self.db_session.execute(query)

        updated_record = result.scalars().first()

        if updated_record and commit:
            await self.db_session.commit()
            await self.db_session.refresh(updated_record)

        return updated_record

    async def bulk_update(self, data: list[any], commit=False):
        result = await self.db_session.execute(
            self._update().execution_options(synchronize_session=None),
            data,
        )

        if commit:
            await self.db_session.commit()

        return result

    async def delete(self, object_id: int, commit=False):
        query = self._delete().where(self.model.id == object_id).returning(self.model)
        result = await self.db_session.execute(query)
        deleted_object = result.fetchone()

        if commit:
            await self.db_session.commit()

        return deleted_object


class BaseRepositoryWithUser(BaseRepository):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(db_session)
        self.user = user

    def _base_query(self, query) -> Select | Insert | Update | Delete:
        return query.where(self.model.user_id == self.user.id)

    def _insert(self, data: any) -> Insert:
        new_data = self.format_insert_data(data)

        for item_data in new_data:
            item_data.update({"user_id": self.user.id})

        return insert(self.model).values(new_data)
