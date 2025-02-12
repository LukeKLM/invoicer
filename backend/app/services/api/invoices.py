from typing import TYPE_CHECKING

from sqlalchemy.orm import selectinload
from starlette.responses import StreamingResponse

from app.exceptions.api_exceptions import NotFoundException
from app.models import Invoice
from app.models.users import User
from app.repositories.invoice_items import InvoiceItemRepository
from app.repositories.invoices import InvoiceRepository
from app.schemas.invoices import InvoiceCreate
from app.schemas.invoices import InvoiceItemSchema
from app.schemas.invoices import InvoiceRetrieve
from app.services.api.base_api_service import BaseUserApiService
from app.services.pdf_service import generate_pdf
from app.services.qr_code_service import generate_qr_svg
from core.db import SessionLocal

if TYPE_CHECKING:
    from io import BytesIO


class InvoiceApiService(BaseUserApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        self.db_session = db_session
        super().__init__(user, db_session)
        self.repository = InvoiceRepository(user, db_session)
        self.output_schema = InvoiceRetrieve

    async def get_detail(self, item_id: int):
        invoice = await self.repository.get_detail(item_id)
        if not invoice:
            message = f"{self.repository.model.__name__} with id {item_id} not found"
            raise NotFoundException(message)

        # todo: make this more general - to put it in base class
        #  - converting related sqlalchemy objects to pydantic objects
        items = [InvoiceItemSchema.model_validate(item) for item in invoice.items]

        invoice_data = {**invoice.__dict__, "items": items}
        return self.output_schema(**invoice_data)

    async def create_with_items(self, data: InvoiceCreate):
        data_dict = data.model_dump(exclude_none=True)
        items = data_dict.pop("items", [])

        # todo: do some validation here?

        invoice = await self.repository.create(data_dict)
        self.db_session.flush(invoice)

        invoice_items = [{**item, "invoice_id": invoice.id} for item in items]
        new_items = await InvoiceItemRepository(self.user, self.db_session).bulk_create(
            invoice_items,
        )
        self.db_session.flush(new_items)
        mapped_items = [InvoiceItemSchema(**item.__dict__) for item in new_items]

        new_invoice = self.output_schema(**invoice.__dict__, items=mapped_items)
        await self.db_session.commit()
        return new_invoice

    async def update_with_items(self, invoice_id: int, invoice_data: InvoiceCreate):
        data_dict = invoice_data.model_dump(exclude_none=True)
        items = data_dict.pop("items", [])

        invoice = await self.repository.update(invoice_id, data_dict)
        self.db_session.flush(invoice)

        await InvoiceItemRepository(self.user, self.db_session).bulk_update(items)

        mapped_items = [InvoiceItemSchema(**item) for item in items]
        updated_invoice = self.output_schema(**invoice.__dict__, items=mapped_items)
        await self.db_session.commit()

        return updated_invoice

    async def get_list(self):
        invoices = await self.repository.get_list(
            options=selectinload(Invoice.items),
        )

        mapped_invoices = []
        for invoice in invoices:
            items = [InvoiceItemSchema.model_validate(item) for item in invoice.items]
            invoice_data = {**invoice.__dict__, "items": items}
            mapped_invoices.append(
                self.output_schema(**invoice_data),
            )

        return mapped_invoices

    async def get_pdf(self, invoice_id: int) -> StreamingResponse:
        invoice = await self.repository.get_detail_with_relations(invoice_id)

        invoice_name = "invoice"
        headers = {
            "Content-Disposition": f'attachment; filename="{invoice_name}.pdf"',
            "Content-Type": "application/pdf",
        }

        template = "invoice.html"
        pdf_file: BytesIO = await generate_pdf(
            template=template,
            context={
                "invoice": invoice,
                "qr_code": generate_qr_svg(
                    invoice.generate_czech_qr_string(),
                ),
            },
        )

        return StreamingResponse(pdf_file, headers=headers)
