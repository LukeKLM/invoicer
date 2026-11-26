from sqlalchemy import UUID
from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy.orm import relationship

from core.db import BaseModel


class SkipPayCalculatorSettings(BaseModel):
    __tablename__ = "skip_pay_calculator_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID, ForeignKey("user.id"), nullable=False)
    customer_id = Column(
        Integer,
        ForeignKey("invoice_customers.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    daily_rate = Column(Numeric(precision=10, scale=2), nullable=False, default=0)
    kd_bonus = Column(Numeric(precision=10, scale=2), nullable=False, default=0)
    repayment = Column(Numeric(precision=10, scale=2), nullable=False, default=0)
    special_bonus = Column(Numeric(precision=10, scale=2), nullable=False, default=0)
    learning_budget = Column(Numeric(precision=10, scale=2), nullable=False, default=0)
    multisport_card = Column(Numeric(precision=10, scale=2), nullable=False, default=0)
    development_percentage = Column(Integer, nullable=False, default=50)
    maintenance_percentage = Column(Integer, nullable=False, default=50)

    # relations
    customer = relationship(
        "InvoiceCustomer",
        back_populates="skip_pay_calculator_settings",
    )
    user = relationship("User", back_populates="skip_pay_calculator_settings")
