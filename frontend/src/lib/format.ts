// Invoices are issued in Czech crowns (the QR payment code uses CC:CZK)
export const LOCALE = "cs-CZ"
export const CURRENCY = "CZK"

const currencyFormatter = new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY })
const wholeCurrencyFormatter = new Intl.NumberFormat(LOCALE, { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 })
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "numeric", year: "numeric" })

/** Parses a string/number amount; returns 0 for empty or invalid values. */
export const toAmount = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined || value === "") return 0
  const parsed = typeof value === "number" ? value : Number(String(value).replace(",", "."))
  return Number.isFinite(parsed) ? parsed : 0
}

/** `whole` drops the haléře, for KPIs and chart labels */
export const formatCurrency = (value: string | number | null | undefined, { whole = false } = {}): string =>
  (whole ? wholeCurrencyFormatter : currencyFormatter).format(toAmount(value))

/** Parses "YYYY-MM-DD" as a local date (avoids timezone shifts of `new Date("YYYY-MM-DD")`). */
export const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (value: string | null | undefined): string => {
  const date = parseDate(value)
  return date ? dateFormatter.format(date) : "—"
}

const startOfToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Whole days from today until the date (negative = in the past). */
export const daysUntil = (value: string | null | undefined): number | null => {
  const date = parseDate(value)
  if (!date) return null
  return Math.round((date.getTime() - startOfToday().getTime()) / 86_400_000)
}
