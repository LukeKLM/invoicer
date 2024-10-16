from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String

from core.db import BaseModel


class InvoiceItem(BaseModel):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, nullable=False)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    title = Column(String(64), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    user_id = Column(UUID, nullable=False)
