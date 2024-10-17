from app.models import InvoiceCustomer
from app.models.users import User
from app.repositories.base_repository import BaseRepositoryWithUser
from core.db import SessionLocal


class InvoiceCustomerRepository(BaseRepositoryWithUser):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.model = InvoiceCustomer
