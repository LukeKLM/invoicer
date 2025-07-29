import { InputField } from "@/components/forms_inputs/inputField"
import React from "react"
import useInvoiceStore from "@/stores/useInvoiceStore"


const InvoiceForm: React.FC = () => {
  const { draftInvoice, updateDraft } = useInvoiceStore()


  const formValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateDraft(name, value);
  }


  return (
    <div>
      <form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            id="dueDate"
            name="dueDate"
            className="mt-3"
            type="date"
            required={true}
            label="Due Date"
            value={draftInvoice.dueDate}
            onChange={formValueChanged}
          />
          <InputField
            id="exposeDate"
            name="exposeDate"
            className="mt-3"
            type="date"
            required={true}
            label="Expose Date"
            value={draftInvoice.exposeDate}
            onChange={formValueChanged}
          />
          <InputField
            id="invoiceNumber"
            name="invoiceNumber"
            className="mt-3"
            type="text"
            required={true}
            label="Invoice Number"
            value={draftInvoice.invoiceNumber}
            onChange={formValueChanged}
          />
          <InputField
            id="orderNumber"
            name="orderNumber"
            className="mt-3"
            type="text"
            required={false}
            label="Order Number"
            value={draftInvoice.orderNumber || ""}
            onChange={formValueChanged}
          />
          <InputField
            id="paymentType"
            name="paymentType"
            className="mt-3"
            type="text"
            required={true}
            label="Payment Type"
            value={draftInvoice.paymentType}
            onChange={formValueChanged}
          />
          <InputField
            id="state"
            name="state"
            className="mt-3"
            type="text"
            required={true}
            label="State"
            value={draftInvoice.state}
            onChange={formValueChanged}
          />
          <InputField
            id="customerId"
            name="customerId"
            className="mt-3"
            type="number"
            required={true}
            label="Customer ID"
            value={draftInvoice.customerId}
            onChange={formValueChanged}
          />
          <InputField
            id="supplierId"
            name="supplierId"
            className="mt-3"
            type="number"
            required={true}
            label="Supplier ID"
            value={draftInvoice.supplierId}
            onChange={formValueChanged}
          />
          <InputField
            id="variableSymbol"
            name="variableSymbol"
            className="mt-3"
            type="text"
            required={true}
            label="Variable Symbol"
            value={draftInvoice.variableSymbol}
            onChange={formValueChanged}
          />
        </div>
      </form>
    </div>
  )
}

export default InvoiceForm
