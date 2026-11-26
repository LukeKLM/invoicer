import { ReactNode } from "react"
import { Building2, CheckCircle2, FileText, QrCode, type LucideIcon } from "lucide-react"
import { Logo } from "@/components/layout/AppShell"
import { cn } from "@/lib/utils"

interface AuthSplitLayoutProps {
  children: ReactNode
}

/**
 * Split auth layout: form column on the left, brand panel on the right (lg+ only).
 */
export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <Logo className="self-start rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground lg:text-left">
          © {new Date().getFullYear()} Invoicer
        </p>
      </div>
      <div className="hidden p-3 lg:block">
        <AuthBrandPanel />
      </div>
    </div>
  )
}

interface AuthHeadingProps {
  title: string
  description?: ReactNode
  icon?: LucideIcon
  className?: string
}

export function AuthHeading({ title, description, icon: Icon, className }: AuthHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Icon && (
        <span className="mb-4 flex size-11 items-center justify-center rounded-xl border bg-card text-primary shadow-xs">
          <Icon className="size-5" />
        </span>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "ARES company lookup",
    description: "Fill in customer and supplier details straight from their IČO.",
  },
  {
    icon: FileText,
    title: "PDF invoices",
    description: "Clean, ready-to-send PDFs with automatic invoice numbering.",
  },
  {
    icon: QrCode,
    title: "QR payments",
    description: "Every invoice carries a Czech QR payment code for instant bank transfers.",
  },
]

const gridPattern = {
  backgroundImage:
    "linear-gradient(to right, hsl(var(--primary-foreground) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary-foreground) / 0.08) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
}

function AuthBrandPanel() {
  return (
    <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-violet-600 p-10 text-primary-foreground shadow-sm dark:via-primary/85 dark:to-violet-700 xl:p-14">
      {/* decorative background: masked grid + soft glows */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]"
        style={gridPattern}
      />
      <div aria-hidden className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-primary-foreground/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-16 -z-10 size-96 rounded-full bg-violet-400/30 blur-3xl" />

      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-primary-foreground/20 backdrop-blur-sm">
        <span className="size-1.5 rounded-full bg-primary-foreground" />
        Invoicing for Czech businesses
      </span>

      <div className="max-w-md space-y-10">
        <div className="space-y-4">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
            Invoices done in minutes, not evenings.
          </h2>
          <p className="text-pretty text-base text-primary-foreground/75">
            Keep customers and suppliers in one place, issue professional invoices and get paid faster.
          </p>
        </div>

        <ul className="space-y-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex gap-4 rounded-xl bg-primary-foreground/[0.07] p-4 ring-1 ring-inset ring-primary-foreground/15 backdrop-blur-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                <Icon className="size-4" />
              </span>
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-primary-foreground/70">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
        <CheckCircle2 className="size-4" />
        Secure sign-in with your Google account
      </p>
    </div>
  )
}
