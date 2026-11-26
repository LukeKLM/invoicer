from decimal import Decimal
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app.schemas.skip_pay_calculator import CreateSkipPayCalculatorSettings
from app.schemas.skip_pay_calculator import SkipPayCalculationInput
from app.services.skip_pay_calculator import calculate_skip_pay_invoice
from app.services.skip_pay_calculator import count_weekdays_in_month
from app.services.skip_pay_calculator import get_public_holidays_on_working_days
from app.services.skip_pay_calculator import get_working_days_overview


def _settings(**overrides):
    values = {
        "daily_rate": Decimal(4963),
        "kd_bonus": Decimal(0),
        "repayment": Decimal(6406),
        "special_bonus": Decimal(0),
        "learning_budget": Decimal(0),
        "multisport_card": Decimal(0),
        "development_percentage": 50,
        "maintenance_percentage": 50,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_count_weekdays_in_month():
    assert count_weekdays_in_month(2026, 11) == 21
    assert count_weekdays_in_month(2026, 2) == 20


def test_working_days_exclude_public_holidays():
    # listopad 2026: 21 weekdays, 17.11. (Tuesday) is a holiday -> 20 working days
    overview = get_working_days_overview(2026, 11)
    assert overview.weekdays == 21
    assert overview.working_days == 20


def test_calculate_matches_original_script():
    result = calculate_skip_pay_invoice(
        _settings(),
        SkipPayCalculationInput(
            holidays=1,
            vacation_days=Decimal("1.5"),
            year=2026,
            month=11,
        ),
    )

    assert result.weekdays == 21
    assert result.working_days == 20
    assert result.worked_days == Decimal("18.5")
    assert result.net_income == Decimal("91815.5")
    assert result.gross_invoice_amount == Decimal("98221.5")
    assert result.development_share == Decimal("49110.75")
    assert result.maintenance_share == Decimal("49110.75")
    assert result.invoice_total == Decimal("98221.50")
    assert result.net_payout == Decimal("91815.50")


def test_calculate_with_bonuses_and_deductions():
    result = calculate_skip_pay_invoice(
        _settings(
            kd_bonus=Decimal(1000),
            special_bonus=Decimal(500),
            multisport_card=Decimal(400),
            learning_budget=Decimal(300),
            development_percentage=70,
            maintenance_percentage=30,
        ),
        SkipPayCalculationInput(
            holidays=0,
            vacation_days=Decimal(0),
            year=2026,
            month=11,
        ),
    )

    # 4963 * 21 = 104223 + 1000 + 500 = 105723 + 6406 = 112129
    assert result.income_with_special_bonus == Decimal(105723)
    assert result.income_after_multisport == Decimal(105323)
    assert result.gross_invoice_amount == Decimal(112129)
    assert result.development_share == Decimal("78490.30")
    assert result.maintenance_share == Decimal("33638.70")
    assert result.invoice_total == Decimal("112029.00")
    assert result.net_payout == Decimal("105623.00")


def test_percentages_must_add_up_to_100():
    with pytest.raises(ValidationError):
        CreateSkipPayCalculatorSettings(
            customer_id=1,
            development_percentage=60,
            maintenance_percentage=50,
        )


def test_public_holidays_skip_weekends():
    # 2026-07-05 is Sunday, 2026-07-06 Monday
    assert [
        h.date.isoformat() for h in get_public_holidays_on_working_days(2026, 7)
    ] == ["2026-07-06"]
    # Easter 2026: Good Friday 3.4., Easter Monday 6.4.
    assert len(get_public_holidays_on_working_days(2026, 4)) == 2
    # 24.-26.12.2026: Thu, Fri, Sat
    assert len(get_public_holidays_on_working_days(2026, 12)) == 2


def test_holidays_are_counted_automatically_when_not_given():
    result = calculate_skip_pay_invoice(
        _settings(),
        SkipPayCalculationInput(vacation_days=Decimal(0), year=2026, month=11),
    )

    assert result.holidays == 1
    assert result.public_holidays[0].name.startswith("Den boje za svobodu")
    assert result.worked_days == Decimal(20)


def test_manual_holidays_override_automatic_ones():
    result = calculate_skip_pay_invoice(
        _settings(),
        SkipPayCalculationInput(
            holidays=0,
            vacation_days=Decimal(0),
            year=2026,
            month=11,
        ),
    )

    assert result.holidays == 0
    assert result.worked_days == Decimal(21)


def test_due_date_is_15th_of_next_month():
    from datetime import date

    from app.services.skip_pay_calculator import skip_pay_due_date

    assert skip_pay_due_date(date(2026, 11, 25)) == date(2026, 12, 15)
    assert skip_pay_due_date(date(2026, 12, 31)) == date(2027, 1, 15)


def test_invoice_items_add_up_to_invoice_total():
    from app.services.skip_pay_calculator import skip_pay_invoice_items

    result = calculate_skip_pay_invoice(
        _settings(multisport_card=Decimal(400), learning_budget=Decimal(300)),
        SkipPayCalculationInput(vacation_days=Decimal(0), year=2026, month=11),
    )
    items = skip_pay_invoice_items(result)

    assert [item.title for item in items] == [
        "Development",
        "Maintenance",
        "Multisport card",
        "Learning budget",
    ]
    assert sum(item.price * item.quantity for item in items) == result.invoice_total


def test_invoice_items_skip_zero_values():
    from app.services.skip_pay_calculator import skip_pay_invoice_items

    result = calculate_skip_pay_invoice(
        _settings(),
        SkipPayCalculationInput(year=2026, month=11),
    )
    assert [item.title for item in skip_pay_invoice_items(result)] == [
        "Development",
        "Maintenance",
    ]
