from sqlalchemy import Column
from sqlalchemy import Date
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String

from core.db import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, index=True)
    date = Column(Date)
    due_date = Column(Date)
    amount = Column(Numeric)
    status = Column(String)
