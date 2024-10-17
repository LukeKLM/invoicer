from decimal import Decimal

from pydantic import BaseModel
from pydantic import Field
from pydantic import condecimal


class CreateInvoiceItem(BaseModel):
    invoice_id: int
    price: condecimal(max_digits=10, decimal_places=2)
    title: str = Field(max_length=64)
    quantity: int = 1


class UpdateInvoiceItem(BaseModel):
    invoice_id: int | None = None
    price: condecimal(max_digits=10, decimal_places=2) | None = None
    title: str | None = Field(None, max_length=64)
    quantity: int | None = None


class RetrieveInvoiceItem(BaseModel):
    id: int
    invoice_id: int
    price: Decimal
    title: str
    quantity: int
