from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from core.db import BaseModel


class InvoiceSupplier(BaseModel):
    __tablename__ = "invoice_suppliers"

    id = Column(Integer, primary_key=True, index=True)

    bank_account = Column(String(length=50), nullable=True)
    bank_code = Column(String(length=10), nullable=True)
    iban = Column(String(length=34), nullable=True)
    email = Column(String(length=255), nullable=True)
    name = Column(String(length=255), nullable=False)
    user_id = Column(UUID, ForeignKey("user.id"), nullable=False)
    vat_id = Column(String(length=50), nullable=True)

    # address
    city = Column(String(length=255), nullable=True)
    country = Column(String(length=255), nullable=True)
    street = Column(String(length=255), nullable=True)
    postal_code = Column(String(length=20), nullable=True)

    # relations
    invoices = relationship("Invoice", back_populates="supplier")
    user = relationship("User", back_populates="suppliers")
