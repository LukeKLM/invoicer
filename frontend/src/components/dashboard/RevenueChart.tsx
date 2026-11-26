import React, { useState } from "react"
import { formatCompactMoney } from "@/components/dashboard/format"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useSensitive } from "@/components/ui/sensitive"
import usePrivacyStore from "@/stores/usePrivacyStore"

export type RevenuePoint = {
  key: string
  /** Short axis label, e.g. "Mar" */
  label: string
  /** Full label for the tooltip, e.g. "March 2026" */
  fullLabel: string
  total: number
  count: number
}

const GRID_STEPS = [1, 0.5, 0]

// centre the tooltip over the bar, but pin it to the chart edges for the outer bars so it never overflows
const tooltipPosition = (index: number, count: number): React.CSSProperties => {
  const column = 100 / count
  if (index < 2) return { left: `${index * column}%` }
  if (index > count - 3) return { right: `${(count - 1 - index) * column}%` }
  return { left: `${(index + 0.5) * column}%`, transform: "translate(-50%, -100%)" }
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...data.map((point) => point.total), 0)
  const activePoint = active !== null ? data[active] : null
  // privacy mode keeps the bar shapes (the trend) but drops the scale and amounts
  const hidden = usePrivacyStore((state) => state.hidden)
  const sensitive = useSensitive()

  return (
    <div className="flex gap-3">
      {/* y axis */}
      <div className="tabular flex h-48 w-12 shrink-0 flex-col justify-between text-right text-[11px] text-muted-foreground">
        {GRID_STEPS.map((step) => (
          <span key={step} className="leading-none">
            {max > 0 && !hidden ? formatCompactMoney(max * step) : step === 0 ? "0" : ""}
          </span>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        {/* recessive grid */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-48 flex-col justify-between" aria-hidden="true">
          {GRID_STEPS.map((step) => (
            <div key={step} className={cn("border-t", step === 0 ? "border-border" : "border-dashed border-border/60")} />
          ))}
        </div>

        {/* tooltip */}
        {activePoint && (
          <div
            className="pointer-events-none absolute -top-2 z-10 -translate-y-full whitespace-nowrap rounded-lg border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
            style={tooltipPosition(active as number, data.length)}
          >
            <div className="font-medium">{activePoint.fullLabel}</div>
            <div className="tabular text-muted-foreground">
              {sensitive(formatCurrency(activePoint.total, { whole: true }))} · {activePoint.count} {activePoint.count === 1 ? "invoice" : "invoices"}
            </div>
          </div>
        )}

        <div
          className="relative flex h-48 items-end"
          role="list"
          aria-label="Invoiced amount per month"
          onMouseLeave={() => setActive(null)}
        >
          {data.map((point, index) => {
            const height = max > 0 ? (point.total / max) * 100 : 0
            const summary = `${point.fullLabel}: ${sensitive(formatCurrency(point.total, { whole: true }))}`
            return (
              <div
                key={point.key}
                role="listitem"
                tabIndex={0}
                aria-label={summary}
                title={summary}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                // the hit target spans the whole column, bigger than the bar itself
                className="group flex h-full flex-1 items-end justify-center rounded-md px-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-1.5"
              >
                <div
                  className={cn(
                    "w-full max-w-10 rounded-t bg-primary transition-opacity",
                    active !== null && active !== index ? "opacity-40" : "opacity-100",
                    point.total > 0 && "min-h-[2px]"
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
            )
          })}
        </div>

        {/* x axis */}
        <div className="mt-2 flex text-[11px] text-muted-foreground" aria-hidden="true">
          {data.map((point, index) => (
            <span
              key={point.key}
              className={cn(
                "flex-1 truncate text-center",
                // on narrow screens label every other month (always keeping the latest) to avoid collisions
                (data.length - 1 - index) % 2 === 1 && "max-sm:invisible",
                active === index && "font-medium text-foreground"
              )}
            >
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
