import { create } from 'zustand'
import { Customer } from '@/types/customer'
import { AresCompany } from '@/types/aresCompany'
import { deleteCustomer, getCustomers, updateCustomer, createCustomer, getCustomer } from '@/lib/services/customersApiService'
import { toCamelCase } from '@/lib/helpers'
import { camelToSnake } from '@/lib/helpers'

interface CustomerAction {
  deleteApiCustomer: (id: number) => Promise<void>,
  updateApiCustomer: (id: number, customer: Customer) => Promise<void>,
  createApiCustomer: (customer: Customer) => Promise<void>,
  fetchCustomers: () => Promise<void>,
  fetchCustomer: (id: number) => Promise<void>,
  setDraft: (customer: Customer) => void,
  setDetail: (customer: Customer) => void,
  resetDraft: () => void,
  updateDraft: <K extends keyof Customer>(name: string, value: Customer[K]) => void,
  updateCustomerDialog: (value: boolean) => void,
  setAresResponse: (response: AresCompany | null) => void,
  clearAresResponse: () => void,
}

interface CustomerState {
  customers: Customer[],
  draftCustomer: Customer,
  detailCustomer: Customer,
  customerDialog: boolean,
  aresResponse: AresCompany | null,
}

const getDefaultCustomer = (): Customer => ({
  id: null,
  email: "",
  name: "",
  vatId: "",
  dicId: "",
  city: "",
  postalCode: "",
  country: "",
  street: "",
})

const useCustomerStore = create<CustomerState & CustomerAction>((set) => ({
  customerDialog: false,
  customers: [],
  detailCustomer: getDefaultCustomer(),
  draftCustomer: getDefaultCustomer(),
  aresResponse: null,
  deleteApiCustomer: async (id) => {
    await deleteCustomer(id)
  },
  createApiCustomer: async (customer) => {
    await createCustomer(camelToSnake(customer))
  },
  updateApiCustomer: async (id, customer) => {
    await updateCustomer(id, camelToSnake(customer))
  },
  fetchCustomer: async (id) => {
    set({ detailCustomer: toCamelCase(await getCustomer(id)) })
  },
  fetchCustomers: async () => {
    set({ customers: toCamelCase(await getCustomers()) })
  },
  resetDraft: () => set({ draftCustomer: getDefaultCustomer() }),
  setDraft: (customer) => set({ draftCustomer: customer }),
  setDetail: (customer) => set({ detailCustomer: customer }),
  updateDraft: (name, value) => set((state) => {
    if (!state.draftCustomer) return { draftCustomer: getDefaultCustomer() };

    return {
      draftCustomer: {
        ...state.draftCustomer,
        [name]: value,
      }
    };
  }),
  updateCustomerDialog: (value) => set({ customerDialog: value }),
  setAresResponse: (response) => set({ aresResponse: response }),
  clearAresResponse: () => set({ aresResponse: null }),
}))

export default useCustomerStore;
