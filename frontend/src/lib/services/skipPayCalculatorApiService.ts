import fetchClient from "@/lib/httpClient";

export const getSkipPaySettingsList = async () => {
  const settings = await fetchClient(
    "/skip-pay-calculator/settings",
    {
      method: "GET",
    }
  )
  return settings.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSkipPaySettings = async (data: any) => {
  const settings = await fetchClient(
    "/skip-pay-calculator/settings",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return settings.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSkipPaySettings = async (id: number, data: any) => {
  const settings = await fetchClient(
    `/skip-pay-calculator/settings/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
  return settings.json()
}

export const deleteSkipPaySettings = async (id: number) => {
  await fetchClient(
    `/skip-pay-calculator/settings/${id}`,
    {
      method: "DELETE",
    }
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculateSkipPayInvoice = async (id: number, data: any) => {
  const result = await fetchClient(
    `/skip-pay-calculator/settings/${id}/calculate`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return result.json()
}

export const getWorkingDays = async (year: number, month: number) => {
  const overview = await fetchClient(
    `/skip-pay-calculator/working-days?year=${year}&month=${month}`,
    {
      method: "GET",
    }
  )
  return overview.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildSkipPayInvoiceDraft = async (id: number, data: any) => {
  const draft = await fetchClient(
    `/skip-pay-calculator/settings/${id}/invoice-draft`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return draft.json()
}
