import { ColumnDef } from "@tanstack/react-table"
import { Invoice } from "@/types/invoice"
import { InvoiceTableActions } from "@/components/tables/invoices/invoiceTableActions"
import InvoiceDetailLink from "@/components/tables/invoices/InvoiceDetailLink";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { getInvoiceStatus, invoiceStatusLabels } from "@/components/invoices/invoiceUtils";
import { daysUntil, formatCurrency, formatDate, toAmount } from "@/lib/format";
import { Sensitive } from "@/components/ui/sensitive";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice",
    cell: ({ row }) => {
      return (
        <div className="min-w-[7rem]">
          <InvoiceDetailLink invoice={row.original as Invoice} />
          {row.original.orderNumber && (
            <div className="truncate text-xs text-muted-foreground">Order {row.original.orderNumber}</div>
          )}
        </div>
      )
    }
  },
  {
    id: "customer",
    // includes supplier so the search box matches both
    accessorFn: (invoice) => `${invoice.customer?.name ?? ""} ${invoice.supplier?.name ?? ""}`.trim(),
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="min-w-[10rem] max-w-[16rem]">
          <div className="truncate font-medium">{row.original.customer?.name ?? "—"}</div>
          {row.original.supplier?.name && (
            <div className="truncate text-xs text-muted-foreground">from {row.original.supplier.name}</div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "exposeDate",
    header: "Issued",
    cell: ({ row }) => (
      <span className="tabular whitespace-nowrap text-muted-foreground">{formatDate(row.original.exposeDate)}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => {
      const status = getInvoiceStatus(row.original)
      const days = daysUntil(row.original.dueDate)
      const relative =
        days === null || (status !== "overdue" && status !== "dueSoon") ? null
          : days < 0 ? `${-days} ${days === -1 ? "day" : "days"} late`
          : days === 0 ? "today"
          : `in ${days} ${days === 1 ? "day" : "days"}`
      return (
        <div className="tabular whitespace-nowrap">
          <div>{formatDate(row.original.dueDate)}</div>
          {relative && (
            <div className={status === "overdue" ? "text-xs text-destructive" : "text-xs text-warning"}>{relative}</div>
          )}
        </div>
      )
    },
  },
  {
    id: "status",
    accessorFn: (invoice) => invoiceStatusLabels[getInvoiceStatus(invoice)],
    header: "Status",
    cell: ({ row }) => <InvoiceStatusBadge invoice={row.original} />,
  },
  {
    id: "totalPrice",
    accessorFn: (invoice) => toAmount(invoice.totalPrice),
    header: "Total",
    meta: { align: "right" },
    cell: ({ row }) => (
      <div className="tabular whitespace-nowrap text-right font-medium"><Sensitive>{formatCurrency(row.original.totalPrice)}</Sensitive></div>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const invoice: Invoice = row.original

      return (
        <InvoiceTableActions invoice={invoice} />
      )
    },
  },
]
