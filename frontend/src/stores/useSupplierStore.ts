import { create } from 'zustand'
import { Supplier } from '@/types/supplier'
import { deleteSupplier, getSuppliers, updateSupplier, createSupplier, getSupplier } from '@/lib/services/suppliersApiService'
import { toCamelCase } from '@/lib/helpers'
import { camelToSnake } from '@/lib/helpers'

interface SupplierAction {
  deleteApiSupplier: (id: number) => Promise<void>,
  updateApiSupplier: (id: number, supplier: Supplier) => Promise<void>,
  createApiSupplier: (supplier: Supplier) => Promise<void>,
  fetchSuppliers: () => Promise<void>,
  fetchSupplier: (id: number) => Promise<void>,
  setDraft: (supplier: Supplier) => void,
  setDetail: (supplier: Supplier) => void,
  resetDraft: () => void,
  updateDraft: <K extends keyof Supplier>(name: string, value: Supplier[K]) => void,
  updateSupplierDialog: (value: boolean) => void,
}

interface SupplierState {
  suppliers: Supplier[],
  draftSupplier: Supplier,
  detailSupplier: Supplier,
  supplierDialog: boolean,
}

const getDefaultSupplier = (): Supplier => ({
  id: null,
  email: "",
  name: "",
  vatId: "",
  city: "",
  postalCode: "",
  country: "",
  street: "",
  bankAccount: "",
  bankCode: "",
  iban: "",
})

const useSupplierStore = create<SupplierState & SupplierAction>((set) => ({
  supplierDialog: false,
  suppliers: [],
  detailSupplier: getDefaultSupplier(),
  draftSupplier: getDefaultSupplier(),
  deleteApiSupplier: async (id) => {
    await deleteSupplier(id)
  },
  createApiSupplier: async (supplier) => {
    await createSupplier(camelToSnake(supplier))
  },
  updateApiSupplier: async (id, supplier) => {
    await updateSupplier(id, camelToSnake(supplier))
  },
  fetchSupplier: async (id) => {
    set({ detailSupplier: toCamelCase(await getSupplier(id)) })
  },
  fetchSuppliers: async () => {
    set({ suppliers: toCamelCase(await getSuppliers()) })
  },
  resetDraft: () => set({ draftSupplier: getDefaultSupplier() }),
  setDraft: (supplier) => set({ draftSupplier: supplier }),
  setDetail: (supplier) => set({ detailSupplier: supplier }),
  updateDraft: (name, value) => set((state) => {
    if (!state.draftSupplier) return { draftSupplier: getDefaultSupplier() };

    return {
      draftSupplier: {
        ...state.draftSupplier,
        [name]: value,
      }
    };
  }),
  updateSupplierDialog: (value) => set({ supplierDialog: value }),
}))

export default useSupplierStore;
