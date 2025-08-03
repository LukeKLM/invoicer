import fetchClient from "@/lib/httpClient";
import { toCamelCase } from "@/lib/helpers"


export const fetchEconomicSubject = async (companyId: string) => {
  const result = await fetchClient(
    `/ares/economic-subject/${companyId}`,
    {
      method: "GET",
    }
  )
  const jsonData = await result.json()

  return toCamelCase(jsonData)
}
