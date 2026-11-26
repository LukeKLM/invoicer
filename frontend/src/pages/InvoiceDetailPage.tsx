import React, { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2, Pencil } from "lucide-react";
import useInvoiceStore from "@/stores/useInvoiceStore";
import { downloadInvoice } from "@/lib/services/invoicesApiService";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InvoiceDialog from "@/components/dialogs/InvoiceDialog";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { itemAmount, paymentTypeLabels } from "@/components/invoices/invoiceUtils";
import { formatCurrency, formatDate } from "@/lib/format";
import { Customer } from "@/types/customer";
import { Supplier } from "@/types/supplier";
import { InlineError } from "@/components/ui/inline-error";
import { Sensitive } from "@/components/ui/sensitive";

const backLink = (
  <Link to="/invoices" className="inline-flex items-center gap-1.5 rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <ArrowLeft className="size-4" />
    Invoices
  </Link>
)

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</p>
)

const MetaItem = ({ label, value, mono, sensitive }: { label: string; value: ReactNode; mono?: boolean; sensitive?: boolean }) => (
  <div className="min-w-0">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className={mono ? "tabular mt-0.5 truncate font-mono text-sm" : "tabular mt-0.5 truncate text-sm font-medium"}>
      {value ? (sensitive ? <Sensitive>{value}</Sensitive> : value) : "—"}
    </dd>
  </div>
)

const PartyBlock = ({ label, party }: { label: string; party: Customer | Supplier | null }) => {
  const cityLine = [party?.postalCode, party?.city].filter(Boolean).join(" ")
  const dicId = party && "dicId" in party ? party.dicId : undefined
  return (
    <div className="min-w-0">
      <SectionLabel>{label}</SectionLabel>
      <p className="font-semibold">{party?.name || "—"}</p>
      <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
        {party?.street && <p>{party.street}</p>}
        {cityLine && <p>{cityLine}</p>}
        {party?.country && <p>{party.country}</p>}
        {party?.email && <p className="truncate">{party.email}</p>}
      </div>
      <dl className="mt-3 space-y-0.5 text-sm">
        {party?.vatId && (
          <div className="flex gap-2"><dt className="text-muted-foreground">VAT ID</dt><dd className="tabular">{party.vatId}</dd></div>
        )}
        {dicId && (
          <div className="flex gap-2"><dt className="text-muted-foreground">DIČ</dt><dd className="tabular">{dicId}</dd></div>
        )}
      </dl>
    </div>
  )
}

const DetailSkeleton = () => (
  <Card className="p-6 sm:p-8">
    <div className="flex justify-between gap-4">
      <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-7 w-40" /></div>
      <div className="space-y-2"><Skeleton className="ml-auto h-4 w-16" /><Skeleton className="h-7 w-32" /></div>
    </div>
    <div className="mt-8 grid gap-8 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-2"><Skeleton className="h-3 w-12" /><Skeleton className="h-5 w-44" /><Skeleton className="h-4 w-36" /><Skeleton className="h-4 w-28" /></div>
      ))}
    </div>
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-20" /></div>
      ))}
    </div>
    <div className="mt-8 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
    </div>
  </Card>
)

const InvoiceDetailPage: React.FC = () => {
  const { detailInvoice: detailInvoice, fetchInvoice, setDraft, updateInvoiceDialog } = useInvoiceStore();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return

    if (!detailInvoice.id) {
      fetchInvoice(Number(id)).catch((e: Error) => setError(`Loading invoice failed: ${e.message}`))
    }
  }, [id, detailInvoice.id, fetchInvoice])

  const loading = !detailInvoice.id && !error

  const handleEdit = () => {
    setDraft({ ...detailInvoice })
    updateInvoiceDialog(true)
  }

  const handleDownload = async () => {
    if (!detailInvoice.id) return
    setDownloading(true)
    try {
      await downloadInvoice(detailInvoice.id)
    } finally {
      setDownloading(false)
    }
  }

  const supplier = detailInvoice.supplier
  const hasBankDetails = Boolean(supplier?.bankAccount || supplier?.iban)

  return (
    <>
      <PageHeader
        eyebrow={backLink}
        title={loading ? <Skeleton className="h-8 w-48" /> : (
          <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="truncate">Invoice <span className="font-mono">{detailInvoice.invoiceNumber}</span></span>
            {detailInvoice.id && <InvoiceStatusBadge invoice={detailInvoice} className="text-xs" />}
          </span>
        )}
        description={detailInvoice.id
          ? `${detailInvoice.customer?.name ?? "Unknown customer"} · issued ${formatDate(detailInvoice.exposeDate)}`
          : undefined}
        actions={detailInvoice.id ? (
          <>
            <Button variant="outline" onClick={handleEdit}>
              <Pencil />
              Edit
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? <Loader2 className="animate-spin" /> : <Download />}
              Download PDF
            </Button>
          </>
        ) : undefined}
      />

      <InvoiceDialog onSaved={() => { if (id) fetchInvoice(Number(id)) }} />

      {error && (
        <InlineError>{error}</InlineError>
      )}

      {loading ? <DetailSkeleton /> : detailInvoice.id && (
        <Card className="overflow-hidden">
          {/* Document header */}
          <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
            <div>
              <SectionLabel>Invoice</SectionLabel>
              <p className="font-mono text-xl font-semibold">{detailInvoice.invoiceNumber}</p>
            </div>
            <div className="sm:text-right">
              <SectionLabel>Amount due</SectionLabel>
              <p className="tabular text-2xl font-semibold tracking-tight"><Sensitive>{formatCurrency(detailInvoice.totalPrice)}</Sensitive></p>
              <p className="tabular text-sm text-muted-foreground">Due {formatDate(detailInvoice.dueDate)}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid gap-8 border-b p-6 sm:grid-cols-2 sm:p-8">
            <PartyBlock label="From" party={detailInvoice.supplier} />
            <PartyBlock label="Bill to" party={detailInvoice.customer} />
          </div>

          {/* Meta */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-b bg-muted/30 p-6 sm:p-8 md:grid-cols-4">
            <MetaItem label="Issued" value={formatDate(detailInvoice.exposeDate)} />
            <MetaItem label="Due" value={formatDate(detailInvoice.dueDate)} />
            <MetaItem label="Variable symbol" value={detailInvoice.variableSymbol} mono />
            <MetaItem label="Order number" value={detailInvoice.orderNumber} mono />
            <MetaItem label="Payment" value={paymentTypeLabels[detailInvoice.paymentType] ?? detailInvoice.paymentType} />
            {hasBankDetails && (
              <>
                <MetaItem
                  label="Bank account"
                  value={supplier?.bankAccount ? `${supplier.bankAccount}${supplier.bankCode ? ` / ${supplier.bankCode}` : ""}` : ""}
                  mono
                  sensitive
                />
                <div className="col-span-2">
                  <MetaItem label="IBAN" value={supplier?.iban} mono sensitive />
                </div>
              </>
            )}
          </dl>

          {/* Items */}
          <div className="p-2 sm:p-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailInvoice.items.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">No items on this invoice.</TableCell>
                  </TableRow>
                ) : detailInvoice.items.map((item, index) => (
                  <TableRow key={item.id ?? index}>
                    <TableCell className="min-w-[12rem] font-medium">{item.title}</TableCell>
                    <TableCell className="tabular text-right">{item.quantity}</TableCell>
                    <TableCell className="tabular whitespace-nowrap text-right"><Sensitive>{formatCurrency(item.price)}</Sensitive></TableCell>
                    <TableCell className="tabular whitespace-nowrap text-right font-medium"><Sensitive>{formatCurrency(itemAmount(item))}</Sensitive></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end border-t p-6 sm:px-8">
            <dl className="w-full max-w-xs rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-medium">
                  Total
                  <span className="ml-1 text-xs font-normal text-muted-foreground">({detailInvoice.items.length} {detailInvoice.items.length === 1 ? "item" : "items"})</span>
                </dt>
                <dd className="tabular text-lg font-semibold"><Sensitive>{formatCurrency(detailInvoice.totalPrice)}</Sensitive></dd>
              </div>
            </dl>
          </div>
        </Card>
      )}
    </>
  )
}

export default InvoiceDetailPage;
