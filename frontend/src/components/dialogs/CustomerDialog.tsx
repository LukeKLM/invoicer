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
import CustomerForm from "@/components/forms/CustomerForm"
import useCustomerStore from '@/stores/useCustomerStore';
import { Button } from '@/components/ui/button';
import AresResponseDisplay from '@/components/AresResponseDisplay';

const CustomerDialog: React.FC = () => {
  const { draftCustomer, customerDialog, updateCustomerDialog, updateApiCustomer, createApiCustomer, fetchCustomers, aresResponse, clearAresResponse } = useCustomerStore();

  const getTitle = () => {
    return draftCustomer.id ? `Edit Customer: ${draftCustomer.name} (${draftCustomer.id})` : 'Create Customer';
  }
  const handleSubmitForm = async () => {
    if (draftCustomer?.id) {
      await updateApiCustomer(draftCustomer.id, draftCustomer)
    } else {
      await createApiCustomer(draftCustomer)
    }
    await fetchCustomers()
    clearAresResponse()
    updateCustomerDialog(false)
  }

  const handleCloseDialog = () => {
    clearAresResponse()
    updateCustomerDialog(false)
  }

  return (
    <Dialog
      open={customerDialog}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Customer form dialog
          </DialogDescription>
        </DialogHeader>
        {aresResponse && <AresResponseDisplay aresData={aresResponse} />}
        <CustomerForm />
        <DialogFooter>
          <Button className="mt-4" size="lg" onClick={() => handleSubmitForm()}>{draftCustomer.id ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}

export default CustomerDialog;
