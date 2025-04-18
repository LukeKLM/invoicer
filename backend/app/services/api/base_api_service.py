from pydantic import BaseModel

from app.exceptions.api_exceptions import NotFoundException
from app.models.users import User
from core.db import SessionLocal


class BaseApiService:
    def __init__(self, db_session: SessionLocal):
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

        return self.output_schema.model_validate(item)

    async def create(self, item: BaseModel):
        new_item = await self.repository.create(item)
        await self.db_session.flush(new_item)

        new_item = self.output_schema(**new_item.__dict__)
        await self.db_session.commit()
        return new_item

    async def update(self, item_id: int, item: BaseModel):
        item_dict = (
            item.model_dump(exclude_none=True) if isinstance(item, BaseModel) else item
        )

        updated_item = await self.repository.update(item_id, item_dict)
        await self.db_session.flush(updated_item)

        if not updated_item:
            message = f"{self.repository.model.__name__} with id {item_id} not found"
            raise NotFoundException(message)

        updated_item = self.output_schema(**updated_item.__dict__)
        await self.db_session.commit()
        return updated_item

    async def delete(self, item_id: int):
        deleted_item = await self.repository.delete(item_id, commit=True)

        if deleted_item is None:
            message = f"{self.repository.model.__name__} with id {item_id} not found"
            raise NotFoundException(message)


class BaseUserApiService(BaseApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(db_session)
        self.user = user
