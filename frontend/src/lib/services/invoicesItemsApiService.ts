import fetchClient from "@/lib/httpClient";

export const getInvoiceItems = async() => {
    const invoiceItems = await fetchClient(
        "/invoice-items",
        {
            method: "GET",
        }
    )
    return invoiceItems.json()
}

export const createInvoiceItem = async(data: any) => {
    const invoiceItem = await fetchClient(
        "/invoice-items/",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    )
    return invoiceItem.json()
}

export const deleteInvoiceItem = async(id: number) => {
    await fetchClient(
        `/invoice-items/${id}`,
        {
            method: "DELETE",
        }
    )
}

export const updateInvoiceItem = async(id: number, data: any) => {
    await fetchClient(
        `/invoice-items/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(data),
        }
    )
}
