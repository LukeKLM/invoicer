'use client'
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { InlineError } from "@/components/ui/inline-error";

interface InvoiceDialogProps {
  onSaved?: () => void;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({ onSaved }) => {
  const { draftInvoice, invoiceDialog, updateInvoiceDialog, updateApiInvoice, createApiInvoice, fetchInvoices } = useInvoiceStore();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (invoiceDialog) setError(null)
  }, [invoiceDialog])

  const isEdit = Boolean(draftInvoice.id)

  const getTitle = () => {
    return isEdit
      ? <>Edit invoice <span className="font-mono">{draftInvoice.invoiceNumber}</span></>
      : 'New invoice';
  }
  const handleSubmitForm = async () => {
    setPending(true)
    try {
      try {
        if (draftInvoice?.id) {
          await updateApiInvoice(draftInvoice.id, draftInvoice)
        } else {
          await createApiInvoice(draftInvoice)
        }
      } catch (e) {
        const message = (e as Error).message
        setError(message.includes("409")
          ? `Invoice number ${draftInvoice.invoiceNumber} already exists.`
          : `Saving failed: ${message}`)
        return
      }
      await fetchInvoices()
      updateInvoiceDialog(false)
      onSaved?.()
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={invoiceDialog}
      onOpenChange={() => { if (!pending) updateInvoiceDialog(false) }}
    >
      <DialogContent className="max-w-4xl gap-6 p-0">
        <DialogHeader className="border-b px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the parties, details or items of this invoice. Changes are saved when you click Save changes.'
              : 'Pick the supplier and customer, fill in numbering and dates, then add the items you are billing for.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 px-6">
          <InvoiceForm />
          <InvoiceItemForm />
          {error && (
            <InlineError>{error}</InlineError>
          )}
        </div>
        <DialogFooter className="sticky bottom-0 border-t bg-card px-6 py-4">
          <Button variant="outline" onClick={() => updateInvoiceDialog(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmitForm()} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {isEdit ? 'Save changes' : 'Create invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}

export default InvoiceDialog;
