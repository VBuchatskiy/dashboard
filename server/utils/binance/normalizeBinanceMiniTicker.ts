import type { MarketPrice } from '@/features/market/types'

type CombinedMiniTickerEnvelope = {
  data?: {
    s?: unknown
    c?: unknown
  }
}

/**
 * Parse a Binance combined-stream frame for @miniTicker (24hrMiniTicker).
 * @see https://binance-docs.github.io/apidocs/spot/en/#individual-symbol-mini-ticker-stream
 */
export function normalizeBinanceCombinedMiniTickerMessage(
  raw: string
): MarketPrice | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  const data = (parsed as CombinedMiniTickerEnvelope).data
  if (!data || typeof data !== 'object') return null
  const symbol = data.s
  const price = data.c
  if (typeof symbol !== 'string' || typeof price !== 'string') return null
  return { symbol, price }
}
