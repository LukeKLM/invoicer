import uuid

from pydantic import BaseModel


class UserDetail(BaseModel):
    id: int | str | uuid.UUID
    email: str
    is_active: bool
    hashed_password: str
