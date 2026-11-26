import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  title: string
  description?: string
  /** Controls aligned right of the title, e.g. "Add item" */
  actions?: ReactNode
  /** Lays the fields out in a 2-column grid on md+ (use `md:col-span-2` for full-width fields) */
  grid?: boolean
  children: ReactNode
  className?: string
}

/** Titled group of form fields */
export function FormSection({ title, description, actions, grid = false, children, className }: FormSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-end justify-between gap-3 border-b pb-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {grid ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div> : children}
    </section>
  )
}
