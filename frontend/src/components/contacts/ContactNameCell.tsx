import { ContactAvatar } from "@/components/contacts/ContactAvatar"

interface ContactNameCellProps {
  name: string
  secondary?: string
  onOpen: () => void
}

/** Primary table cell: avatar + name (opens detail) + muted second line */
export function ContactNameCell({ name, secondary, onOpen }: ContactNameCellProps) {
  return (
    <div className="flex min-w-[12rem] items-center gap-3">
      <ContactAvatar name={name} />
      <div className="min-w-0">
        <button
          type="button"
          onClick={onOpen}
          className="block max-w-[16rem] truncate rounded-sm text-left font-medium text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {name || "Unnamed"}
        </button>
        {secondary && <p className="max-w-[16rem] truncate text-xs text-muted-foreground">{secondary}</p>}
      </div>
    </div>
  )
}
