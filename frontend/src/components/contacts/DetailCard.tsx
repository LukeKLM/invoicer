import { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sensitive } from "@/components/ui/sensitive"

interface DetailCardProps {
  title: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
}

export function DetailCard({ title, icon: Icon, children, className }: DetailCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center gap-2 space-y-0 p-5 pb-4">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
      </CardContent>
    </Card>
  )
}

interface DetailItemProps {
  label: string
  value?: ReactNode
  mono?: boolean
  /** span both columns */
  full?: boolean
  /** Masked while privacy mode is on */
  sensitive?: boolean
}

export function DetailItem({ label, value, mono, full, sensitive }: DetailItemProps) {
  const empty = value === undefined || value === null || value === ""
  return (
    <div className={cn("min-w-0", full && "sm:col-span-2")}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 break-words text-sm text-foreground", mono && !empty && "font-mono text-[13px]")}>
        {empty ? <span className="text-muted-foreground/60">—</span> : sensitive ? <Sensitive>{value}</Sensitive> : value}
      </dd>
    </div>
  )
}
