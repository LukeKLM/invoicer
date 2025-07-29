
import { InputField } from "../forms_inputs/inputField"
import useSupplierStore from "@/stores/useSupplierStore"

const SupplierForm: React.FC = () => {

  const { draftSupplier, updateDraft } = useSupplierStore()


  const formValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateDraft(name, value);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <InputField
          id="email"
          name="email"
          type="text"
          required={true}
          label="Email"
          value={draftSupplier.email}
          onChange={formValueChanged}
        />
        <InputField
          id="name"
          name="name"
          type="text"
          required={true}
          label="Name"
          value={draftSupplier.name}
          onChange={formValueChanged}
        />
        <InputField
          id="vatId"
          name="vatId"
          type="text"
          required={true}
          label="VAT ID"
          value={draftSupplier.vatId}
          onChange={formValueChanged}
        />
        <InputField
          id="city"
          name="city"
          type="text"
          required={true}
          label="City"
          value={draftSupplier.city}
          onChange={formValueChanged}
        />
        <InputField
          id="country"
          name="country"
          type="text"
          required={true}
          label="Country"
          value={draftSupplier.country}
          onChange={formValueChanged}
        />
        <InputField
          id="street"
          name="street"
          type="text"
          required={true}
          label="Street"
          value={draftSupplier.street}
          onChange={formValueChanged}
        />
        <InputField
          id="postalCode"
          name="postalCode"
          type="text"
          required={true}
          label="Postal Code"
          value={draftSupplier.postalCode}
          onChange={formValueChanged}
        />
        <InputField
          id="bankAccount"
          name="bankAccount"
          type="text"
          required={true}
          label="Bank Account"
          value={draftSupplier.bankAccount}
          onChange={formValueChanged}
        />
        <InputField
          id="bankCode"
          name="bankCode"
          type="text"
          required={true}
          label="Bank Code"
          value={draftSupplier.bankCode}
          onChange={formValueChanged}
        />
        <InputField
          id="iban"
          name="iban"
          type="text"
          required={true}
          label="IBAN"
          value={draftSupplier.iban}
          onChange={formValueChanged}
        />
      </div>
    </div>
  )
}

export default SupplierForm
