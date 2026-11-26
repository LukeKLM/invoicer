
import { InputField } from "../forms_inputs/inputField"
import useCustomerStore from "@/stores/useCustomerStore"
import AresVatIdForm from "@/components/forms/AresVatIdForm"
import { FormSection } from "@/components/ui/form-section"

const CustomerForm: React.FC = () => {

  const { draftCustomer, updateDraft } = useCustomerStore()


  const formValueChanged: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => {
    const { name, value } = e.target
    updateDraft(name, value);
  }

  const isEdit = !!draftCustomer.id

  return (
    <div className="space-y-6">
      {!isEdit && <AresVatIdForm />}

      <FormSection grid title="Company" description="Legal name and identifiers shown on invoices.">
        <InputField
          id="name"
          name="name"
          type="text"
          required={true}
          label="Name"
          placeholder="Acme s.r.o."
          value={draftCustomer.name}
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
          value={draftCustomer.vatId}
          onChange={formValueChanged}
          readonly={isEdit}
          hint={isEdit ? "IČO can’t be changed after the customer is created." : "Company identification number"}
        />
        <InputField
          id="dicId"
          name="dicId"
          type="text"
          required={true}
          label="DIČ"
          placeholder="CZ27074358"
          value={draftCustomer.dicId}
          onChange={formValueChanged}
          hint="VAT number"
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
          value={draftCustomer.street}
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
          value={draftCustomer.city}
          onChange={formValueChanged}
        />
        <InputField
          id="postalCode"
          name="postalCode"
          type="text"
          required={true}
          label="Postal Code"
          placeholder="110 00"
          value={draftCustomer.postalCode}
          onChange={formValueChanged}
        />
        <InputField
          id="country"
          name="country"
          type="text"
          required={true}
          label="Country"
          placeholder="Česká republika"
          value={draftCustomer.country}
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
          placeholder="billing@acme.cz"
          value={draftCustomer.email}
          onChange={formValueChanged}
          className="md:col-span-2"
        />
      </FormSection>
    </div>
  )
}

export default CustomerForm
