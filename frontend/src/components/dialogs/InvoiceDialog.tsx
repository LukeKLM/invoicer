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
import InvoiceForm from "@/components/forms/InvoiceForm"
import useInvoiceStore from '@/stores/useInvoiceStore';
import InvoiceItemForm from '../forms/InvoiceItemForm';
import { Button } from '@/components/ui/button';

const InvoiceDialog: React.FC = () => {
  const { draftInvoice, invoiceDialog, updateInvoiceDialog, updateApiInvoice, createApiInvoice, fetchInvoices } = useInvoiceStore();

  const getTitle = () => {
    return draftInvoice.id ? `Edit Invoice: ${draftInvoice.invoiceNumber} (${draftInvoice.id})` : 'Create Invoice';
  }
  const handleSubmitForm = async () => {
    if (draftInvoice?.id) {
      await updateApiInvoice(draftInvoice.id, draftInvoice)
    } else {
      await createApiInvoice(draftInvoice)
    }
    await fetchInvoices()
    updateInvoiceDialog(false)
  }

  return (
    <Dialog
      open={invoiceDialog}
      onOpenChange={() => updateInvoiceDialog(false)}
    >
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Invoice form dialog
          </DialogDescription>
        </DialogHeader>
        <InvoiceForm />
        <DialogTitle>Invoice items</DialogTitle>
        <InvoiceItemForm />
        <DialogFooter>
          <Button className="mt-4" size="lg" onClick={() => handleSubmitForm()}>{draftInvoice.id ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}

export default InvoiceDialog;
