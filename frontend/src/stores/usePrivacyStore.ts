import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface PrivacyStore {
  /** Hides amounts and bank details, e.g. while sharing the screen */
  hidden: boolean
  toggleHidden: () => void
}

const usePrivacyStore = create<PrivacyStore>()(
  persist(
    (set) => ({
      hidden: false,
      toggleHidden: () => set((state) => ({ hidden: !state.hidden })),
    }),
    // remembered across reloads so a screen share doesn't reveal amounts on refresh
    { name: "privacy", storage: createJSONStorage(() => localStorage) }
  )
)

// inputs marked with `data-sensitive` are blurred via CSS while hidden
const applyPrivacyClass = (hidden: boolean) => document.documentElement.classList.toggle("privacy", hidden)
applyPrivacyClass(usePrivacyStore.getState().hidden)
usePrivacyStore.subscribe((state) => applyPrivacyClass(state.hidden))

export default usePrivacyStore
