from sqlalchemy import desc
from sqlalchemy import select
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
                joinedload(Invoice.customer),
                joinedload(Invoice.supplier),
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

    async def get_invoice_numbers(self) -> list[str]:
        result = await self.db_session.execute(
            self._base_query(select(self.model.invoice_number)),
        )
        return list(result.scalars().all())

    async def exists_with_number(self, invoice_number: str) -> bool:
        result = await self.db_session.execute(
            self._base_query(select(self.model.id))
            .where(self.model.invoice_number == invoice_number)
            .limit(1),
        )
        return result.scalar() is not None

    async def get_latest_for_customer(self, customer_id: int):
        result = await self.db_session.execute(
            self._base_query(select(self.model))
            .where(self.model.customer_id == customer_id)
            .order_by(desc(self.model.expose_date), desc(self.model.id))
            .limit(1),
        )
        return result.scalars().first()
