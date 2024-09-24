from datetime import datetime

from sqlalchemy import Column
from sqlalchemy import DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import Integer
from sqlalchemy import String

from core.db import BaseModel
from src.invoices.enums import InvoicePaymentType
from src.invoices.enums import InvoiceState


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
    variable_symbol = Column(String(10), nullable=False)
