from fastapi import APIRouter
from fastapi import Depends

from app.models import User
from app.services.ares.ares_schema import AresEconomicSubject
from app.services.ares.ares_service import AresApiService
from core.security import get_current_active_user

router = APIRouter(
    prefix="/ares",
    tags=["Ares"],
)


@router.get("/economic-subject/{company_id}")
async def get_economic_subject(
    company_id: str,
    user: User = Depends(get_current_active_user),
) -> AresEconomicSubject:
    return await AresApiService().get_economic_subject(company_id)
