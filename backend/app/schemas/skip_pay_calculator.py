from datetime import date
from decimal import Decimal

from pydantic import BaseModel
from pydantic import Field
from pydantic import condecimal
from pydantic import model_validator

from app.enums.invoice_enums import InvoicePaymentType
from app.enums.invoice_enums import InvoiceState
from app.schemas.invoices import InvoiceItemSchema

money = condecimal(max_digits=10, decimal_places=2, ge=0)


def validate_percentages(development: int, maintenance: int):
    if development + maintenance != 100:
        message = "Development and maintenance percentages must add up to 100"
        raise ValueError(message)


class CreateSkipPayCalculatorSettings(BaseModel):
    customer_id: int
    daily_rate: money = Decimal(0)
    kd_bonus: money = Decimal(0)
    repayment: money = Decimal(0)
    special_bonus: money = Decimal(0)
    learning_budget: money = Decimal(0)
    multisport_card: money = Decimal(0)
    development_percentage: int = Field(50, ge=0, le=100)
    maintenance_percentage: int = Field(50, ge=0, le=100)

    @model_validator(mode="after")
    def check_percentages(self):
        validate_percentages(self.development_percentage, self.maintenance_percentage)
        return self


class UpdateSkipPayCalculatorSettings(BaseModel):
    customer_id: int | None = None
    daily_rate: money | None = None
    kd_bonus: money | None = None
    repayment: money | None = None
    special_bonus: money | None = None
    learning_budget: money | None = None
    multisport_card: money | None = None
    development_percentage: int | None = Field(None, ge=0, le=100)
    maintenance_percentage: int | None = Field(None, ge=0, le=100)


class RetrieveSkipPayCalculatorSettings(CreateSkipPayCalculatorSettings):
    id: int

    class Config:
        from_attributes = True


class PublicHoliday(BaseModel):
    date: date
    name: str


class WorkingDaysOverview(BaseModel):
    year: int
    month: int
    weekdays: int  # Monday-Friday days in the month
    working_days: int  # weekdays minus public holidays
    public_holidays: list[PublicHoliday]


class SkipPayCalculationInput(BaseModel):
    # None = use Czech public holidays falling on working days of the month
    holidays: int | None = Field(None, ge=0)
    vacation_days: condecimal(max_digits=4, decimal_places=1, ge=0) = Decimal(0)
    year: int = Field(default_factory=lambda: date.today().year, ge=2000, le=2100)
    month: int = Field(default_factory=lambda: date.today().month, ge=1, le=12)


class SkipPayCalculationResult(BaseModel):
    year: int
    month: int

    # rates used for the calculation
    daily_rate: Decimal
    kd_bonus: Decimal
    special_bonus: Decimal
    repayment: Decimal
    multisport_card: Decimal
    learning_budget: Decimal
    development_percentage: int
    maintenance_percentage: int

    # working time
    weekdays: int
    public_holidays: list[PublicHoliday]
    holidays: int
    working_days: int
    vacation_days: Decimal
    worked_days: Decimal

    # results
    net_income: Decimal
    income_with_kd_bonus: Decimal
    income_with_special_bonus: Decimal
    gross_invoice_amount: Decimal
    income_after_multisport: Decimal

    # invoicing
    development_share: Decimal
    maintenance_share: Decimal
    invoice_total: Decimal
    net_payout: Decimal


class SkipPayInvoiceDraft(BaseModel):
    """Pre-filled invoice for the review dialog - not saved until the user creates it."""

    customer_id: int
    supplier_id: int | None
    invoice_number: str
    variable_symbol: str
    order_number: str | None
    expose_date: date
    due_date: date
    payment_type: InvoicePaymentType = InvoicePaymentType.BANK_TRANSFER
    state: InvoiceState = InvoiceState.DRAFT
    items: list[InvoiceItemSchema]
    calculation: SkipPayCalculationResult
