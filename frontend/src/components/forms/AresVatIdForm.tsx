import React, { useState } from 'react'
import { Loader2, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchEconomicSubject } from "@/lib/services/aresApiService"
import { mapAresDataToCustomer } from "@/lib/mappers/customerMappers"
import useCustomerStore from "@/stores/useCustomerStore"
import AresResponseDisplay from '@/components/AresResponseDisplay';
import { InlineError } from '@/components/ui/inline-error';

const AresVatIdForm: React.FC = () => {
  const [companyId, setCompanyId] = useState<string>("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setDraft, setAresResponse, aresResponse } = useCustomerStore()

  async function handleFetchEconomicSubject() {
    const ico = companyId.trim()
    if (!ico || pending) return

    setPending(true)
    setError(null)
    try {
      const data = await fetchEconomicSubject(ico)

      // Store ARES response for display
      setAresResponse(data)

      // Map and populate customer form
      const customerData = mapAresDataToCustomer(data)
      setDraft(customerData)
    } catch {
      setError("No company found for this IČO, or ARES is unavailable right now. You can still fill in the details manually.")
    } finally {
      setPending(false)
    }
  }

  const handleKeyDown: NonNullable<React.ComponentProps<"input">["onKeyDown"]> = (e) => {
    // keep Enter from submitting the surrounding customer form
    if (e.key === "Enter") {
      e.preventDefault()
      handleFetchEconomicSubject()
    }
  }

  return (
    <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">Fill from ARES</h3>
          <p className="text-xs text-muted-foreground">
            Enter the company IČO to load its name and registered address from the Czech business register.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="companyId" className="sr-only">Company IČO</label>
        <Input
          id="companyId"
          name="companyId"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="IČO, e.g. 27074358"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-card font-mono sm:max-w-xs"
        />
        <Button
          type="button"
          onClick={() => handleFetchEconomicSubject()}
          disabled={pending || !companyId.trim()}
        >
          {pending ? <Loader2 className="animate-spin" /> : <Search />}
          {pending ? "Searching…" : "Search ARES"}
        </Button>
      </div>

      {error && <InlineError className="mt-3">{error}</InlineError>}
      {aresResponse && !error && <AresResponseDisplay aresData={aresResponse} />}
    </section>
  )
}

export default AresVatIdForm;
