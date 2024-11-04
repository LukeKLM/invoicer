from decimal import Decimal

from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy.orm import relationship

from core.db import BaseModel


class InvoiceItem(BaseModel):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoice_invoices.id"), nullable=False)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    title = Column(String(64), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    user_id = Column(UUID, ForeignKey("user.id"), nullable=False)

    # relations
    invoice = relationship("Invoice", back_populates="items")
    user = relationship("User", back_populates="invoice_items")

    @property
    def total_price(self):
        return Decimal(self.price * self.quantity)
