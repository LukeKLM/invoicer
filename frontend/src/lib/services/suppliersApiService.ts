import fetchClient from "@/lib/httpClient";
import { Supplier } from "@/types/supplier";

export const getSuppliers = async () => {
  const suppliers = await fetchClient(
    "/invoice-suppliers",
    {
      method: "GET",
    }
  )
  return suppliers.json()
}

export const getSupplier = async (id: number) => {
  const supplier = await fetchClient(
    `/invoice-suppliers/${id}`,
    {
      method: "GET",
    }
  )
  return supplier.json()
}

export const createSupplier = async (data: Supplier) => {
  const suppliers = await fetchClient(
    "/invoice-suppliers/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return suppliers.json()
}

export const deleteSupplier = async (id: number) => {
  await fetchClient(
    `/invoice-suppliers/${id}`,
    {
      method: "DELETE",
    }
  )
}

export const updateSupplier = async (id: number, data: Supplier) => {
  await fetchClient(
    `/invoice-suppliers/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
}
