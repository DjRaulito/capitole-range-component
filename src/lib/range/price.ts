export function roundToCents(value: number): number {
  return Number(value.toFixed(2))
}

export function formatPrice(value: number): string {
  return `${roundToCents(value)}€`
}

export function parsePrice(text: string): number | null {
  const cleaned = text.trim().replace(/\s*€$/, '')

  if (!/^\d+([.,]\d+)?$/.test(cleaned)) {
    return null
  }
  return Number(cleaned.replace(',', '.'))
}
