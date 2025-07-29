import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { InputField } from "@/components/forms_inputs/inputField"
import { fetchEconomicSubject } from "@/lib/services/aresApiService"
import { mapAresDataToCustomer } from "@/lib/mappers/customerMappers"
import useCustomerStore from "@/stores/useCustomerStore"

const AresVatIdForm: React.FC = () => {
  const [companyId, setCompanyId] = useState<string>("")
  const { setDraft, setAresResponse } = useCustomerStore()

  async function handleFetchEconomicSubject() {
    const data = await fetchEconomicSubject(companyId)
    console.log(data)

    // Store ARES response for display
    setAresResponse(data)
    
    // Map and populate customer form
    const customerData = mapAresDataToCustomer(data)
    setDraft(customerData)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <InputField
          id="companyId"
          name="companyId"
          type="text"
          required={true}
          label="Company ID"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        />
        <div className="flex items-end">
          <Button
            className="button"
            onClick={() => handleFetchEconomicSubject()}
          >
            Fill out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AresVatIdForm;
