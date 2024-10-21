from typing import TYPE_CHECKING

from starlette.responses import StreamingResponse

from app.models.users import User
from app.repositories.invoices import InvoiceRepository
from app.schemas.invoices import InvoiceRetrieve
from app.services.api.base_api_service import BaseApiService
from app.services.pdf_service import generate_pdf
from core.db import SessionLocal

if TYPE_CHECKING:
    from io import BytesIO


class InvoiceApiService(BaseApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = InvoiceRepository(user, db_session)
        self.output_schema = InvoiceRetrieve

    async def get_pdf(self, invoice_id: int) -> StreamingResponse:
        invoice_name = "invoice"
        headers = {
            "Content-Disposition": f'attachment; filename="{invoice_name}.pdf"',
            "Content-Type": "application/pdf",
        }

        template = "invoice.html"
        pdf_file: BytesIO = await generate_pdf(
            template=template,
            context={
                "title": "Invoice",
                "content": "This is the invoice content",
            },
        )

        return StreamingResponse(pdf_file, headers=headers)
