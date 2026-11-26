import { create } from 'zustand'
import { SkipPayCalculationInput, SkipPayCalculationResult, SkipPayInvoiceDraft, SkipPaySettings, WorkingDaysOverview } from '@/types/skipPayCalculator'
import {
  buildSkipPayInvoiceDraft,
  calculateSkipPayInvoice,
  createSkipPaySettings,
  deleteSkipPaySettings,
  getSkipPaySettingsList,
  getWorkingDays,
  updateSkipPaySettings,
} from '@/lib/services/skipPayCalculatorApiService'
import { camelToSnake, toCamelCase } from '@/lib/helpers'

interface SkipPayCalculatorAction {
  fetchSettingsList: () => Promise<void>,
  saveApiSettings: (settings: SkipPaySettings) => Promise<void>,
  deleteApiSettings: (id: number) => Promise<void>,
  calculate: (settingsId: number, input: SkipPayCalculationInput) => Promise<void>,
  fetchWorkingDays: (year: number, month: number) => Promise<WorkingDaysOverview>,
  fetchInvoiceDraft: (settingsId: number, input: SkipPayCalculationInput) => Promise<SkipPayInvoiceDraft>,
  setDraft: (settings: SkipPaySettings) => void,
  updateDraft: <K extends keyof SkipPaySettings>(name: K, value: SkipPaySettings[K]) => void,
  resetDraftForCustomer: (customerId: number | null) => void,
  clearResult: () => void,
}

interface SkipPayCalculatorState {
  settingsList: SkipPaySettings[],
  draftSettings: SkipPaySettings,
  result: SkipPayCalculationResult | null,
  workingDays: WorkingDaysOverview | null,
}

export const getDefaultSkipPaySettings = (customerId: number | null = null): SkipPaySettings => ({
  id: null,
  customerId,
  dailyRate: "0",
  kdBonus: "0",
  repayment: "0",
  specialBonus: "0",
  learningBudget: "0",
  multisportCard: "0",
  developmentPercentage: 50,
  maintenancePercentage: 50,
})

const useSkipPayCalculatorStore = create<SkipPayCalculatorState & SkipPayCalculatorAction>((set, get) => ({
  settingsList: [],
  draftSettings: getDefaultSkipPaySettings(),
  result: null,
  workingDays: null,
  fetchSettingsList: async () => {
    set({ settingsList: toCamelCase(await getSkipPaySettingsList()) })
  },
  saveApiSettings: async (settings) => {
    const { id, ...data } = settings
    const saved = id
      ? await updateSkipPaySettings(id, camelToSnake(data))
      : await createSkipPaySettings(camelToSnake(data))
    set({ draftSettings: toCamelCase(saved) })
    await get().fetchSettingsList()
  },
  deleteApiSettings: async (id) => {
    await deleteSkipPaySettings(id)
    set((state) => ({ draftSettings: getDefaultSkipPaySettings(state.draftSettings.customerId) }))
    await get().fetchSettingsList()
  },
  calculate: async (settingsId, input) => {
    set({ result: toCamelCase(await calculateSkipPayInvoice(settingsId, camelToSnake(input))) })
  },
  fetchWorkingDays: async (year, month) => {
    const overview: WorkingDaysOverview = toCamelCase(await getWorkingDays(year, month))
    set({ workingDays: overview })
    return overview
  },
  fetchInvoiceDraft: async (settingsId, input) => {
    return toCamelCase(await buildSkipPayInvoiceDraft(settingsId, camelToSnake(input)))
  },
  setDraft: (settings) => set({ draftSettings: settings }),
  updateDraft: (name, value) => set((state) => ({
    draftSettings: {
      ...state.draftSettings,
      [name]: value,
    }
  })),
  resetDraftForCustomer: (customerId) => set({ draftSettings: getDefaultSkipPaySettings(customerId) }),
  clearResult: () => set({ result: null }),
}))

export default useSkipPayCalculatorStore;
