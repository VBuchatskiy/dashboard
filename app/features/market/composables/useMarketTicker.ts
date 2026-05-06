import { getTicker24h } from '@/features/market/api/marketApi'

export function useMarketTicker(symbol: MaybeRefOrGetter<string>) {
  const sym = toRef(symbol)
  const key = computed(() => `market-ticker-${toValue(sym)}`)

  return useAsyncData(
    key,
    () => getTicker24h(toValue(sym)),
    { watch: [sym] }
  )
}
