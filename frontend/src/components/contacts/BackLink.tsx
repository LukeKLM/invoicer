import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function BackLink({ to, label }: { to: string, label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  )
}
