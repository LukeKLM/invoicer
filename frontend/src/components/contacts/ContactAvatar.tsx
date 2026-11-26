import { cn } from "@/lib/utils"
import { getInitials } from "@/components/contacts/contactUtils"

interface ContactAvatarProps {
  name: string | null | undefined
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-9 text-xs",
  lg: "size-10 text-sm",
}

/** Rounded-square initials avatar for customers / suppliers */
export function ContactAvatar({ name, size = "sm", className }: ContactAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-lg bg-primary/10 font-semibold tracking-tight text-primary",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </span>
  )
}
