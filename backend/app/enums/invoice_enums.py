from enum import StrEnum

from app.helpers.translations import INVOICE_PAYMENT_TRANSLATION
from app.helpers.translations import INVOICE_STATE_TRANSLATION


class InvoicePaymentType(StrEnum):
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"

    def get_name(self) -> str:
        return INVOICE_PAYMENT_TRANSLATION.get(self)


class InvoiceState(StrEnum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

    def get_name(self) -> str:
        return INVOICE_STATE_TRANSLATION.get(self)
