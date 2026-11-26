import { Invoice, InvoiceItem, InvoicePaymentType, InvoiceStateType } from "@/types/invoice"
import { daysUntil, toAmount } from "@/lib/format"

export type InvoiceStatus = "draft" | "sent" | "dueSoon" | "overdue" | "paid" | "cancelled"

export const DUE_SOON_DAYS = 7

/** Status shown in the UI: the stored state, refined by the due date for sent (unpaid) invoices. */
export const getInvoiceStatus = (invoice: Pick<Invoice, "state" | "dueDate">): InvoiceStatus => {
  switch (invoice.state) {
    case InvoiceStateType.PAID:
      return "paid"
    case InvoiceStateType.CANCELLED:
      return "cancelled"
    case InvoiceStateType.DRAFT:
      return "draft"
    default: {
      const days = daysUntil(invoice.dueDate)
      if (days !== null && days < 0) return "overdue"
      if (days !== null && days <= DUE_SOON_DAYS) return "dueSoon"
      return "sent"
    }
  }
}

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  dueSoon: "Due soon",
  overdue: "Overdue",
  paid: "Paid",
  cancelled: "Cancelled",
}

export const paymentTypeLabels: Record<InvoicePaymentType, string> = {
  [InvoicePaymentType.BANK_TRANSFER]: "Bank transfer",
  [InvoicePaymentType.CASH]: "Cash",
}

export const itemAmount = (item: Pick<InvoiceItem, "price" | "quantity">): number =>
  toAmount(item.price) * toAmount(item.quantity)

export const itemsTotal = (items: Pick<InvoiceItem, "price" | "quantity">[]): number =>
  items.reduce((sum, item) => sum + itemAmount(item), 0)
