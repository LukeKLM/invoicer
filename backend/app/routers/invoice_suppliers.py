from fastapi import APIRouter
from fastapi import Depends

from app.models.users import User
from app.schemas.suppliers import CreateInvoiceSupplier
from app.schemas.suppliers import UpdateInvoiceSupplier
from app.services.api.invoice_suppliers import InvoiceSupplierApiService
from core.db import SessionLocal
from core.db import get_session
from core.security import get_current_active_user

router = APIRouter(
    prefix="/invoice_suppliers",
    tags=["InvoiceSuppliers"],
)


@router.get("/")
async def get_invoice_suppliers(
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceSupplierApiService(user, session).get_list()


@router.get("/{invoice_supplier_id}")
async def get_invoice_supplier(
    invoice_supplier_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceSupplierApiService(user, session).get_detail(
        invoice_supplier_id,
    )


@router.post("/")
async def create_invoice_supplier(
    invoice_supplier: CreateInvoiceSupplier,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceSupplierApiService(user, session).create(invoice_supplier)


@router.patch("/{invoice_supplier_id}")
async def update_invoice_supplier(
    invoice_supplier_id: int,
    invoice_supplier: UpdateInvoiceSupplier,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceSupplierApiService(user, session).update(
        invoice_supplier_id,
        invoice_supplier,
    )


@router.delete("/{invoice_supplier_id}")
async def delete_invoice_supplier(
    invoice_supplier_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceSupplierApiService(user, session).delete(invoice_supplier_id)
