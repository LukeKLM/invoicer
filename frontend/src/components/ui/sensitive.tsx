import { ReactNode } from "react"
import usePrivacyStore from "@/stores/usePrivacyStore"

export const PRIVACY_MASK = "••••••"

/** Swaps financial values for a fixed-length mask while privacy mode is on */
export function Sensitive({ children }: { children: ReactNode }) {
  const hidden = usePrivacyStore((state) => state.hidden)
  if (!hidden) return <>{children}</>
  return (
    <span className="select-none tracking-wider">
      <span aria-hidden="true">{PRIVACY_MASK}</span>
      <span className="sr-only">Hidden</span>
    </span>
  )
}

/** For values used in strings (titles, aria labels) */
export function useSensitive() {
  const hidden = usePrivacyStore((state) => state.hidden)
  return (value: string) => (hidden ? PRIVACY_MASK : value)
}
