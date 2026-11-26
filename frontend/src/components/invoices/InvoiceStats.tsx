import { AlertTriangle, CircleDollarSign, Clock, FileText } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Invoice, InvoiceStateType } from "@/types/invoice"
import { getInvoiceStatus } from "@/components/invoices/invoiceUtils"
import { formatCurrency, toAmount } from "@/lib/format"
import { cn } from "@/lib/utils"
import { Sensitive } from "@/components/ui/sensitive"

interface StatCardProps {
  label: string
  value: ReactNode
  hint: string
  icon: LucideIcon
  tone?: "default" | "warning" | "destructive"
  loading?: boolean
}

function StatCard({ label, value, hint, icon: Icon, tone = "default", loading }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-md",
            tone === "default" && "bg-muted text-muted-foreground",
            tone === "warning" && "bg-warning/10 text-warning",
            tone === "destructive" && "bg-destructive/10 text-destructive",
          )}
        >
          <Icon className="size-4" />
        </div>
      </div>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-7 w-24" />
          <Skeleton className="mt-2 h-3 w-16" />
        </>
      ) : (
        <>
          <p className="tabular mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
          <p className="tabular mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>
        </>
      )}
    </div>
  )
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`

interface InvoiceStatsProps {
  invoices: Invoice[]
  loading?: boolean
}

export function InvoiceStats({ invoices, loading }: InvoiceStatsProps) {
  const billable = invoices.filter((invoice) => invoice.state !== InvoiceStateType.CANCELLED)
  const drafts = invoices.filter((invoice) => invoice.state === InvoiceStateType.DRAFT)
  const outstanding = invoices.filter((invoice) => invoice.state === InvoiceStateType.SENT)
  const overdue = outstanding.filter((invoice) => getInvoiceStatus(invoice) === "overdue")
  const sum = (list: Invoice[]) => list.reduce((total, invoice) => total + toAmount(invoice.totalPrice), 0)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Invoices"
        value={String(invoices.length)}
        hint={plural(drafts.length, "draft")}
        icon={FileText}
        loading={loading}
      />
      <StatCard
        label="Total invoiced"
        value={<Sensitive>{formatCurrency(sum(billable))}</Sensitive>}
        hint="Excluding cancelled"
        icon={CircleDollarSign}
        loading={loading}
      />
      <StatCard
        label="Outstanding"
        value={<Sensitive>{formatCurrency(sum(outstanding))}</Sensitive>}
        hint={`${plural(outstanding.length, "invoice")} sent, unpaid`}
        icon={Clock}
        tone={outstanding.length ? "warning" : "default"}
        loading={loading}
      />
      <StatCard
        label="Overdue"
        value={<Sensitive>{formatCurrency(sum(overdue))}</Sensitive>}
        hint={overdue.length ? `${plural(overdue.length, "invoice")} past due` : "Nothing past due"}
        icon={AlertTriangle}
        tone={overdue.length ? "destructive" : "default"}
        loading={loading}
      />
    </div>
  )
}
