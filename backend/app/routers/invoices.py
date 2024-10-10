from fastapi import APIRouter
from fastapi import Depends

from app.models.users import User
from app.services.api.invoices import InvoiceApiService
from core.db import SessionLocal
from core.db import get_session
from core.security import current_active_user

router = APIRouter(
    prefix="/invoices",
    tags=["Invoices"],
)


@router.get("/")
async def get_invoices(
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    invoices = await InvoiceApiService(user, session).get_invoices()
    print(user)
    print(session)
    return invoices
