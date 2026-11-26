import { Invoice, InvoiceStateType } from "@/types/invoice"
import { LOCALE, toAmount } from "@/lib/format"

const compactMoneyFormat = new Intl.NumberFormat(LOCALE, { notation: "compact", maximumFractionDigits: 1 })

export const formatCompactMoney = (value: number) => `${compactMoneyFormat.format(value)} Kč`

/** "YYYY-MM" key for a local date */
export const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

export const invoiceAmount = (invoice: Invoice) => toAmount(invoice.totalPrice)

/** Cancelled invoices never count towards invoiced totals */
export const countsAsInvoiced = (invoice: Invoice) => invoice.state !== InvoiceStateType.CANCELLED
