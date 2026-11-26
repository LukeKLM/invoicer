from datetime import date

import pytest

from app.services.invoice_numbering import get_latest_invoice_number
from app.services.invoice_numbering import increment_invoice_number
from app.services.invoice_numbering import variable_symbol_from_number


def test_latest_is_highest_number_not_newest_row():
    # 2025-0007 was created before 2025-0006
    assert (
        get_latest_invoice_number(
            ["2025-0004", "2025-0005", "2025-0007", "2025-0006", "2025-0009"],
        )
        == "2025-0009"
    )
    assert get_latest_invoice_number(["2025-0099", "2025-0100"]) == "2025-0100"
    assert get_latest_invoice_number([]) is None


def test_increment_keeps_prefix_and_padding():
    assert increment_invoice_number("2025-0009") == "2025-0010"
    assert increment_invoice_number("2025-0999") == "2025-1000"
    assert increment_invoice_number("2025-9999") == "2025-10000"


def test_first_invoice():
    assert increment_invoice_number(None, today=date(2026, 11, 25)) == "2026-0001"


def test_number_without_counter_fails():
    with pytest.raises(ValueError, match="doesn't end with a number"):
        increment_invoice_number("ABC")


def test_variable_symbol():
    assert variable_symbol_from_number("2025-0010") == "20250010"
