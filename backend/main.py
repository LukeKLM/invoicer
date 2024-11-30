from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.invoice_customers import router as invoice_customers_router
from app.routers.invoice_items import router as invoice_items_router
from app.routers.invoice_suppliers import router as invoice_suppliers_router
from app.routers.invoices import router as invoices_router
from core.config import settings
from core.jinja2_env import jinja_env

app = FastAPI(
    title=settings.BACKEND_APP_NAME,
    swagger_ui_parameters={"persistAuthorization": True},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(invoices_router)
app.include_router(invoice_items_router)
app.include_router(invoice_customers_router)
app.include_router(invoice_suppliers_router)

print(f"Jinja initialized: {jinja_env}")
