from pydantic import BaseModel
from pydantic import Field


class CreateInvoiceCustomer(BaseModel):
    email: str = Field(max_length=255)
    name: str = Field(max_length=255)
    vat_id: str = Field(max_length=50)

    city: str = Field(max_length=255)
    country: str = Field(max_length=255)
    street: str = Field(max_length=255)
    postal_code: str = Field(max_length=20)


class UpdateInvoiceCustomer(BaseModel):
    email: str | None = Field(None, max_length=255)
    name: str | None = Field(None, max_length=255)
    vat_id: str | None = Field(None, max_length=50)

    city: str | None = Field(None, max_length=255)
    country: str | None = Field(None, max_length=255)
    street: str | None = Field(None, max_length=255)
    postal_code: str | None = Field(None, max_length=20)


class RetrieveInvoiceCustomer(CreateInvoiceCustomer):
    id: int

    class Config:
        from_attributes = True
