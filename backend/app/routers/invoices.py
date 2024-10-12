from fastapi import APIRouter
from fastapi import Depends

from app.models.users import User
from app.schemas.invoices import InvoiceCreate
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
    return await InvoiceApiService(user, session).get_invoices()


@router.get("/{invoice_id}")
async def get_invoice(
    invoice_id: int,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceApiService(user, session).get_invoice(invoice_id)


@router.post("/")
async def create_invoice(
    invoice: InvoiceCreate,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceApiService(user, session).create_invoice(invoice)
