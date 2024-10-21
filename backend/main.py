import uuid

from fastapi import FastAPI
from fastapi_users import FastAPIUsers

from app.models.users import User
from app.routers.invoice_customers import router as invoice_customers_router
from app.routers.invoice_items import router as invoice_items_router
from app.routers.invoice_suppliers import router as invoice_suppliers_router
from app.routers.invoices import router as invoices_router
from app.schemas.users import UserCreate
from app.schemas.users import UserRead
from core.config import settings
from core.jinja2_env import jinja_env
from core.security import auth_backend
from core.security import get_user_manager

app = FastAPI(
    title=settings.BACKEND_APP_NAME,
    swagger_ui_parameters={"persistAuthorization": True},
)

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(invoices_router)
app.include_router(invoice_items_router)
app.include_router(invoice_customers_router)
app.include_router(invoice_suppliers_router)

print(f"Jinja initialized: {jinja_env}")
