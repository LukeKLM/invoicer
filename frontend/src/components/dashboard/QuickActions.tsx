import { Link } from "react-router-dom"
import { Calculator, ChevronRight, FileText, Settings, Truck, Users, type LucideIcon } from "lucide-react"

const actions: { to: string, title: string, description: string, icon: LucideIcon }[] = [
  { to: "/invoices", title: "Invoices", description: "Create, edit and download invoices", icon: FileText },
  { to: "/customers", title: "Customers", description: "Manage who you bill", icon: Users },
  { to: "/suppliers", title: "Suppliers", description: "Your billing identities", icon: Truck },
  { to: "/calculator", title: "Skip Pay calculator", description: "Work out this month's invoice", icon: Calculator },
  { to: "/settings", title: "Settings", description: "Calculator rates and appearance", icon: Settings },
]

export function QuickActions() {
  return (
    <ul className="space-y-1 px-3 pb-3">
      {actions.map((action) => (
        <li key={action.to}>
          <Link
            to={action.to}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground group-hover:text-foreground">
              <action.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{action.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{action.description}</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
