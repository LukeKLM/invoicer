from enum import StrEnum

from app.helpers.translations import INVOICE_PAYMENT_TRANSLATION
from app.helpers.translations import INVOICE_STATE_TRANSLATION


class InvoicePaymentType(StrEnum):
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"

    @staticmethod
    def get_name(key: str) -> str:
        return INVOICE_PAYMENT_TRANSLATION.get(key)


class InvoiceState(StrEnum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

    @staticmethod
    def get_name(cls, key: str) -> str:
        return INVOICE_STATE_TRANSLATION.get(key)
