import React, { useState } from 'react';
import SupplierForm from '@/components/forms/SupplierForm';
import useSupplierStore from '@/stores/useSupplierStore';
import { ContactFormDialog } from '@/components/contacts/ContactFormDialog';
import { Supplier } from '@/types/supplier';

interface SupplierDialogProps {
  /** Called with the submitted supplier after a successful save */
  onSaved?: (supplier: Supplier) => void
}

const SupplierDialog: React.FC<SupplierDialogProps> = ({ onSaved }) => {
  const { draftSupplier, supplierDialog, updateSupplierDialog, updateApiSupplier, createApiSupplier, fetchSuppliers } = useSupplierStore();
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!draftSupplier.id

  const handleSubmitForm = async () => {
    const submitted = draftSupplier
    setPending(true)
    setError(null)
    try {
      if (draftSupplier?.id) {
        await updateApiSupplier(draftSupplier.id, draftSupplier)
      } else {
        await createApiSupplier(draftSupplier)
      }
      await fetchSuppliers()
      updateSupplierDialog(false)
      onSaved?.(submitted)
    } catch {
      setError(`Couldn’t ${isEdit ? 'save' : 'create'} the supplier. Check that all required fields are filled in and try again.`)
    } finally {
      setPending(false)
    }
  }

  const handleCloseDialog = () => {
    setError(null)
    updateSupplierDialog(false)
  }

  return (
    <ContactFormDialog
      open={supplierDialog}
      onClose={handleCloseDialog}
      title={isEdit ? 'Edit supplier' : 'New supplier'}
      description={isEdit
        ? <>Update the details of <span className="font-medium text-foreground">{draftSupplier.name || 'this supplier'}</span>.</>
        : 'Add a company you issue invoices as, including bank details for payments.'}
      submitLabel={isEdit ? 'Save changes' : 'Create supplier'}
      pending={pending}
      error={error}
      onSubmit={handleSubmitForm}
    >
      <SupplierForm />
    </ContactFormDialog>
  );
}

export default SupplierDialog;
