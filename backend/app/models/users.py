from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import relationship

from core.db import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    # relations
    suppliers = relationship("InvoiceSupplier", back_populates="user")
    customers = relationship("InvoiceCustomer", back_populates="user")
    invoices = relationship("Invoice", back_populates="user")
    invoice_items = relationship("InvoiceItem", back_populates="user")
