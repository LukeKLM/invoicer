import React from 'react'
import { Check } from 'lucide-react'
import { AresCompany } from '@/types/aresCompany'
import { Badge } from '@/components/ui/badge'
import { ContactAvatar } from '@/components/contacts/ContactAvatar'

interface AresResponseDisplayProps {
  aresData: AresCompany
}

const AresResponseDisplay: React.FC<AresResponseDisplayProps> = ({ aresData }) => {
  const residence = aresData.residence
  const street = residence
    ? `${residence.street} ${residence.houseNumber}${residence.referenceNumber ? `/${residence.referenceNumber}` : ''}`.trim()
    : ''
  const fullAddress = residence?.fullAddress || [street, residence?.zipCode, residence?.city].filter(Boolean).join(', ')

  const fields: { label: string, value?: string | number, mono?: boolean }[] = [
    { label: 'IČO', value: aresData.ico, mono: true },
    { label: 'DIČ', value: aresData.dic, mono: true },
    { label: 'City', value: residence?.city },
    { label: 'Country', value: residence?.state },
  ]

  return (
    <div className="mt-3 rounded-lg border bg-card p-3 shadow-xs">
      <div className="flex items-start gap-3">
        <ContactAvatar name={aresData.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="truncate text-sm font-medium text-foreground">{aresData.name}</p>
            <Badge variant="success">
              <Check />
              Applied to form
            </Badge>
          </div>
          {fullAddress && <p className="mt-0.5 text-xs text-muted-foreground">{fullAddress}</p>}
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 sm:grid-cols-4">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{field.label}</dt>
            <dd className={field.mono ? 'truncate font-mono text-xs text-foreground' : 'truncate text-sm text-foreground'}>
              {field.value || <span className="text-muted-foreground/60">—</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default AresResponseDisplay
