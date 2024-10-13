from app.models.users import User
from app.repositories.invoices import InvoiceRepository
from app.schemas.invoices import InvoiceCreate
from app.schemas.invoices import InvoiceRetrieve
from app.schemas.invoices import InvoiceUpdate
from app.services.api.base_api_service import BaseApiService
from core.db import SessionLocal


class InvoiceApiService(BaseApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = InvoiceRepository(user, db_session)

    async def get_invoices(self):
        return await self.repository.get_list()

    async def get_invoice(self, invoice_id: int):
        return await self.repository.get_detail(invoice_id)

    async def create_invoice(self, invoice: InvoiceCreate):
        invoice = await self.repository.create(invoice)
        return InvoiceRetrieve(**invoice.__dict__)

    async def update_invoice(self, invoice_id: int, invoice: InvoiceUpdate):
        invoice = await self.repository.update(invoice_id, invoice)
        return InvoiceRetrieve(**invoice.__dict__)
