from fastapi import APIRouter
from fastapi import Depends

from app.models.users import User
from app.schemas.customers import CreateInvoiceCustomer
from app.schemas.customers import UpdateInvoiceCustomer
from app.services.api.invoice_customers import InvoiceCustomerApiService
from core.db import SessionLocal
from core.db import get_session
from core.security import get_current_active_user

router = APIRouter(
    prefix="/invoice-customers",
    tags=["InvoiceCustomers"],
)


@router.get("/")
async def get_invoice_customers(
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceCustomerApiService(user, session).get_list()


@router.get("/{invoice_customer_id}")
async def get_invoice_customer(
    invoice_customer_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceCustomerApiService(user, session).get_detail(
        invoice_customer_id,
    )


@router.post("/")
async def create_invoice_customer(
    invoice_customer: CreateInvoiceCustomer,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceCustomerApiService(user, session).create(invoice_customer)


@router.patch("/{invoice_customer_id}")
async def update_invoice_customer(
    invoice_customer_id: int,
    invoice_customer: UpdateInvoiceCustomer,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceCustomerApiService(user, session).update(
        invoice_customer_id,
        invoice_customer,
    )


@router.delete("/{invoice_customer_id}")
async def delete_invoice_customer(
    invoice_customer_id: int,
    user: User = Depends(get_current_active_user),
    session: SessionLocal = Depends(get_session),
):
    return await InvoiceCustomerApiService(user, session).delete(invoice_customer_id)
