
import { InputField } from "../forms_inputs/inputField"
import useSupplierStore from "@/stores/useSupplierStore"
import { FormSection } from "@/components/ui/form-section"

const SupplierForm: React.FC = () => {

  const { draftSupplier, updateDraft } = useSupplierStore()


  const formValueChanged: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => {
    const { name, value } = e.target
    updateDraft(name, value);
  }

  return (
    <div className="space-y-6">
      <FormSection grid title="Company" description="Your legal name and identifiers shown on invoices.">
        <InputField
          id="name"
          name="name"
          type="text"
          required={true}
          label="Name"
          placeholder="Acme s.r.o."
          value={draftSupplier.name}
          onChange={formValueChanged}
          className="md:col-span-2"
        />
        <InputField
          id="vatId"
          name="vatId"
          type="text"
          required={true}
          label="IČO"
          placeholder="27074358"
          value={draftSupplier.vatId}
          onChange={formValueChanged}
          hint="Company identification number"
        />
      </FormSection>

      <FormSection grid title="Address" description="Registered office of the company.">
        <InputField
          id="street"
          name="street"
          type="text"
          required={true}
          label="Street"
          placeholder="Václavské náměstí 1"
          value={draftSupplier.street}
          onChange={formValueChanged}
          className="md:col-span-2"
        />
        <InputField
          id="city"
          name="city"
          type="text"
          required={true}
          label="City"
          placeholder="Praha"
          value={draftSupplier.city}
          onChange={formValueChanged}
        />
        <InputField
          id="postalCode"
          name="postalCode"
          type="text"
          required={true}
          label="Postal Code"
          placeholder="110 00"
          value={draftSupplier.postalCode}
          onChange={formValueChanged}
        />
        <InputField
          id="country"
          name="country"
          type="text"
          required={true}
          label="Country"
          placeholder="Česká republika"
          value={draftSupplier.country}
          onChange={formValueChanged}
        />
      </FormSection>

      <FormSection grid title="Contact">
        <InputField
          id="email"
          name="email"
          type="email"
          required={true}
          label="Email"
          placeholder="invoices@acme.cz"
          value={draftSupplier.email}
          onChange={formValueChanged}
          className="md:col-span-2"
        />
      </FormSection>

      <FormSection grid title="Bank details" description="Where customers should send payments.">
        <InputField
          id="bankAccount"
          name="bankAccount"
          sensitive
          type="text"
          required={true}
          label="Bank Account"
          placeholder="123456789"
          value={draftSupplier.bankAccount}
          onChange={formValueChanged}
        />
        <InputField
          id="bankCode"
          name="bankCode"
          type="text"
          required={true}
          label="Bank Code"
          placeholder="0100"
          value={draftSupplier.bankCode}
          onChange={formValueChanged}
        />
        <InputField
          id="iban"
          name="iban"
          sensitive
          type="text"
          required={true}
          label="IBAN"
          placeholder="CZ65 0800 0000 1920 0014 5399"
          value={draftSupplier.iban}
          onChange={formValueChanged}
          className="md:col-span-2"
        />
      </FormSection>
    </div>
  )
}

export default SupplierForm
