from sqlalchemy import UUID
from sqlalchemy import Boolean
from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy.orm import relationship

from core.db import BaseModel


class User(BaseModel):
    __tablename__ = "user"

    id = Column(UUID, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(
        Text,
    )  # todo: possibly to change to varchar(1024) after implementation
    is_active = Column(Boolean, default=True)

    # relations
    suppliers = relationship("InvoiceSupplier", back_populates="user")
    customers = relationship("InvoiceCustomer", back_populates="user")
    invoices = relationship("Invoice", back_populates="user")
    invoice_items = relationship("InvoiceItem", back_populates="user")
    oauth_accounts = relationship("OAuthAccount", back_populates="user")
