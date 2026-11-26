from datetime import date

from app.exceptions.api_exceptions import BadRequestException
from app.exceptions.api_exceptions import ConflictException
from app.exceptions.api_exceptions import NotFoundException
from app.models.users import User
from app.repositories.invoice_customers import InvoiceCustomerRepository
from app.repositories.invoice_suppliers import InvoiceSupplierRepository
from app.repositories.invoices import InvoiceRepository
from app.repositories.skip_pay_calculator import SkipPayCalculatorSettingsRepository
from app.schemas.skip_pay_calculator import CreateSkipPayCalculatorSettings
from app.schemas.skip_pay_calculator import RetrieveSkipPayCalculatorSettings
from app.schemas.skip_pay_calculator import SkipPayCalculationInput
from app.schemas.skip_pay_calculator import SkipPayCalculationResult
from app.schemas.skip_pay_calculator import SkipPayInvoiceDraft
from app.schemas.skip_pay_calculator import UpdateSkipPayCalculatorSettings
from app.schemas.skip_pay_calculator import validate_percentages
from app.services.api.base_api_service import BaseUserApiService
from app.services.api.invoices import InvoiceApiService
from app.services.skip_pay_calculator import calculate_skip_pay_invoice
from app.services.skip_pay_calculator import skip_pay_due_date
from app.services.skip_pay_calculator import skip_pay_invoice_items
from core.db import SessionLocal


class SkipPayCalculatorApiService(BaseUserApiService):
    def __init__(self, user: User, db_session: SessionLocal):
        super().__init__(user, db_session)
        self.repository = SkipPayCalculatorSettingsRepository(user, db_session)
        self.output_schema = RetrieveSkipPayCalculatorSettings

    async def _validate_customer(
        self,
        customer_id: int,
        settings_id: int | None = None,
    ):
        customer = await InvoiceCustomerRepository(
            self.user,
            self.db_session,
        ).get_detail(customer_id)
        if not customer:
            message = f"InvoiceCustomer with id {customer_id} not found"
            raise NotFoundException(message)

        existing = await self.repository.get_by_customer(customer_id)
        if existing and existing.id != settings_id:
            message = (
                f"Skip Pay calculator settings for customer {customer_id} already exist"
            )
            raise ConflictException(message)

    async def _get_settings_or_404(self, settings_id: int):
        settings = await self.repository.get_detail(settings_id)
        if not settings:
            message = (
                f"{self.repository.model.__name__} with id {settings_id} not found"
            )
            raise NotFoundException(message)
        return settings

    async def get_by_customer(self, customer_id: int):
        settings = await self.repository.get_by_customer(customer_id)
        if not settings:
            message = (
                f"Skip Pay calculator settings for customer {customer_id} not found"
            )
            raise NotFoundException(message)
        return self.output_schema.model_validate(settings)

    async def create(self, item: CreateSkipPayCalculatorSettings):
        await self._validate_customer(item.customer_id)
        return await super().create(item)

    async def update(self, item_id: int, item: UpdateSkipPayCalculatorSettings):
        settings = await self._get_settings_or_404(item_id)

        if item.customer_id is not None:
            await self._validate_customer(item.customer_id, settings_id=item_id)

        development = item.development_percentage
        maintenance = item.maintenance_percentage
        try:
            validate_percentages(
                settings.development_percentage if development is None else development,
                settings.maintenance_percentage if maintenance is None else maintenance,
            )
        except ValueError as e:
            raise BadRequestException(str(e)) from e

        return await super().update(item_id, item)

    async def calculate(
        self,
        settings_id: int,
        data: SkipPayCalculationInput,
    ) -> SkipPayCalculationResult:
        settings = await self._get_settings_or_404(settings_id)
        return calculate_skip_pay_invoice(settings, data)

    async def build_invoice_draft(
        self,
        settings_id: int,
        data: SkipPayCalculationInput,
    ) -> SkipPayInvoiceDraft:
        settings = await self._get_settings_or_404(settings_id)
        result = calculate_skip_pay_invoice(settings, data)
        next_number = await InvoiceApiService(
            self.user,
            self.db_session,
        ).get_next_number()

        # supplier and order number carry over from the customer's previous invoice
        previous_invoice = await InvoiceRepository(
            self.user,
            self.db_session,
        ).get_latest_for_customer(
            settings.customer_id,
        )
        if previous_invoice:
            supplier_id = previous_invoice.supplier_id
            order_number = previous_invoice.order_number
        else:
            suppliers = await InvoiceSupplierRepository(
                self.user,
                self.db_session,
            ).get_list()
            supplier_id = suppliers[0].id if suppliers else None
            order_number = None

        expose_date = date.today()
        return SkipPayInvoiceDraft(
            customer_id=settings.customer_id,
            supplier_id=supplier_id,
            invoice_number=next_number.invoice_number,
            variable_symbol=next_number.variable_symbol,
            order_number=order_number,
            expose_date=expose_date,
            due_date=skip_pay_due_date(expose_date),
            items=skip_pay_invoice_items(result),
            calculation=result,
        )
