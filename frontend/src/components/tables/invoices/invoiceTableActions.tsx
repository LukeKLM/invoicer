import { useState } from "react"
import { Copy, Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import {
  downloadInvoice,
} from "@/lib/services/invoicesApiService";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useInvoiceStore from "@/stores/useInvoiceStore";
import { Invoice } from "@/types/invoice";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface TableActionsProps {
  invoice: Invoice
}


export const InvoiceTableActions: React.FC<TableActionsProps> = ({ invoice }) => {
  const { fetchInvoices, setDraft, updateInvoiceDialog, deleteApiInvoice } = useInvoiceStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openModal = () => {
    // workaround to dropdown do not interfere with modal
    window.setTimeout(() => updateInvoiceDialog(true), 100);
  }

  const handleDeleteInvoice = async (invoice_id: number) => {
    if (!invoice_id) return;

    await deleteApiInvoice(invoice_id);
    await fetchInvoices();
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setDraft({ ...invoice });
    openModal();
  };

  const handleCopyInvoice = (invoice: Invoice) => {
    const items = invoice.items.map((item) => ({ ...item, id: null, invoiceId: null }));
    setDraft({ ...invoice, id: null, items, supplierId: invoice?.supplier?.id as number, customerId: invoice?.customer?.id as number });
    openModal()
  };

  const handleDownlaodInvoice = async (invoice_id: number) => {
    if (!invoice_id) return;

    console.log("Downloading invoice with id: ", invoice_id);
    await downloadInvoice(invoice_id);
  };


  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for invoice ${invoice.invoiceNumber}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopyInvoice(invoice)}>
            <Copy />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownlaodInvoice(invoice.id as number)}>
            <Download />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            // workaround to dropdown do not interfere with modal
            onClick={() => window.setTimeout(() => setConfirmDelete(true), 100)}
          >
            <Trash2 />
            Delete…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete invoice ${invoice.invoiceNumber}?`}
        description={<>This permanently removes the invoice{invoice.customer?.name ? ` for ${invoice.customer.name}` : ""} and all of its items. This can&apos;t be undone.</>}
        confirmLabel="Delete invoice"
        onConfirm={() => handleDeleteInvoice(invoice.id as number)}
        errorMessage={(e) => `Deleting failed: ${(e as Error).message}`}
      />
    </div>
  )
}
