import React from "react"
import { Plus, Trash2 } from "lucide-react"
import useInvoiceStore from "@/stores/useInvoiceStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormSection } from "@/components/ui/form-section"
import { itemAmount, itemsTotal } from "@/components/invoices/invoiceUtils"
import { formatCurrency } from "@/lib/format"
import { Sensitive } from "@/components/ui/sensitive"

const ROW_GRID = "grid grid-cols-[1fr_1fr_auto] gap-x-3 gap-y-2 sm:grid-cols-[minmax(0,1fr)_5.5rem_8rem_7.5rem_2rem] sm:items-center"

const InvoiceItemForm: React.FC = () => {
  const { draftInvoice, updateDraftItem, appendDefaultItem, deleteDraftInvoiceItem } = useInvoiceStore()

  const formValueChanged = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    updateDraftItem(index, event.target.name, event.target.value)
  }

  const total = itemsTotal(draftInvoice.items)

  return (
    <FormSection
      title="Items"
      description="What you're billing for."
      actions={
        <Button type="button" variant="outline" size="sm" onClick={() => appendDefaultItem()}>
          <Plus />
          Add item
        </Button>
      }
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="overflow-hidden rounded-lg border">
          <div className={`${ROW_GRID} hidden border-b bg-muted/50 px-3 py-2 text-xs font-medium uppercase text-muted-foreground sm:grid`}>
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price</span>
            <span className="text-right">Amount</span>
            <span className="sr-only">Remove</span>
          </div>

          {draftInvoice.items.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No items yet.{" "}
              <button type="button" className="font-medium text-primary hover:underline" onClick={() => appendDefaultItem()}>
                Add the first one
              </button>
            </div>
          ) : (
            <ul className="divide-y">
              {draftInvoice.items.map((item, index) => {
                const fieldId = (name: string) => `invoice-item-${index}-${name}`
                return (
                  <li key={index} className={`${ROW_GRID} px-3 py-3 sm:py-2`}>
                    <div className="col-span-3 sm:col-span-1">
                      <label htmlFor={fieldId("title")} className="mb-1 block text-xs font-medium text-muted-foreground sm:sr-only">
                        Description <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id={fieldId("title")}
                        name="title"
                        type="text"
                        required={true}
                        placeholder="e.g. Web development — March"
                        value={item.title}
                        onChange={(event) => formValueChanged(index, event)}
                      />
                    </div>
                    <div>
                      <label htmlFor={fieldId("quantity")} className="mb-1 block text-xs font-medium text-muted-foreground sm:sr-only">
                        Quantity <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id={fieldId("quantity")}
                        name="quantity"
                        type="number"
                        required={true}
                        min={0}
                        className="tabular"
                        value={item.quantity}
                        onChange={(event) => formValueChanged(index, event)}
                      />
                    </div>
                    <div>
                      <label htmlFor={fieldId("price")} className="mb-1 block text-xs font-medium text-muted-foreground sm:sr-only">
                        Unit price (CZK) <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id={fieldId("price")}
                        name="price"
                        data-sensitive
                        type="text"
                        inputMode="decimal"
                        required={true}
                        placeholder="0.00"
                        className="tabular"
                        value={item.price}
                        onChange={(event) => formValueChanged(index, event)}
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:block sm:text-right">
                      <span className="text-xs font-medium text-muted-foreground sm:hidden">Amount</span>
                      <span className="tabular text-sm font-medium"><Sensitive>{formatCurrency(itemAmount(item))}</Sensitive></span>
                    </div>
                    <div className="row-start-2 col-start-3 flex items-end justify-end self-end sm:row-start-auto sm:col-start-auto sm:self-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove item ${index + 1}${item.title ? ` (${item.title})` : ""}`}
                        onClick={() => deleteDraftInvoiceItem(index)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </form>

      <dl className="ml-auto flex w-full max-w-xs items-baseline justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2.5">
        <dt className="text-sm text-muted-foreground">
          Total
          <span className="ml-1 text-xs">({draftInvoice.items.length} {draftInvoice.items.length === 1 ? "item" : "items"})</span>
        </dt>
        <dd className="tabular text-base font-semibold"><Sensitive>{formatCurrency(total)}</Sensitive></dd>
      </dl>
    </FormSection>
  )
}

export default InvoiceItemForm
