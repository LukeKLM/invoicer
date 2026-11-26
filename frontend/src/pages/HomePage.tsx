import React, { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AlertTriangle, ArrowRight, Banknote, CalendarDays, Clock, FileText, Plus, Users } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/dashboard/StatCard"
import { RevenueChart, RevenuePoint } from "@/components/dashboard/RevenueChart"
import { RecentInvoices } from "@/components/dashboard/RecentInvoices"
import { QuickActions } from "@/components/dashboard/QuickActions"
import {
  countsAsInvoiced,
  invoiceAmount,
  monthKey,
} from "@/components/dashboard/format"
import { getInvoiceStatus } from "@/components/invoices/invoiceUtils"
import { formatCurrency } from "@/lib/format"
import useInvoiceStore from "@/stores/useInvoiceStore"
import useCustomerStore from "@/stores/useCustomerStore"
import useSupplierStore from "@/stores/useSupplierStore"
import { InvoiceStateType } from "@/types/invoice"
import { cn } from "@/lib/utils"
import { InlineError } from "@/components/ui/inline-error"
import { Sensitive } from "@/components/ui/sensitive"

const CHART_MONTHS = 12

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { invoices, fetchInvoices } = useInvoiceStore()
  const { customers, fetchCustomers } = useCustomerStore()
  const { suppliers, fetchSuppliers } = useSupplierStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([fetchInvoices(), fetchCustomers(), fetchSuppliers()]).then((results) => {
      if (cancelled) return
      const failed = results.find((result): result is PromiseRejectedResult => result.status === "rejected")
      if (failed) setError(`Some data could not be loaded: ${(failed.reason as Error)?.message ?? failed.reason}`)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [fetchInvoices, fetchCustomers, fetchSuppliers])

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = monthKey(now)
    const lastMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))

    const invoiced = invoices.filter(countsAsInvoiced)
    const sumFor = (key: string) => invoiced
      .filter((invoice) => invoice.exposeDate?.startsWith(key))
      .reduce((sum, invoice) => sum + invoiceAmount(invoice), 0)

    const months: RevenuePoint[] = Array.from({ length: CHART_MONTHS }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1 - i), 1)
      const key = monthKey(date)
      const inMonth = invoiced.filter((invoice) => invoice.exposeDate?.startsWith(key))
      return {
        key,
        label: date.toLocaleString("en-US", { month: "short" }),
        fullLabel: date.toLocaleString("en-US", { month: "long", year: "numeric" }),
        total: inMonth.reduce((sum, invoice) => sum + invoiceAmount(invoice), 0),
        count: inMonth.length,
      }
    })

    const open = invoices.filter((invoice) => invoice.state === InvoiceStateType.SENT)
    const recent = [...invoices]
      .sort((a, b) => (b.exposeDate ?? "").localeCompare(a.exposeDate ?? "") || (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 5)

    const thisMonthTotal = sumFor(thisMonth)
    const lastMonthTotal = sumFor(lastMonth)

    return {
      thisMonthTotal,
      thisMonthCount: invoiced.filter((invoice) => invoice.exposeDate?.startsWith(thisMonth)).length,
      monthChange: lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : null,
      total: invoiced.reduce((sum, invoice) => sum + invoiceAmount(invoice), 0),
      totalCount: invoiced.length,
      openCount: open.length,
      openTotal: open.reduce((sum, invoice) => sum + invoiceAmount(invoice), 0),
      overdueCount: open.filter((invoice) => getInvoiceStatus(invoice) === "overdue").length,
      months,
      chartTotal: months.reduce((sum, point) => sum + point.total, 0),
      recent,
    }
  }, [invoices])

  // show skeletons only on a cold load; cached store data renders immediately
  const showSkeleton = loading && invoices.length === 0
  const hasInvoices = invoices.length > 0

  const newInvoiceButton = (
    <Button onClick={() => navigate("/invoices?new=1")}>
      <Plus /> New invoice
    </Button>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description={`${greeting()} — here's how your invoicing is going.`}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/calculator">Calculator</Link>
            </Button>
            {newInvoiceButton}
          </>
        }
        className="pb-0"
      />

      {error && (
        <InlineError>{error}</InlineError>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Invoiced this month"
          icon={CalendarDays}
          loading={showSkeleton}
          value={<Sensitive>{formatCurrency(stats.thisMonthTotal, { whole: true })}</Sensitive>}
          meta={
            <span className="flex flex-wrap items-center gap-x-1.5">
              <span className="tabular">{stats.thisMonthCount} {stats.thisMonthCount === 1 ? "invoice" : "invoices"}</span>
              {stats.monthChange !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className={cn("tabular font-medium", stats.monthChange >= 0 ? "text-success" : "text-destructive")}>
                    {stats.monthChange >= 0 ? "+" : "−"}{Math.abs(stats.monthChange).toFixed(0)} %
                  </span>
                  <span>vs last month</span>
                </>
              )}
            </span>
          }
        />
        <StatCard
          label="Total invoiced"
          icon={Banknote}
          loading={showSkeleton}
          value={<Sensitive>{formatCurrency(stats.total, { whole: true })}</Sensitive>}
          meta={<span className="tabular">{stats.totalCount} invoices · excl. cancelled</span>}
        />
        <StatCard
          label="Open invoices"
          icon={Clock}
          loading={showSkeleton}
          value={<span>{stats.openCount}</span>}
          meta={
            stats.overdueCount > 0 ? (
              <span className="flex items-center gap-1 font-medium text-warning">
                <AlertTriangle className="size-3.5" aria-hidden="true" />
                <span className="tabular">{stats.overdueCount} overdue</span>
              </span>
            ) : (
              <span className="tabular"><Sensitive>{formatCurrency(stats.openTotal, { whole: true })}</Sensitive> awaiting payment</span>
            )
          }
        />
        <StatCard
          label="Customers"
          icon={Users}
          loading={loading && customers.length === 0}
          value={<span>{customers.length}</span>}
          meta={<span className="tabular">{suppliers.length} {suppliers.length === 1 ? "supplier" : "suppliers"}</span>}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1.5">
              <CardTitle>Invoiced per month</CardTitle>
              <CardDescription>Last {CHART_MONTHS} months, by issue date</CardDescription>
            </div>
            {!showSkeleton && (
              <div className="text-right">
                <div className="tabular text-lg font-semibold"><Sensitive>{formatCurrency(stats.chartTotal, { whole: true })}</Sensitive></div>
                <div className="text-xs text-muted-foreground">in {CHART_MONTHS} months</div>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {showSkeleton ? (
              <div className="flex h-56 items-end gap-2 pl-14">
                {Array.from({ length: CHART_MONTHS }).map((_, i) => (
                  <Skeleton key={i} className="flex-1 rounded-b-none" style={{ height: `${25 + ((i * 37) % 70)}%` }} />
                ))}
              </div>
            ) : (
              <RevenueChart data={stats.months} />
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to the most common tasks</CardDescription>
          </CardHeader>
          <QuickActions />
        </Card>
      </div>

      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 border-b pb-4">
          <div className="space-y-1.5">
            <CardTitle>Recent invoices</CardTitle>
            <CardDescription>The latest invoices you have issued</CardDescription>
          </div>
          {hasInvoices && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/invoices">View all <ArrowRight /></Link>
            </Button>
          )}
        </CardHeader>
        {showSkeleton || hasInvoices ? (
          <RecentInvoices invoices={stats.recent} loading={showSkeleton} />
        ) : (
          <EmptyState
            icon={FileText}
            title="No invoices yet"
            description="Create your first invoice and it will show up here, together with your monthly totals."
            action={newInvoiceButton}
          />
        )}
      </Card>
    </div>
  )
}

export default HomePage
