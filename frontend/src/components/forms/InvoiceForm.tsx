import { InputField } from "@/components/forms_inputs/inputField"
import { SelectField } from "@/components/forms_inputs/selectField"
import React, { useEffect } from "react"
import useInvoiceStore from "@/stores/useInvoiceStore"
import useCustomerStore from "@/stores/useCustomerStore"
import useSupplierStore from "@/stores/useSupplierStore"
import { InvoicePaymentType, InvoiceStateType } from "@/types/invoice"
import { FormSection } from "@/components/ui/form-section"

const paymentTypeLabels: Record<InvoicePaymentType, string> = {
  [InvoicePaymentType.BANK_TRANSFER]: "Bank Transfer",
  [InvoicePaymentType.CASH]: "Cash",
}

const stateLabels: Record<InvoiceStateType, string> = {
  [InvoiceStateType.DRAFT]: "Draft",
  [InvoiceStateType.SENT]: "Sent",
  [InvoiceStateType.PAID]: "Paid",
  [InvoiceStateType.CANCELLED]: "Cancelled",
}

const InvoiceForm: React.FC = () => {
  const { draftInvoice, updateDraft } = useInvoiceStore()
  const { customers, fetchCustomers } = useCustomerStore()
  const { suppliers, fetchSuppliers } = useSupplierStore()

  useEffect(() => {
    fetchCustomers()
    fetchSuppliers()
  }, [fetchCustomers, fetchSuppliers])

  const formValueChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateDraft(name, value);
  }

  const idValueChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    updateDraft(name, value ? Number(value) : undefined);
  }

  const customerOptions = customers.map((customer) => ({ value: customer.id as number, label: customer.name }))
  const supplierOptions = suppliers.map((supplier) => ({ value: supplier.id as number, label: supplier.name }))
  const paymentTypeOptions = Object.values(InvoicePaymentType).map((type) => ({ value: type, label: paymentTypeLabels[type] }))
  const stateOptions = Object.values(InvoiceStateType).map((state) => ({ value: state, label: stateLabels[state] }))


  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <FormSection title="Parties" description="Who issues the invoice and who pays it.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField
            id="supplierId"
            name="supplierId"
            required={true}
            label="Supplier"
            placeholder="Select supplier"
            options={supplierOptions}
            value={draftInvoice.supplierId ?? draftInvoice.supplier?.id ?? undefined}
            onChange={idValueChanged}
            hint={supplierOptions.length ? undefined : "No suppliers yet — add one under Suppliers."}
          />
          <SelectField
            id="customerId"
            name="customerId"
            required={true}
            label="Customer"
            placeholder="Select customer"
            options={customerOptions}
            value={draftInvoice.customerId ?? draftInvoice.customer?.id ?? undefined}
            onChange={idValueChanged}
            hint={customerOptions.length ? undefined : "No customers yet — add one under Customers."}
          />
        </div>
      </FormSection>

      <FormSection title="Details" description="Numbering, dates and payment.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InputField
            id="invoiceNumber"
            name="invoiceNumber"
            type="text"
            required={true}
            label="Invoice Number"
            placeholder="e.g. 2026-0001"
            value={draftInvoice.invoiceNumber}
            onChange={formValueChanged}
          />
          <InputField
            id="variableSymbol"
            name="variableSymbol"
            type="text"
            required={true}
            label="Variable Symbol"
            placeholder="e.g. 20260001"
            hint="Digits only, max 10."
            value={draftInvoice.variableSymbol}
            onChange={formValueChanged}
          />
          <InputField
            id="orderNumber"
            name="orderNumber"
            type="text"
            required={false}
            label="Order Number"
            placeholder="Optional"
            value={draftInvoice.orderNumber || ""}
            onChange={formValueChanged}
          />
          <InputField
            id="exposeDate"
            name="exposeDate"
            type="date"
            required={true}
            label="Expose Date"
            value={draftInvoice.exposeDate}
            onChange={formValueChanged}
          />
          <InputField
            id="dueDate"
            name="dueDate"
            type="date"
            required={true}
            label="Due Date"
            value={draftInvoice.dueDate}
            onChange={formValueChanged}
          />
          <SelectField
            id="paymentType"
            name="paymentType"
            required={true}
            label="Payment Type"
            options={paymentTypeOptions}
            value={draftInvoice.paymentType}
            onChange={formValueChanged}
          />
          <SelectField
            id="state"
            name="state"
            required={true}
            label="State"
            options={stateOptions}
            value={draftInvoice.state}
            onChange={formValueChanged}
          />
        </div>
      </FormSection>
    </form>
  )
}

export default InvoiceForm
