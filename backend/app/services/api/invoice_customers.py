from app.models.users import User
from app.repositories.invoice_customers import InvoiceCustomerRepository
from app.schemas.customers import RetrieveInvoiceCustomer
from app.services.api.base_api_service import BaseApiService
from core.db import SessionLocal


class InvoiceCustomerApiService(BaseApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = InvoiceCustomerRepository(user, db_session)
        self.output_schema = RetrieveInvoiceCustomer
