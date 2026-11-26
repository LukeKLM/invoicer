from fastapi import APIRouter
from fastapi import Depends
from fastapi import Query

from app.models.users import User
from app.schemas.skip_pay_calculator import CreateSkipPayCalculatorSettings
from app.schemas.skip_pay_calculator import SkipPayCalculationInput
from app.schemas.skip_pay_calculator import UpdateSkipPayCalculatorSettings
from app.services.api.skip_pay_calculator import SkipPayCalculatorApiService
from app.services.skip_pay_calculator import get_working_days_overview
from core.db import SessionLocal
from core.db import get_session
from core.security import get_current_active_user

router = APIRouter(
    prefix="/skip-pay-calculator",
    tags=["SkipPayCalculator"],
)


@router.get("/working-days")
async def get_working_days(
    year: int = Query(ge=2000, le=2100),
    month: int = Query(ge=1, le=12),
    _user: User = Depends(get_current_active_user),
):
    return get_working_days_overview(year, month)


@router.get("/settings")
async def get_skip_pay_settings_list(
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).get_list()


@router.get("/settings/{settings_id}")
async def get_skip_pay_settings(
    settings_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).get_detail(settings_id)


@router.get("/settings/customer/{customer_id}")
async def get_skip_pay_settings_by_customer(
    customer_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).get_by_customer(customer_id)


@router.post("/settings")
async def create_skip_pay_settings(
    settings: CreateSkipPayCalculatorSettings,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).create(settings)


@router.patch("/settings/{settings_id}")
async def update_skip_pay_settings(
    settings_id: int,
    settings: UpdateSkipPayCalculatorSettings,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).update(
        settings_id,
        settings,
    )


@router.delete("/settings/{settings_id}")
async def delete_skip_pay_settings(
    settings_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).delete(settings_id)


@router.post("/settings/{settings_id}/calculate")
async def calculate_skip_pay_invoice(
    settings_id: int,
    data: SkipPayCalculationInput,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).calculate(settings_id, data)


@router.post("/settings/{settings_id}/invoice-draft")
async def build_skip_pay_invoice_draft(
    settings_id: int,
    data: SkipPayCalculationInput,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await SkipPayCalculatorApiService(user, session).build_invoice_draft(
        settings_id,
        data,
    )
