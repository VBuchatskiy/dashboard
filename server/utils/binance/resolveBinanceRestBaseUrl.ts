import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export function resolveBinanceRestBaseUrl(event: H3Event): string {
  const config = useRuntimeConfig(event)
  const fromConfig =
    typeof config.binanceRestUrl === 'string' ? config.binanceRestUrl.trim() : ''
  const fromEnv = process.env.BINANCE_REST_URL?.trim()
  return fromConfig || fromEnv || 'https://api.binance.com'
}
