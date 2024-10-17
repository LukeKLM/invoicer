from pydantic import BaseModel

from app.exceptions.api_exceptions import NotFoundException
from app.models.users import User
from core.db import SessionLocal


class BaseApiService:
    def __init__(self, user: User, db_session: SessionLocal):
        self.user = user
        self.db_session = db_session
        self.repository = None
        self.output_schema = None

    async def get_list(self):
        items = await self.repository.get_list()
        return [self.output_schema(**item.__dict__) for item in items]

    async def get_detail(self, item_id: int):
        item = await self.repository.get_detail(item_id)
        if not item:
            message = f"{self.repository.model.__name__} with id {item_id} not found"
            raise NotFoundException(message)

        return self.output_schema(**item.__dict__)

    async def create(self, item: BaseModel):
        new_item = await self.repository.create(item)
        return self.output_schema(**new_item.__dict__)

    async def update(self, item_id: int, item: BaseModel):
        updated_item = await self.repository.update(item_id, item)
        if not updated_item:
            message = f"{self.repository.model.__name__} with id {item_id} not found"
            raise NotFoundException(message)

        return self.output_schema(**updated_item.__dict__)

    async def delete(self, item_id: int):
        deleted_item = await self.repository.delete(item_id)

        if deleted_item is None:
            message = f"{self.repository.model.__name__} with id {item_id} not found"
            raise NotFoundException(message)
