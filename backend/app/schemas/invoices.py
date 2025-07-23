from datetime import date

from pydantic import BaseModel
from pydantic import Field
from pydantic import condecimal

from app.enums.invoice_enums import InvoicePaymentType
from app.enums.invoice_enums import InvoiceState


class InvoiceSupplierSchema(BaseModel):
    id: int
    bank_account: str
    bank_code: str
    iban: str | None
    email: str
    name: str
    vat_id: str
    city: str
    country: str
    street: str
    postal_code: str

    class Config:
        from_attributes = True


class InvoiceCustomerSchema(BaseModel):
    id: int
    email: str
    name: str
    vat_id: str
    dic_id: str | None
    city: str
    country: str
    street: str
    postal_code: str

    class Config:
        from_attributes = True


class InvoiceItemSchema(BaseModel):
    id: int | None = None
    invoice_id: int | None = None
    price: condecimal(max_digits=10, decimal_places=2)
    title: str = Field(max_length=64)
    quantity: int = 1

    class Config:
        from_attributes = True


class InvoiceCreate(BaseModel):
    due_date: date
    expose_date: date

    invoice_number: str = Field(max_length=10)
    payment_type: InvoicePaymentType
    state: InvoiceState
    customer_id: int
    supplier_id: int
    variable_symbol: str = Field(max_length=10)
    items: list[InvoiceItemSchema] = []
    order_number: str | None = Field(max_length=20, default=None)

    class Config:
        from_attributes = True


class InvoiceUpdate(BaseModel):
    due_date: date | None = None
    expose_date: date | None = None

    invoice_number: str | None = Field(max_length=10, default=None)
    payment_type: InvoicePaymentType | None = None
    state: InvoiceState | None = None
    customer_id: int | None = None
    supplier_id: int | None = None
    variable_symbol: str | None = Field(max_length=10, default=None)
    items: list[InvoiceItemSchema] = []
    order_number: str | None = Field(max_length=20, default=None)


class InvoiceRetrieve(BaseModel):
    id: int
    due_date: date
    expose_date: date
    invoice_number: str
    payment_type: InvoicePaymentType
    state: InvoiceState
    variable_symbol: str
    items: list[InvoiceItemSchema] = []
    supplier: InvoiceSupplierSchema
    customer: InvoiceCustomerSchema
    order_number: str | None
    total_price: str | None = None

    class Config:
        from_attributes = True
