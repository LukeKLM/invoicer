import re
from datetime import date

_NUMBER_RE = re.compile(r"^(.*?)(\d+)$")
VARIABLE_SYMBOL_MAX_LENGTH = 10


def _sort_key(invoice_number: str):
    match = _NUMBER_RE.match(invoice_number)
    if not match:
        return (invoice_number, -1)
    prefix, counter = match.groups()
    return (prefix, int(counter))


def get_latest_invoice_number(invoice_numbers: list[str]) -> str | None:
    """Highest number, not the newest row - invoices aren't always created in number order."""
    if not invoice_numbers:
        return None
    return max(invoice_numbers, key=_sort_key)


def increment_invoice_number(latest: str | None, today: date | None = None) -> str:
    """'2025-0009' -> '2025-0010'; keeps the prefix and zero padding of the latest number."""
    if latest is None:
        return f"{(today or date.today()).year}-0001"

    match = _NUMBER_RE.match(latest)
    if not match:
        message = (
            f"Invoice number '{latest}' doesn't end with a number, can't increment it"
        )
        raise ValueError(message)

    prefix, counter = match.groups()
    return f"{prefix}{str(int(counter) + 1).zfill(len(counter))}"


def variable_symbol_from_number(invoice_number: str) -> str:
    """'2025-0010' -> '20250010' (variable symbol can contain only digits, max 10)."""
    return re.sub(r"\D", "", invoice_number)[-VARIABLE_SYMBOL_MAX_LENGTH:]
