'use client'
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import SupplierForm from '@/components/forms/SupplierForm';
import useSupplierStore from '@/stores/useSupplierStore';
import { Button } from '@/components/ui/button';

const SupplierDialog: React.FC = () => {
  const { draftSupplier, supplierDialog, updateSupplierDialog, updateApiSupplier, createApiSupplier, fetchSuppliers } = useSupplierStore();

  const getTitle = () => {
    return draftSupplier.id ? `Edit Supplier: ${draftSupplier.name} (${draftSupplier.id})` : 'Create Supplier';
  }
  const handleSubmitForm = async () => {
    if (draftSupplier?.id) {
      await updateApiSupplier(draftSupplier.id, draftSupplier)
    } else {
      await createApiSupplier(draftSupplier)
    }
    await fetchSuppliers()
    updateSupplierDialog(false)
  }

  return (
    <Dialog
      open={supplierDialog}
      onOpenChange={() => updateSupplierDialog(false)}
    >
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Supplier form dialog
          </DialogDescription>
        </DialogHeader>
        <SupplierForm />
        <DialogFooter>
          <Button className="mt-4" size="lg" onClick={() => handleSubmitForm()}>{draftSupplier.id ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}

export default SupplierDialog;
