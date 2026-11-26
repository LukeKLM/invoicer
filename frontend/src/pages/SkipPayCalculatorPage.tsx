import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "@/components/forms_inputs/inputField";
import { SelectField } from "@/components/forms_inputs/selectField";
import { Calculator, CalendarDays, FilePlus2, Loader2, Settings, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import SkipPayCalculationReport from "@/components/skip_pay/SkipPayCalculationReport";
import InvoiceDialog from "@/components/dialogs/InvoiceDialog";
import useInvoiceStore from "@/stores/useInvoiceStore";
import { InvoicePaymentType, InvoiceStateType } from "@/types/invoice";
import { SkipPayCalculationInput } from "@/types/skipPayCalculator";
import useCustomerStore from "@/stores/useCustomerStore";
import useSkipPayCalculatorStore from "@/stores/useSkipPayCalculatorStore";
import { InlineError } from "@/components/ui/inline-error";

const currentMonth = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
}

// display only: parse "YYYY-MM-DD" as a local date
const formatHolidayDate = (value: string) => {
  const [year, monthNumber, day] = value.split("-").map(Number)
  return year && monthNumber && day ? new Date(year, monthNumber - 1, day).toLocaleDateString("cs-CZ") : value
}

const SkipPayCalculatorPage: React.FC = () => {
  const { customers, fetchCustomers } = useCustomerStore()
  const { settingsList, result, workingDays, fetchSettingsList, fetchWorkingDays, calculate, fetchInvoiceDraft, clearResult } = useSkipPayCalculatorStore()
  const { setDraft: setInvoiceDraft, updateInvoiceDialog } = useInvoiceStore()
  const navigate = useNavigate()

  const [settingsId, setSettingsId] = useState<number | null>(null)
  const [month, setMonth] = useState(currentMonth())
  const [holidays, setHolidays] = useState("0")
  const [vacationDays, setVacationDays] = useState("0")
  const [error, setError] = useState<string | null>(null)
  // purely UI pending flags
  const [calculating, setCalculating] = useState(false)
  const [creatingInvoice, setCreatingInvoice] = useState(false)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    fetchCustomers()
    fetchSettingsList().finally(() => setSettingsLoaded(true))
    return () => clearResult()
  }, [fetchCustomers, fetchSettingsList, clearResult])

  // a changed input makes the shown report stale - hide it (and the Create invoice button) until recalculated
  useEffect(() => {
    clearResult()
  }, [settingsId, month, holidays, vacationDays, clearResult])

  // pre-fill holidays with Czech public holidays falling on working days of the selected month
  useEffect(() => {
    if (!month) return
    const [year, monthNumber] = month.split("-").map(Number)
    fetchWorkingDays(year, monthNumber)
      .then((overview) => setHolidays(String(overview.publicHolidays.length)))
      .catch((e) => setError(`Loading holidays failed: ${(e as Error).message}`))
  }, [month, fetchWorkingDays])

  useEffect(() => {
    if (settingsId === null && settingsList.length === 1) {
      setSettingsId(settingsList[0].id)
    }
  }, [settingsId, settingsList])

  const settingsOptions = settingsList.map((settings) => ({
    value: settings.id as number,
    label: customers.find((customer) => customer.id === settings.customerId)?.name ?? `Customer ${settings.customerId}`,
  }))

  const getInput = (): SkipPayCalculationInput => {
    const [year, monthNumber] = month.split("-").map(Number)
    return {
      year,
      month: monthNumber,
      holidays: Number(holidays) || 0,
      vacationDays: vacationDays || "0",
    }
  }

  const handleCalculate = async () => {
    if (!settingsId) return
    setError(null)
    try {
      await calculate(settingsId, getInput())
    } catch (e) {
      setError(`Calculation failed: ${(e as Error).message}`)
    }
  }

  // pre-fills the invoice dialog - the invoice is saved only after the user confirms it there
  const handleCreateInvoice = async () => {
    if (!settingsId) return
    setError(null)
    try {
      const draft = await fetchInvoiceDraft(settingsId, getInput())
      setInvoiceDraft({
        id: null,
        invoiceNumber: draft.invoiceNumber,
        variableSymbol: draft.variableSymbol,
        orderNumber: draft.orderNumber ?? "",
        exposeDate: draft.exposeDate,
        dueDate: draft.dueDate,
        paymentType: draft.paymentType as InvoicePaymentType,
        state: draft.state as InvoiceStateType,
        customerId: draft.customerId,
        supplierId: draft.supplierId ?? undefined,
        customer: null,
        supplier: null,
        totalPrice: draft.calculation.invoiceTotal,
        items: draft.items.map((item) => ({
          id: null,
          invoiceId: null,
          title: item.title,
          price: String(item.price),
          quantity: item.quantity,
        })),
      })
      updateInvoiceDialog(true)
    } catch (e) {
      setError(`Preparing invoice failed: ${(e as Error).message}`)
    }
  }

  const runCalculate = async () => {
    setCalculating(true)
    try {
      await handleCalculate()
    } finally {
      setCalculating(false)
    }
  }

  const runCreateInvoice = async () => {
    setCreatingInvoice(true)
    try {
      await handleCreateInvoice()
    } finally {
      setCreatingInvoice(false)
    }
  }

  const ready = Boolean(settingsId && month)

  return (
    <div>
      <PageHeader
        title="Skip Pay calculator"
        description="Work out the monthly invoice from the customer's rates, working days and your vacation."
        actions={
          <Button variant="outline" asChild>
            <Link to="/settings"><SlidersHorizontal /> Edit rates</Link>
          </Button>
        }
      />

      {!settingsLoaded && settingsList.length === 0 ? (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <Card className="space-y-5 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
            <Skeleton className="h-9 w-full" />
          </Card>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      ) : settingsList.length === 0 ? (
        <Card>
          <EmptyState
            icon={Calculator}
            title="No calculator settings yet"
            description="Set up the daily rate, bonuses and split for a customer first. The calculator uses them to build the monthly invoice."
            action={
              <Button asChild>
                <Link to="/settings"><Settings /> Open settings</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Pick the customer and month, then adjust days off.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <SelectField
                  id="settingsId"
                  name="settingsId"
                  required={true}
                  label="Customer"
                  placeholder="Select customer"
                  options={settingsOptions}
                  value={settingsId ?? undefined}
                  hint="Uses the rates saved for this customer in Settings."
                  onChange={(e) => setSettingsId(e.target.value ? Number(e.target.value) : null)}
                />
                <InputField
                  id="month"
                  name="month"
                  type="month"
                  required={true}
                  label="Month"
                  value={month}
                  hint="Public holidays are pre-filled for the chosen month."
                  onChange={(e) => setMonth(e.target.value)}
                />
                <InputField
                  id="holidays"
                  name="holidays"
                  type="number"
                  required={true}
                  label="Holidays (svátky)"
                  value={holidays}
                  hint="Public holidays falling on working days."
                  onChange={(e) => setHolidays(e.target.value)}
                />
                <InputField
                  id="vacationDays"
                  name="vacationDays"
                  type="number"
                  required={true}
                  label="Vacation days (dovolená)"
                  value={vacationDays}
                  hint="Working days you took off this month."
                  onChange={(e) => setVacationDays(e.target.value)}
                />
              </div>

              {workingDays && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                    <span className="tabular">{workingDays.workingDays}</span> working days
                    <span className="font-normal text-muted-foreground">
                      (<span className="tabular">{workingDays.weekdays}</span> weekdays)
                    </span>
                  </div>
                  {workingDays.publicHolidays.length === 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">No public holidays on working days.</p>
                  ) : (
                    <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      {workingDays.publicHolidays.map((holiday) => (
                        <li key={holiday.date} className="flex gap-2">
                          <span className="tabular shrink-0 text-foreground">{formatHolidayDate(holiday.date)}</span>
                          <span className="truncate">{holiday.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {error && (
                <InlineError>{error}</InlineError>
              )}

              <Button className="w-full" onClick={runCalculate} disabled={!ready || calculating}>
                {calculating ? <Loader2 className="animate-spin" /> : <Calculator />}
                {calculating ? "Calculating…" : "Calculate"}
              </Button>
            </CardContent>
          </Card>

          <div className="min-w-0 lg:sticky lg:top-20">
            {result ? (
              <SkipPayCalculationReport
                result={result}
                action={
                  <Button variant="outline" onClick={runCreateInvoice} disabled={!ready || creatingInvoice}>
                    {creatingInvoice ? <Loader2 className="animate-spin" /> : <FilePlus2 />}
                    Create invoice
                  </Button>
                }
              />
            ) : (
              <Card className="border-dashed shadow-none">
                <EmptyState
                  icon={Calculator}
                  title={calculating ? "Calculating…" : "Enter values to see the calculation"}
                  description={ready
                    ? "Press Calculate to see the invoice total, the payout and the full breakdown."
                    : "Select a customer and month on the left, then press Calculate."}
                />
              </Card>
            )}
          </div>
        </div>
      )}

      <InvoiceDialog onSaved={() => navigate("/invoices")} />
    </div>
  );
}

export default SkipPayCalculatorPage;
