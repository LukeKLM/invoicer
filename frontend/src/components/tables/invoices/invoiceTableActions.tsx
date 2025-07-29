
import { MoreHorizontal } from "lucide-react"

import {
  downloadInvoice,
} from "@/lib/services/invoicesApiService";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useInvoiceStore from "@/stores/useInvoiceStore";
import { Invoice } from "@/types/invoice";

interface TableActionsProps {
  invoice: Invoice
}


export const InvoiceTableActions: React.FC<TableActionsProps> = ({ invoice }) => {
  const { fetchInvoices, setDraft, updateInvoiceDialog, deleteApiInvoice } = useInvoiceStore();

  const openModal = () => {
    // workaround to dropdown do not interfere with modal
    setTimeout(() => updateInvoiceDialog(true), 100);
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => handleCopyInvoice(invoice)}
        >
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleEditInvoice(invoice)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDownlaodInvoice(invoice.id as number)}
        >
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteInvoice(invoice.id as number)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
