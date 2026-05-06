import { getBookTicker } from '@/features/market/api/marketApi'

export function useMarketBookTicker(symbol: MaybeRefOrGetter<string>) {
  const sym = toRef(symbol)
  const key = computed(() => `market-book-${toValue(sym)}`)

  return useAsyncData(
    key,
    () => getBookTicker(toValue(sym)),
    { watch: [sym] }
  )
}
