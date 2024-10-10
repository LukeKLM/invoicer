from app.models.users import User
from app.repositories.invoices import InvoiceRepository
from app.services.api.base_api_service import BaseApiService
from core.db import SessionLocal


class InvoiceApiService(BaseApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = InvoiceRepository(user, db_session)

    async def get_invoices(self):
        return await self.repository.get_list()
