import { getPrices } from '@/features/market/api/marketApi'

function pricesCacheKey(symbols: string[]): string {
  return [...symbols].sort().join(',')
}

/**
 * Batch current prices (REST snapshot). One $api round-trip for the whole list — avoids N parallel Binance calls through Nitro.
 * Later, WebSocket can patch the same { symbol, price } rows.
 */
export function useMarketPrices(symbols: MaybeRefOrGetter<string[]>) {
  const symList = toRef(symbols)
  const key = computed(
    () => `market-prices-${pricesCacheKey(toValue(symList))}`
  )

  return useAsyncData(
    key,
    () => getPrices(toValue(symList)),
    { watch: [symList] }
  )
}
