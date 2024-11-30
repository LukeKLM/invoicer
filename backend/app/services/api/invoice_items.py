from app.models.users import User
from app.repositories.invoice_items import InvoiceItemRepository
from app.schemas.invoice_items import RetrieveInvoiceItem
from app.services.api.base_api_service import BaseUserApiService
from core.db import SessionLocal


class InvoiceItemApiService(BaseUserApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = InvoiceItemRepository(user, db_session)
        self.output_schema = RetrieveInvoiceItem
