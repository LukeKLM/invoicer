import fetchClient from "@/lib/httpClient"
import { Invoice } from "@/types/invoice"

const INVOICES_URL = "/invoices"

export const getInvoices = async () => {
  const invoices = await fetchClient(
    INVOICES_URL,
    {
      method: "GET",
    }

  )
  return invoices.json()
}

export const getInvoice = async (id: number) => {
  const invoice = await fetchClient(
    `${INVOICES_URL}/${id}`,
    {
      method: "GET",
    }
  )
  return invoice.json()
}

export const createInvoice = async (data: Invoice) => {
  const invoice = await fetchClient(
    INVOICES_URL,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return invoice.json()
}

export const deleteInvoice = async (id: number) => {
  await fetchClient(
    `${INVOICES_URL}/${id}`,
    {
      method: "DELETE",
    }
  )
}

export const updateInvoice = async (id: number, data: Invoice) => {
  await fetchClient(
    `${INVOICES_URL}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
}

export const downloadInvoice = async (id: number) => {
  const response = await fetchClient(
    `${INVOICES_URL}/${id}/pdf`,
    {
      method: "GET",
    }
  )
  const pdfBlob = await response.blob()
  const url = URL.createObjectURL(pdfBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice_${id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
