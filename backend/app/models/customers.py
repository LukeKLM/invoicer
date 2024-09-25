from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from core.db import BaseModel


class InvoiceCustomer(BaseModel):
    __tablename__ = "invoice_customers"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(length=255), nullable=True)
    name = Column(String(length=255), nullable=False)
    user_id = Column(UUID, nullable=False)
    vat_id = Column(String(length=50), nullable=True)

    # address
    city = Column(String(length=255), nullable=True)
    country = Column(String(length=255), nullable=True)
    street = Column(String(length=255), nullable=True)
    postal_code = Column(String(length=20), nullable=True)
