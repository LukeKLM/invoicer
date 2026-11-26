from app.models import SkipPayCalculatorSettings
from app.models.users import User
from app.repositories.base_repository import BaseRepositoryWithUser
from core.db import SessionLocal


class SkipPayCalculatorSettingsRepository(BaseRepositoryWithUser):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.model = SkipPayCalculatorSettings

    async def get_by_customer(self, customer_id: int):
        detail = await self.db_session.execute(
            self._select().where(self.model.customer_id == customer_id),
        )
        return detail.scalars().first()
