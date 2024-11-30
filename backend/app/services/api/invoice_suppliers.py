from app.models.users import User
from app.repositories.invoice_suppliers import InvoiceSupplierRepository
from app.schemas.suppliers import RetrieveInvoiceSupplier
from app.services.api.base_api_service import BaseUserApiService
from core.db import SessionLocal


class InvoiceSupplierApiService(BaseUserApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = InvoiceSupplierRepository(user, db_session)
        self.output_schema = RetrieveInvoiceSupplier
