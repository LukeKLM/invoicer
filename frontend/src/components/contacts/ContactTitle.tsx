import { ContactAvatar } from "@/components/contacts/ContactAvatar"

/** Page title for a contact detail page (avatar + name); safe to render inside <h1> */
export function ContactTitle({ name, loading }: { name: string, loading?: boolean }) {
  if (loading) {
    return (
      <span className="flex items-center gap-3">
        <span className="block size-10 animate-pulse rounded-lg bg-muted" />
        <span className="block h-7 w-48 animate-pulse rounded-md bg-muted" />
      </span>
    )
  }
  return (
    <span className="flex min-w-0 items-center gap-3">
      <ContactAvatar name={name} size="lg" />
      <span className="truncate">{name || "Unnamed"}</span>
    </span>
  )
}
