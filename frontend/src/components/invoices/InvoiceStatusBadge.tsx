import { Badge, BadgeProps } from "@/components/ui/badge"
import { Invoice } from "@/types/invoice"
import { InvoiceStatus, getInvoiceStatus, invoiceStatusLabels } from "@/components/invoices/invoiceUtils"

const statusVariants: Record<InvoiceStatus, BadgeProps["variant"]> = {
  draft: "outline",
  sent: "default",
  dueSoon: "warning",
  overdue: "destructive",
  paid: "success",
  cancelled: "secondary",
}

interface InvoiceStatusBadgeProps {
  invoice: Pick<Invoice, "state" | "dueDate">
  className?: string
}

export function InvoiceStatusBadge({ invoice, className }: InvoiceStatusBadgeProps) {
  const status = getInvoiceStatus(invoice)
  return (
    <Badge variant={statusVariants[status]} className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {invoiceStatusLabels[status]}
    </Badge>
  )
}
