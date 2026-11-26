import calendar
from datetime import date
from decimal import ROUND_UP
from decimal import Decimal

import holidays as holidays_lib

from app.models import SkipPayCalculatorSettings
from app.schemas.invoices import InvoiceItemSchema
from app.schemas.skip_pay_calculator import PublicHoliday
from app.schemas.skip_pay_calculator import SkipPayCalculationInput
from app.schemas.skip_pay_calculator import SkipPayCalculationResult
from app.schemas.skip_pay_calculator import WorkingDaysOverview

CENTS = Decimal("0.01")


def count_weekdays_in_month(year: int, month: int) -> int:
    """Count Monday-Friday days in the month, public holidays included."""
    return sum(
        1
        for day in range(1, calendar.monthrange(year, month)[1] + 1)
        if date(year, month, day).weekday() < 5
    )


def get_public_holidays_on_working_days(year: int, month: int) -> list[PublicHoliday]:
    """Czech public holidays in the month that fall on Monday-Friday (weekend ones don't reduce worked days)."""
    czech_holidays = holidays_lib.CZ(years=year, language="cs")
    return [
        PublicHoliday(date=day, name=name)
        for day, name in sorted(czech_holidays.items())
        if day.month == month and day.weekday() < 5
    ]


def get_working_days_overview(year: int, month: int) -> WorkingDaysOverview:
    weekdays = count_weekdays_in_month(year, month)
    public_holidays = get_public_holidays_on_working_days(year, month)
    return WorkingDaysOverview(
        year=year,
        month=month,
        weekdays=weekdays,
        working_days=weekdays - len(public_holidays),
        public_holidays=public_holidays,
    )


def _percentage_share(amount: Decimal, percentage: int) -> Decimal:
    return (amount * percentage / 100).quantize(CENTS, rounding=ROUND_UP)


def calculate_skip_pay_invoice(
    settings: SkipPayCalculatorSettings,
    data: SkipPayCalculationInput,
) -> SkipPayCalculationResult:
    weekdays = count_weekdays_in_month(data.year, data.month)
    public_holidays = get_public_holidays_on_working_days(data.year, data.month)
    holidays = len(public_holidays) if data.holidays is None else data.holidays
    working_days = weekdays - holidays
    worked_days = working_days - data.vacation_days

    net_income = settings.daily_rate * worked_days
    income_with_kd_bonus = net_income + settings.kd_bonus
    income_with_special_bonus = income_with_kd_bonus + settings.special_bonus
    gross_invoice_amount = income_with_special_bonus + settings.repayment
    income_after_multisport = income_with_special_bonus - settings.multisport_card

    development_share = _percentage_share(
        gross_invoice_amount,
        settings.development_percentage,
    )
    maintenance_share = _percentage_share(
        gross_invoice_amount,
        settings.maintenance_percentage,
    )

    invoice_total = (
        development_share
        + maintenance_share
        - settings.multisport_card
        + settings.learning_budget
    )
    net_payout = invoice_total - settings.repayment

    return SkipPayCalculationResult(
        year=data.year,
        month=data.month,
        daily_rate=settings.daily_rate,
        kd_bonus=settings.kd_bonus,
        special_bonus=settings.special_bonus,
        repayment=settings.repayment,
        multisport_card=settings.multisport_card,
        learning_budget=settings.learning_budget,
        development_percentage=settings.development_percentage,
        maintenance_percentage=settings.maintenance_percentage,
        weekdays=weekdays,
        public_holidays=public_holidays,
        holidays=holidays,
        working_days=working_days,
        vacation_days=data.vacation_days,
        worked_days=worked_days,
        net_income=net_income,
        income_with_kd_bonus=income_with_kd_bonus,
        income_with_special_bonus=income_with_special_bonus,
        gross_invoice_amount=gross_invoice_amount,
        income_after_multisport=income_after_multisport,
        development_share=development_share,
        maintenance_share=maintenance_share,
        invoice_total=invoice_total,
        net_payout=net_payout,
    )


# Skip Pay invoices are due on the 15th of the month following the expose date
SKIP_PAY_DUE_DAY = 15


def skip_pay_due_date(expose_date: date) -> date:
    if expose_date.month == 12:
        return date(expose_date.year + 1, 1, SKIP_PAY_DUE_DAY)
    return date(expose_date.year, expose_date.month + 1, SKIP_PAY_DUE_DAY)


def skip_pay_invoice_items(result: SkipPayCalculationResult) -> list[InvoiceItemSchema]:
    """Items add up to result.invoice_total."""
    items = [
        InvoiceItemSchema(title="Development", price=result.development_share),
        InvoiceItemSchema(title="Maintenance", price=result.maintenance_share),
    ]
    if result.multisport_card:
        items.append(
            InvoiceItemSchema(title="Multisport card", price=-result.multisport_card),
        )
    if result.learning_budget:
        items.append(
            InvoiceItemSchema(title="Learning budget", price=result.learning_budget),
        )
    return items
