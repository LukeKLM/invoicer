from datetime import datetime

from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.enums.invoice_enums import InvoicePaymentType
from app.enums.invoice_enums import InvoiceState
from core.db import BaseModel


class Invoice(BaseModel):
    __tablename__ = "invoice_invoices"

    id = Column(Integer, primary_key=True, index=True)

    due_date = Column(Date, nullable=False)
    expose_date = Column(Date, default=datetime.now)
    invoice_number = Column(String(10), index=True, nullable=False)
    payment_type = Column(SQLAlchemyEnum(InvoicePaymentType), nullable=False)
    state = Column(SQLAlchemyEnum(InvoiceState), nullable=False)
    customer_id = Column(Integer, ForeignKey("invoice_customers.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("invoice_suppliers.id"), nullable=False)
    user_id = Column(UUID, ForeignKey("user.id"), nullable=False)
    variable_symbol = Column(String(10), nullable=False)
    order_number = Column(String(20), nullable=True)

    customer = relationship("InvoiceCustomer", back_populates="invoices")
    supplier = relationship("InvoiceSupplier", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice")
    user = relationship("User", back_populates="invoices")

    @property
    def total_price(self):
        return sum([item.total_price for item in self.items])

    def generate_czech_qr_string(self):
        return (
            f"SPD"
            f"*1.0"
            f"*ACC:{self.supplier.iban}"
            f"*AM:{self.total_price:.2f}"
            f"*CC:CZK"
            f"*MSG:faktura {self.invoice_number}"
            f"*X-VS:{self.variable_symbol}"
        )
