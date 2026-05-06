/** Max symbols per batch request (avoid huge upstream payloads). */
export const MAX_MARKET_SYMBOLS = 50

/**
 * Parse comma-separated symbol list: trim, drop empties, preserve first-seen order, dedupe.
 */
export function parseCommaSeparatedSymbols(input: string | undefined): string[] {
  if (!input?.trim()) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of input.split(',')) {
    const s = part.trim()
    if (!s || seen.has(s)) continue
    seen.add(s)
    out.push(s)
  }
  return out
}
