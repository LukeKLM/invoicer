from app.models.users import User
from app.repositories.base_repository import BaseRepository
from core.db import SessionLocal


class AuthRepository(BaseRepository):
    def __init__(self, db_session: SessionLocal):
        super().__init__(db_session)
        self.model = User

    async def get_by_email(self, email: str):
        detail = await self.db_session.execute(
            self._select().where(self.model.email == email),
        )
        return detail.scalars().first()
