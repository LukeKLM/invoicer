from sqlalchemy.orm import joinedload
from sqlalchemy.orm import selectinload

from app.models import Invoice
from app.models.users import User
from app.repositories.base_repository import BaseRepositoryWithUser
from core.db import SessionLocal


class InvoiceRepository(BaseRepositoryWithUser):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.model = Invoice

    async def get_detail(self, invoice_id: int):
        detail = await self.db_session.execute(
            self._select()
            .options(
                selectinload(Invoice.items),
            )
            .where(self.model.id == invoice_id),
        )
        return detail.scalars().first()

    async def get_detail_with_relations(self, invoice_id: int):
        detail = await self.db_session.execute(
            self._select()
            .options(
                joinedload(Invoice.customer),
                joinedload(Invoice.supplier),
                selectinload(Invoice.items),
            )
            .where(self.model.id == invoice_id),
        )
        return detail.scalars().first()
