import { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  value: ReactNode
  icon: LucideIcon
  /** Small supporting line under the value */
  meta?: ReactNode
  loading?: boolean
}

export function StatCard({ label, value, icon: Icon, meta, loading }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      {loading ? (
        <div className="mt-3 space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : (
        <>
          <p className="tabular mt-2 truncate text-2xl font-semibold tracking-tight">{value}</p>
          {meta && <div className="mt-1 text-xs text-muted-foreground">{meta}</div>}
        </>
      )}
    </Card>
  )
}
