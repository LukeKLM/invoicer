import { useNavigate } from "react-router-dom"
import { ChevronRight, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge"
import { EmptyState } from "@/components/ui/empty-state"
import useInvoiceStore from "@/stores/useInvoiceStore"
import { Invoice } from "@/types/invoice"
import { formatCurrency, formatDate } from "@/lib/format"
import { Sensitive } from "@/components/ui/sensitive"

interface ContactInvoicesCardProps {
  invoices: Invoice[]
  /** e.g. "customer" */
  entityLabel: string
}

/** Invoices already loaded in the invoice store that belong to this contact (no extra API calls) */
export function ContactInvoicesCard({ invoices, entityLabel }: ContactInvoicesCardProps) {
  const { setDetail } = useInvoiceStore()
  const navigate = useNavigate()

  const sorted = [...invoices].sort((a, b) => (b.exposeDate ?? "").localeCompare(a.exposeDate ?? ""))
  const total = invoices.reduce((sum, inv) => sum + (Number(inv.totalPrice) || 0), 0)

  const openInvoice = (invoice: Invoice) => {
    setDetail(invoice)
    navigate(`/invoices/${invoice.id}`)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 p-5 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm">Invoices</CardTitle>
          <Badge variant="secondary" className="tabular">{invoices.length}</Badge>
        </div>
        {invoices.length > 0 && (
          <span className="tabular text-sm text-muted-foreground">
            Total <span className="font-medium text-foreground"><Sensitive>{formatCurrency(total)}</Sensitive></span>
          </span>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {sorted.length === 0 ? (
          <EmptyState icon={FileText} title="No invoices yet" description={`Invoices issued for this ${entityLabel} will appear here.`} className="py-10" />
        ) : (
          <ul className="divide-y border-t">
            {sorted.map((invoice) => {
              return (
                <li key={invoice.id ?? invoice.invoiceNumber}>
                  <button
                    type="button"
                    onClick={() => openInvoice(invoice)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-medium text-foreground">{invoice.invoiceNumber || "—"}</p>
                      <p className="tabular text-xs text-muted-foreground">Issued {formatDate(invoice.exposeDate)} · Due {formatDate(invoice.dueDate)}</p>
                    </div>
                    <InvoiceStatusBadge invoice={invoice} className="hidden sm:inline-flex" />
                    <span className="tabular whitespace-nowrap font-medium"><Sensitive>{formatCurrency(invoice.totalPrice)}</Sensitive></span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
