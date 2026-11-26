import React, { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SkipPayCalculationResult } from "@/types/skipPayCalculator"
import { cn } from "@/lib/utils"
import { Sensitive } from "@/components/ui/sensitive"

const numberFormat = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 })

const formatValue = (value: string | number, currency: boolean) =>
  `${numberFormat.format(Number(value))}${currency ? " Kč" : ""}`

// display only: parse "YYYY-MM-DD" as a local date
const formatHolidayDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  return year && month && day ? new Date(year, month - 1, day).toLocaleDateString("cs-CZ") : value
}

type Row = { label: string, value: string | number, currency?: boolean, strong?: boolean }

const Section: React.FC<{ title: string, rows: Row[], footer?: ReactNode, className?: string }> = ({ title, rows, footer, className }) => (
  <section className={cn("rounded-lg border bg-muted/30", className)}>
    <h3 className="border-b px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</h3>
    <dl className="divide-y divide-border/60 px-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn("flex items-baseline justify-between gap-4 py-2 text-sm", row.strong && "font-semibold")}
        >
          <dt className={row.strong ? "text-foreground" : "text-muted-foreground"}>{row.label}</dt>
          <dd className="tabular whitespace-nowrap text-right">
            {(row.currency ?? true) ? <Sensitive>{formatValue(row.value, true)}</Sensitive> : formatValue(row.value, false)}
          </dd>
        </div>
      ))}
    </dl>
    {footer}
  </section>
)

const Highlight: React.FC<{ label: string, value: string, primary?: boolean }> = ({ label, value, primary }) => (
  <div className={cn("rounded-lg border px-4 py-3", primary ? "border-primary/20 bg-primary/10" : "bg-muted/30")}>
    <div className={cn("text-xs font-medium", primary ? "text-primary" : "text-muted-foreground")}>{label}</div>
    <div className="tabular mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"><Sensitive>{formatValue(value, true)}</Sensitive></div>
  </div>
)

interface SkipPayCalculationReportProps {
  result: SkipPayCalculationResult
  /** Rendered in the report header, e.g. a "Create invoice" button */
  action?: ReactNode
}

const SkipPayCalculationReport: React.FC<SkipPayCalculationReportProps> = ({ result, action }) => {
  const monthName = new Date(result.year, result.month - 1).toLocaleString("cs-CZ", { month: "long", year: "numeric" })

  return (
    <Card>
      <CardHeader className="flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Kalkulačka — {monthName}</CardTitle>
          <CardDescription>
            <span className="tabular">{formatValue(result.workedDays, false)}</span> odpracovaných dnů ·
            MD sazba <span className="tabular"><Sensitive>{formatValue(result.dailyRate, true)}</Sensitive></span>
          </CardDescription>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Highlight label="Fakturace celkem" value={result.invoiceTotal} />
          <Highlight label="Na účet" value={result.netPayout} primary />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Section title="Sazby" rows={[
            { label: "MD sazba", value: result.dailyRate },
            { label: "KD bonus", value: result.kdBonus },
            { label: "Speciální bonus", value: result.specialBonus },
            { label: "Zápočet", value: result.repayment },
            { label: "Multisport karta", value: result.multisportCard },
            { label: "Learning budget", value: result.learningBudget },
          ]} />
          <Section
            title="Pracovní doba"
            rows={[
              { label: "Všední dny v měsíci", value: result.weekdays, currency: false },
              { label: "− Svátky", value: result.holidays, currency: false },
              { label: "Pracovní dny", value: result.workingDays, currency: false },
              { label: "− Dovolená", value: result.vacationDays, currency: false },
              { label: "Odpracované dny", value: result.workedDays, currency: false, strong: true },
            ]}
            footer={result.publicHolidays.length > 0 && (
              <ul className="space-y-0.5 border-t px-4 py-2.5 text-xs text-muted-foreground">
                {result.publicHolidays.map((holiday) => (
                  <li key={holiday.date}>
                    <span className="tabular">{formatHolidayDate(holiday.date)}</span> — {holiday.name}
                  </li>
                ))}
              </ul>
            )}
          />
          <Section title="Výsledky" rows={[
            { label: "Čistý příjem", value: result.netIncome },
            { label: "+ KD bonus", value: result.incomeWithKdBonus },
            { label: "+ Speciální bonus", value: result.incomeWithSpecialBonus },
            { label: "+ Zápočet", value: result.grossInvoiceAmount },
            { label: "− Multisport karta", value: result.incomeAfterMultisport },
          ]} />
          <Section title="Fakturace" rows={[
            { label: `Vývoj (${result.developmentPercentage} %)`, value: result.developmentShare },
            { label: `Údržba (${result.maintenancePercentage} %)`, value: result.maintenanceShare },
            { label: "− Multisport karta", value: -Number(result.multisportCard) },
            { label: "+ Learning budget", value: result.learningBudget },
          ]} />
          <Section className="md:col-span-2" title="Na účet" rows={[
            { label: "Celkem", value: result.invoiceTotal, strong: true },
            { label: "− Zápočet", value: -Number(result.repayment) },
            { label: "Na účet", value: result.netPayout, strong: true },
          ]} />
        </div>
      </CardContent>
    </Card>
  )
}

export default SkipPayCalculationReport
