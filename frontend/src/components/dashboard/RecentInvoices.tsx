import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge"
import { formatCurrency, formatDate } from "@/lib/format"
import useInvoiceStore from "@/stores/useInvoiceStore"
import { Invoice } from "@/types/invoice"
import { Sensitive } from "@/components/ui/sensitive"

interface RecentInvoicesProps {
  invoices: Invoice[]
  loading?: boolean
}

export function RecentInvoices({ invoices, loading }: RecentInvoicesProps) {
  const { setDetail } = useInvoiceStore()

  if (loading) {
    return (
      <ul className="divide-y">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="flex items-center gap-4 px-6 py-3.5">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="divide-y">
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <Link
            to={`/invoices/${invoice.id}`}
            // same as the invoices table: seed the detail so the page renders instantly
            onClick={() => setDetail(invoice)}
            className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{invoice.customer?.name || "Unknown customer"}</span>
                <InvoiceStatusBadge invoice={invoice} />
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{invoice.invoiceNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular">{formatDate(invoice.exposeDate)}</span>
              </div>
            </div>
            <span className="tabular shrink-0 text-sm font-medium"><Sensitive>{formatCurrency(invoice.totalPrice)}</Sensitive></span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
