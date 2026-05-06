import type {
  MarketBookTicker,
  MarketPrice,
  MarketTicker24h
} from '@/features/market/types'

export const getTicker24h = (symbol: string) => {
  const { $api } = useNuxtApp()
  return $api<MarketTicker24h>('/api/market/ticker', {
    query: { symbol }
  })
}

export const getBookTicker = (symbol: string) => {
  const { $api } = useNuxtApp()
  return $api<MarketBookTicker>('/api/market/book-ticker', {
    query: { symbol }
  })
}

/** Batch snapshot: one Nitro request → one Binance ticker/price call for all symbols. */
export const getPrices = (symbols: string[]) => {
  const { $api } = useNuxtApp()
  return $api<MarketPrice[]>('/api/market/prices', {
    query: { symbols: symbols.join(',') }
  })
}
