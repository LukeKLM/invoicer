from datetime import datetime

from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import Integer
from sqlalchemy import String

from app.enums.invoice_enums import InvoicePaymentType
from app.enums.invoice_enums import InvoiceState
from core.db import BaseModel


class Invoice(BaseModel):
    __tablename__ = "invoice_invoices"

    id = Column(Integer, primary_key=True, index=True)

    due_date = Column(DateTime, nullable=False)
    expose_date = Column(DateTime, default=datetime.now)
    number = Column(String(10), index=True, nullable=False)
    payment_type = Column(SQLAlchemyEnum(InvoicePaymentType), nullable=False)
    state = Column(SQLAlchemyEnum(InvoiceState), nullable=False)
    subscriber_id = Column(Integer, nullable=False)
    supplier_id = Column(Integer, nullable=False)
    user_id = Column(UUID, nullable=False)
    variable_symbol = Column(String(10), nullable=False)
