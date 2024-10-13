from datetime import date

from pydantic import BaseModel
from pydantic import Field

from app.enums.invoice_enums import InvoicePaymentType
from app.enums.invoice_enums import InvoiceState


class InvoiceCreate(BaseModel):
    due_date: date
    expose_date: date

    invoice_number: str = Field(max_length=10)
    payment_type: InvoicePaymentType
    state: InvoiceState
    subscriber_id: int
    supplier_id: int
    variable_symbol: str = Field(max_length=10)


class InvoiceUpdate(BaseModel):
    due_date: date | None = None
    expose_date: date | None = None

    invoice_number: str | None = Field(max_length=10, default=None)
    payment_type: InvoicePaymentType | None = None
    state: InvoiceState | None = None
    subscriber_id: int | None = None
    supplier_id: int | None = None
    variable_symbol: str | None = Field(max_length=10, default=None)


class InvoiceRetrieve(InvoiceCreate):
    id: int

    class Config:
        orm_mode = True
