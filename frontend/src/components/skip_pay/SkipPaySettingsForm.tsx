import React, { useEffect, useRef, useState } from "react"
import { Check, Loader2, Trash2, Users } from "lucide-react"
import { InputField } from "@/components/forms_inputs/inputField"
import { SelectField } from "@/components/forms_inputs/selectField"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import useCustomerStore from "@/stores/useCustomerStore"
import useSkipPayCalculatorStore from "@/stores/useSkipPayCalculatorStore"
import { SkipPaySettings } from "@/types/skipPayCalculator"
import { cn } from "@/lib/utils"
import { InlineError } from "@/components/ui/inline-error"

const moneyFields: { name: keyof SkipPaySettings, label: string, hint: string }[] = [
  { name: "dailyRate", label: "Daily rate (MD sazba)", hint: "Paid per worked day." },
  { name: "kdBonus", label: "KD bonus", hint: "Monthly bonus added to the income." },
  { name: "specialBonus", label: "Special bonus", hint: "One-off or recurring extra bonus." },
  { name: "repayment", label: "Repayment (Zápočet)", hint: "Invoiced, then subtracted from the payout." },
  { name: "multisportCard", label: "Multisport card", hint: "Deducted from the invoice." },
  { name: "learningBudget", label: "Learning budget", hint: "Added to the invoice." },
]

// structural event type - only name/value are read from the change events
type FieldChangeEvent = { target: { name: string, value: string } }

const SAVED_VISIBLE_MS = 2500

const FormSection: React.FC<{ title: string, description?: string, children: React.ReactNode }> = ({ title, description, children }) => (
  <fieldset className="space-y-4">
    <div>
      <legend className="text-sm font-medium">{title}</legend>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
    {children}
  </fieldset>
)

const SkipPaySettingsForm: React.FC = () => {
  const { customers, fetchCustomers } = useCustomerStore()
  const {
    settingsList, draftSettings, fetchSettingsList, saveApiSettings, deleteApiSettings,
    setDraft, updateDraft, resetDraftForCustomer,
  } = useSkipPayCalculatorStore()
  const [message, setMessage] = useState<{ type: "error" | "success", text: string } | null>(null)
  // purely UI state: pending flags, delete confirmation, fading confirmation
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const hideTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    fetchCustomers()
    fetchSettingsList()
  }, [fetchCustomers, fetchSettingsList])

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  const customerOptions = customers.map((customer) => ({ value: customer.id as number, label: customer.name }))
  const percentagesSum = Number(draftSettings.developmentPercentage) + Number(draftSettings.maintenancePercentage)
  const percentagesValid = percentagesSum === 100

  const showSuccess = (text: string) => {
    setMessage({ type: "success", text })
    setConfirmationVisible(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setConfirmationVisible(false), SAVED_VISIBLE_MS)
  }

  const customerChanged = (e: FieldChangeEvent) => {
    setMessage(null)
    const customerId = e.target.value ? Number(e.target.value) : null
    const existing = settingsList.find((settings) => settings.customerId === customerId)
    if (existing) {
      setDraft(existing)
    } else {
      resetDraftForCustomer(customerId)
    }
  }

  const moneyChanged = (e: FieldChangeEvent) => {
    const { name, value } = e.target
    updateDraft(name as keyof SkipPaySettings, value)
  }

  const percentageChanged = (e: FieldChangeEvent) => {
    const { name, value } = e.target
    updateDraft(name as keyof SkipPaySettings, Number(value))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveApiSettings(draftSettings)
      showSuccess("Saved")
    } catch (e) {
      setMessage({ type: "error", text: `Saving failed: ${(e as Error).message}` })
    } finally {
      setSaving(false)
    }
  }

  // errors are shown inside the confirmation dialog
  const handleDelete = async () => {
    if (!draftSettings.id) return
    await deleteApiSettings(draftSettings.id)
    showSuccess("Settings removed")
  }

  const customerName = customers.find((customer) => customer.id === draftSettings.customerId)?.name

  return (
    <Card className="min-w-0">
      <CardContent className="space-y-8 pt-6">
        <FormSection title="Customer" description="Settings are linked to one customer. Pick one to edit its rates.">
          <SelectField
            id="customerId"
            name="customerId"
            className="sm:max-w-sm"
            required={true}
            label="Customer"
            placeholder="Select customer"
            options={customerOptions}
            value={draftSettings.customerId ?? undefined}
            hint={draftSettings.customerId
              ? draftSettings.id ? "Editing saved settings." : "No settings yet — they will be created on save."
              : undefined}
            onChange={customerChanged}
          />
        </FormSection>

        {draftSettings.customerId ? (
          <>
            <FormSection title="Rates" description="Amounts in Czech crowns (Kč).">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {moneyFields.map((field) => (
                  <InputField
                    key={field.name}
                    id={field.name}
                    name={field.name}
                    type="number"
                    required={true}
                    label={`${field.label} (Kč)`}
                    placeholder="0"
                    hint={field.hint}
                    sensitive
                    value={draftSettings[field.name] as string}
                    onChange={moneyChanged}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection title="Invoice split" description="How the invoiced amount is divided between invoice items.">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                  id="developmentPercentage"
                  name="developmentPercentage"
                  type="number"
                  required={true}
                  label="Development (%)"
                  placeholder="50"
                  value={draftSettings.developmentPercentage}
                  onChange={percentageChanged}
                />
                <InputField
                  id="maintenancePercentage"
                  name="maintenancePercentage"
                  type="number"
                  required={true}
                  label="Maintenance (%)"
                  placeholder="50"
                  value={draftSettings.maintenancePercentage}
                  onChange={percentageChanged}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className={cn("h-full transition-[width]", percentagesValid ? "bg-primary" : "bg-destructive")}
                    style={{ width: `${Math.min(Math.max(Number(draftSettings.developmentPercentage) || 0, 0), 100)}%` }}
                  />
                </div>
                <p className={cn("tabular text-xs", percentagesValid ? "text-muted-foreground" : "text-destructive")}>
                  {percentagesValid
                    ? `Development ${draftSettings.developmentPercentage} % · Maintenance ${draftSettings.maintenancePercentage} %`
                    : `Development and maintenance must add up to 100 % (now ${percentagesSum} %).`}
                </p>
              </div>
            </FormSection>
          </>
        ) : customers.length === 0 ? (
          <EmptyState
            className="rounded-lg border border-dashed py-10"
            icon={Users}
            title="No customers yet"
            description="Add a customer first, then set up its calculator rates here."
          />
        ) : null}

        {message?.type === "error" && (
          <InlineError>{message.text}</InlineError>
        )}
      </CardContent>

      {(draftSettings.customerId || message?.type === "success") && (
        <CardFooter className="flex-wrap justify-end gap-3 border-t bg-muted/30 px-6 py-4">
          <span
            aria-live="polite"
            className={cn(
              "mr-auto flex items-center gap-1.5 text-sm font-medium text-success transition-opacity duration-500",
              message?.type === "success" && confirmationVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {message?.type === "success" && <><Check className="size-4" aria-hidden="true" /> {message.text}</>}
          </span>
          {draftSettings.id && (
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirmDelete(true)} disabled={saving}>
              <Trash2 /> Remove
            </Button>
          )}
          {draftSettings.customerId && (
            <Button onClick={handleSave} disabled={!percentagesValid || saving}>
              {saving && <Loader2 className="animate-spin" />}
              {draftSettings.id ? "Save changes" : "Create settings"}
            </Button>
          )}
        </CardFooter>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Remove calculator settings?"
        description={`The saved rates${customerName ? ` for ${customerName}` : ""} will be deleted. Existing invoices are not affected.`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        errorMessage={(e) => `Deleting failed: ${(e as Error).message}`}
      />
    </Card>
  )
}

export default SkipPaySettingsForm
