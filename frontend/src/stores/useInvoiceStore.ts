import { create } from 'zustand'
import { Invoice, InvoicePaymentType, InvoiceStateType, InvoiceItem } from '@/types/invoice'
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getInvoice } from '@/lib/services/invoicesApiService'
import { toCamelCase } from '@/lib/helpers'
import { camelToSnake } from '@/lib/helpers'

interface InvocieAction {
  deleteApiInvoice: (id: number) => Promise<void>,
  updateApiInvoice: (id: number, invoice: Invoice) => Promise<void>,
  createApiInvoice: (invoice: Invoice) => Promise<void>,
  fetchInvoices: () => Promise<void>,
  fetchInvoice: (id: number) => Promise<void>,
  setDraft: (invoice: Invoice) => void,
  setDetail: (invoice: Invoice) => void,
  resetDraft: () => void,
  appendDefaultItem: () => void,
  deleteDraftInvoiceItem: (index: number) => void,
  updateDraft: <K extends keyof Invoice>(name: string, value: Invoice[K]) => void,
  updateDraftItem: <K extends keyof InvoiceItem>(index: number, name: string, value: InvoiceItem[K]) => void,
  updateInvoiceDialog: (value: boolean) => void,
}

interface InvoiceState {
  invoices: Invoice[],
  draftInvoice: Invoice,
  detailInvoice: Invoice,
  invoiceDialog: boolean,
}

const getDefaultInvoiceItem = (): InvoiceItem => ({
  id: null,
  invoiceId: null,
  price: "0",
  title: "",
  quantity: 1,
})

const getDefaultInvoice = (): Invoice => ({
  id: null,
  dueDate: "",
  exposeDate: "",
  invoiceNumber: "",
  orderNumber: "",
  paymentType: InvoicePaymentType.BANK_TRANSFER,
  state: InvoiceStateType.DRAFT,
  totalPrice: "0",
  customer: {
    id: null,
    email: "",
    name: "",
    vatId: "",
    dicId: "",
    city: "",
    postalCode: "",
    country: "",
    street: "",
  },
  supplier: {
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
  },
  supplierId: undefined,
  customerId: undefined,
  variableSymbol: "",
  items: [
    getDefaultInvoiceItem()
  ]
})

const useInvoiceStore = create<InvoiceState & InvocieAction>((set) => ({
  invoiceDialog: false,
  invoices: [],
  detailInvoice: getDefaultInvoice(),
  draftInvoice: getDefaultInvoice(),
  deleteApiInvoice: async (id) => {
    await deleteInvoice(id)
  },
  createApiInvoice: async (invoice) => {
    console.log(invoice)
    await createInvoice(camelToSnake(invoice))
  },
  updateApiInvoice: async (id, invoice) => {
    await updateInvoice(id, camelToSnake(invoice))
  },
  fetchInvoice: async (id) => {
    set({ detailInvoice: toCamelCase(await getInvoice(id)) })
  },
  fetchInvoices: async () => {
    set({ invoices: toCamelCase(await getInvoices()) })
  },
  resetDraft: () => set({ draftInvoice: getDefaultInvoice() }),
  setDraft: (invoice) => set({ draftInvoice: invoice }),
  setDetail: (invoice) => set({ detailInvoice: invoice }),
  appendDefaultItem: () => set((state) => {
    if (!state.draftInvoice) return { draftInvoice: getDefaultInvoice() }

    const appendedItems = [...state.draftInvoice.items]

    const appendItem = { ...getDefaultInvoiceItem(), invoiceId: state.draftInvoice.id }
    appendedItems.push(appendItem)

    return {
      draftInvoice: {
        ...state.draftInvoice,
        items: appendedItems,
      }
    }
  }),
  deleteDraftInvoiceItem: (index) => set((state) => {
    const updatedItems = [...state.draftInvoice.items]
    updatedItems.splice(index, 1)
    return {
      draftInvoice: {
        ...state.draftInvoice,
        items: updatedItems,
      }
    }
  }),
  updateDraft: (name, value) => set((state) => {
    if (!state.draftInvoice) return { draftInvoice: getDefaultInvoice() };

    return {
      draftInvoice: {
        ...state.draftInvoice,
        [name]: value,
      }
    };
  }),
  updateDraftItem: (index, name, value) => set((state) => {
    if (!state.draftInvoice) return { draftInvoice: getDefaultInvoice() };

    const updatedItems = [...state.draftInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };

    return {
      draftInvoice: {
        ...state.draftInvoice,
        items: updatedItems,
      },
    };
  }),
  updateInvoiceDialog: (value) => set({ invoiceDialog: value }),
}))

export default useInvoiceStore;
