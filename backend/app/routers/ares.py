from fastapi import APIRouter

from app.schemas.ares_economic_subjects import AresEconomicSubject
from app.services.ares_service import AresApiService

router = APIRouter(
    prefix="/ares",
    tags=["Ares"],
)


@router.get("/economic-subject/{company_id}")
async def get_economic_subject(company_id: str) -> AresEconomicSubject:
    return await AresApiService().get_economic_subject(company_id)
