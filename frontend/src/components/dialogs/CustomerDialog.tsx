import React, { useState } from 'react';
import CustomerForm from "@/components/forms/CustomerForm"
import useCustomerStore from '@/stores/useCustomerStore';
import { ContactFormDialog } from '@/components/contacts/ContactFormDialog';
import { Customer } from '@/types/customer';

interface CustomerDialogProps {
  /** Called with the submitted customer after a successful save */
  onSaved?: (customer: Customer) => void
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ onSaved }) => {
  const { draftCustomer, customerDialog, updateCustomerDialog, updateApiCustomer, createApiCustomer, fetchCustomers, clearAresResponse } = useCustomerStore();
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!draftCustomer.id

  const handleSubmitForm = async () => {
    const submitted = draftCustomer
    setPending(true)
    setError(null)
    try {
      if (draftCustomer?.id) {
        await updateApiCustomer(draftCustomer.id, draftCustomer)
      } else {
        await createApiCustomer(draftCustomer)
      }
      await fetchCustomers()
      clearAresResponse()
      updateCustomerDialog(false)
      onSaved?.(submitted)
    } catch {
      setError(`Couldn’t ${isEdit ? 'save' : 'create'} the customer. Check that all required fields are filled in and try again.`)
    } finally {
      setPending(false)
    }
  }

  const handleCloseDialog = () => {
    setError(null)
    clearAresResponse()
    updateCustomerDialog(false)
  }

  return (
    <ContactFormDialog
      open={customerDialog}
      onClose={handleCloseDialog}
      title={isEdit ? 'Edit customer' : 'New customer'}
      description={isEdit
        ? <>Update the details of <span className="font-medium text-foreground">{draftCustomer.name || 'this customer'}</span>.</>
        : 'Look the company up in ARES, or fill in the details manually.'}
      submitLabel={isEdit ? 'Save changes' : 'Create customer'}
      pending={pending}
      error={error}
      onSubmit={handleSubmitForm}
    >
      <CustomerForm />
    </ContactFormDialog>
  );
}

export default CustomerDialog;
