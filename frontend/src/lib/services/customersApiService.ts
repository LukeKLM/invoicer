import fetchClient from "@/lib/httpClient";
import { Customer } from "@/types/customer";

export const getCustomers = async () => {
  const customers = await fetchClient(
    "/invoice-customers",
    {
      method: "GET",
    }
  )
  return customers.json()
}

export const getCustomer = async (id: number) => {
  const customer = await fetchClient(
    `/invoice-customers/${id}`,
    {
      method: "GET",
    }
  )
  return customer.json()
}

export const createCustomer = async (data: Customer) => {
  const customers = await fetchClient(
    "/invoice-customers/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
  return customers.json()
}

export const deleteCustomer = async (id: number) => {
  await fetchClient(
    `/invoice-customers/${id}`,
    {
      method: "DELETE",
    }
  )
}

export const updateCustomer = async (id: number, data: Customer) => {
  await fetchClient(
    `/invoice-customers/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
}
