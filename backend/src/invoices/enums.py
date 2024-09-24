from enum import StrEnum


class InvoicePaymentType(StrEnum):
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"


class InvoiceState(StrEnum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    PAID = "PAID"
    CANCELLED = "CANCELLED"
