from fastapi import APIRouter
from fastapi import Depends
from starlette.responses import StreamingResponse

from app.models.users import User
from app.schemas.invoices import InvoiceCreate
from app.schemas.invoices import InvoiceUpdate
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
    return await InvoiceApiService(user, session).get_list()


@router.get("/{invoice_id}")
async def get_invoice(
    invoice_id: int,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceApiService(user, session).get_detail(invoice_id)


@router.post("/")
async def create_invoice(
    invoice: InvoiceCreate,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceApiService(user, session).create(invoice)


@router.patch("/{invoice_id}")
async def update_invoice(
    invoice_id: int,
    invoice: InvoiceUpdate,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceApiService(user, session).update(invoice_id, invoice)


@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: int,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceApiService(user, session).delete(invoice_id)


@router.get("/{invoice_id}/pdf")
async def get_invoice_pdf(
    invoice_id: int,
    user: User = Depends(current_active_user),
    session: SessionLocal = Depends(get_session),
) -> StreamingResponse:
    return await InvoiceApiService(user, session).get_pdf(invoice_id)
