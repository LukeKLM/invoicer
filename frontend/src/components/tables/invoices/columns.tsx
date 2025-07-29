
import { ColumnDef } from "@tanstack/react-table"
import { Invoice } from "@/types/invoice"
import { InvoiceTableActions } from "@/components/tables/invoices/invoiceTableActions"
import InvoiceDetailLink from "@/components/tables/invoices/InvoiceDetailLink";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice number",
    cell: ({ row }) => {
      return (
        <InvoiceDetailLink invoice={row.original as Invoice} />
      )
    }
  },
  {
    accessorKey: "orderNumber",
    header: "Order number",
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div>{row.original.customer?.name}</div>
      )
    }
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
    cell: ({ row }) => {
      return (
        <div>{row.original.supplier?.name}</div>
      )
    }
  },
  {
    accessorKey: "dueDate",
    header: "Due date",
  },
  {
    accessorKey: "exposeDate",
    header: "Expose date",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice: Invoice = row.original

      return (
        <InvoiceTableActions invoice={invoice} />
      )
    },
  },
]
