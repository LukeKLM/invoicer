const LEGAL_FORM = /^(s\.?r\.?o\.?|spol\.?|a\.?s\.?|k\.?s\.?|v\.?o\.?s\.?|z\.?s\.?|o\.?p\.?s\.?|se|ltd\.?|inc\.?|gmbh|llc)$/i

/** Two-letter initials for a company/person name, skipping legal-form suffixes like "s.r.o." */
export function getInitials(name: string | null | undefined): string {
  const words = (name ?? "")
    .split(/\s+/)
    .map((w) => w.replace(/[,;]+$/, ""))
    .filter((w) => /^[\p{L}\p{N}]/u.test(w) && !LEGAL_FORM.test(w))
  if (words.length === 0) return "?"
  const letters = words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0]
  return letters.toUpperCase()
}

/** "110 00 Praha" style second address line */
export function formatCityLine(postalCode?: string, city?: string): string {
  return [postalCode, city].filter(Boolean).join(" ")
}
