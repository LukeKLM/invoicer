
import { InputField } from "../forms_inputs/inputField"
import useCustomerStore from "@/stores/useCustomerStore"
import AresVatIdForm from "@/components/forms/AresVatIdForm"

const CustomerForm: React.FC = () => {

  const { draftCustomer, updateDraft } = useCustomerStore()


  const formValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateDraft(name, value);
  }

  return (
    <div>
      {!draftCustomer.id && <AresVatIdForm />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <InputField
          id="email"
          name="email"
          type="text"
          required={true}
          label="Email"
          value={draftCustomer.email}
          onChange={formValueChanged}
        />
        <InputField
          id="name"
          name="name"
          type="text"
          required={true}
          label="Name"
          value={draftCustomer.name}
          onChange={formValueChanged}
        />
        <InputField
          id="vatId"
          name="vatId"
          type="text"
          required={true}
          label="VAT ID"
          value={draftCustomer.vatId}
          onChange={formValueChanged}
          readonly={!!draftCustomer.id}
        />
        <InputField
          id="dicId"
          name="dicId"
          type="text"
          required={true}
          label="DIC ID"
          value={draftCustomer.dicId}
          onChange={formValueChanged}
        />
        <InputField
          id="city"
          name="city"
          type="text"
          required={true}
          label="City"
          value={draftCustomer.city}
          onChange={formValueChanged}
        />
        <InputField
          id="country"
          name="country"
          type="text"
          required={true}
          label="Country"
          value={draftCustomer.country}
          onChange={formValueChanged}
        />
        <InputField
          id="street"
          name="street"
          type="text"
          required={true}
          label="Street"
          value={draftCustomer.street}
          onChange={formValueChanged}
        />
        <InputField
          id="postalCode"
          name="postalCode"
          type="text"
          required={true}
          label="Postal Code"
          value={draftCustomer.postalCode}
          onChange={formValueChanged}
        />
      </div>
    </div>
  )
}

export default CustomerForm
