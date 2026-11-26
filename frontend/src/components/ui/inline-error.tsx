import { AlertCircle } from "lucide-react"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function InlineError({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div
      role="alert"
      className={cn("flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", className)}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  )
}
