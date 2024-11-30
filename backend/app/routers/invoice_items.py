from fastapi import APIRouter
from fastapi import Depends

from app.models.users import User
from app.schemas.invoice_items import CreateInvoiceItem
from app.schemas.invoice_items import UpdateInvoiceItem
from app.services.api.invoice_items import InvoiceItemApiService
from core.db import SessionLocal
from core.db import get_session
from core.security import get_current_active_user

router = APIRouter(
    prefix="/invoice-items",
    tags=["InvoiceItems"],
)


@router.get("/")
async def get_invoice_items(
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceItemApiService(user, session).get_list()


@router.get("/{invoice_item_id}")
async def get_invoice_item(
    invoice_item_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceItemApiService(user, session).get_detail(invoice_item_id)


@router.post("/")
async def create_invoice_item(
    invoice_item: CreateInvoiceItem,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceItemApiService(user, session).create(invoice_item)


@router.patch("/{invoice_item_id}")
async def update_invoice_item(
    invoice_item_id: int,
    invoice_item: UpdateInvoiceItem,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceItemApiService(user, session).update(
        invoice_item_id,
        invoice_item,
    )


@router.delete("/{invoice_item_id}")
async def delete_invoice_item(
    invoice_item_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceItemApiService(user, session).delete(invoice_item_id)
