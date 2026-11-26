import { formatCityLine } from "@/components/contacts/contactUtils"

export function EmptyValue() {
  return <span className="text-muted-foreground/60">—</span>
}

/** IČO / DIČ / bank identifiers */
export function MonoCell({ value }: { value?: string | null }) {
  if (!value) return <EmptyValue />
  return <span className="whitespace-nowrap font-mono text-xs text-foreground">{value}</span>
}

interface AddressCellProps {
  street?: string
  postalCode?: string
  city?: string
  country?: string
}

export function AddressCell({ street, postalCode, city, country }: AddressCellProps) {
  const cityLine = [formatCityLine(postalCode, city), country].filter(Boolean).join(", ")
  if (!street && !cityLine) return <EmptyValue />
  return (
    <div className="min-w-[10rem]">
      <p className="truncate">{street || cityLine}</p>
      {street && cityLine && <p className="truncate text-xs text-muted-foreground">{cityLine}</p>}
    </div>
  )
}
