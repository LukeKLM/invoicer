
import React from "react"
import { InputField } from "../forms_inputs/inputField"
import useInvoiceStore from "@/stores/useInvoiceStore"
import { Button } from "@/components/ui/button"


const InvoiceItemForm: React.FC = () => {
  const { draftInvoice, updateDraftItem, appendDefaultItem, deleteDraftInvoiceItem } = useInvoiceStore()

  const formValueChanged = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    updateDraftItem(index, event.target.name, event.target.value)
  }

  return (
    <div>
      <form>
        {draftInvoice.items.map((item, index) => {
          return (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <InputField
                id="title"
                name="title"
                type="text"
                required={true}
                label="Title"
                value={item.title}
                onChange={(event) => formValueChanged(index, event)}
              />
              <InputField
                id="price"
                name="price"
                type="text"
                required={true}
                label="Price"
                value={item.price}
                onChange={(event) => formValueChanged(index, event)}
              />
              <InputField
                id="quantity"
                name="quantity"
                type="number"
                required={true}
                label="Quantity"
                value={item.quantity}
                onChange={(event) => formValueChanged(index, event)}
              />
              <div className="flex align-">
                <Button onClick={() => deleteDraftInvoiceItem(index)}>Delete</Button>
              </div>

            </div>
          )
        })}
      </form >
      <div className="mb-4">
        <Button onClick={() => appendDefaultItem()}>Add Item</Button>
      </div>
    </div >
  )
}

export default InvoiceItemForm
