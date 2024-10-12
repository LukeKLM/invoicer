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


class InvoiceRetrieve(InvoiceCreate):
    id: int

    class Config:
        orm_mode = True
