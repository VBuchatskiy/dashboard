import { useRuntimeConfig } from '#imports'

export function resolveBinanceWsBaseUrl(): string {
  const config = useRuntimeConfig()
  const fromConfig =
    typeof config.binanceWsUrl === 'string' ? config.binanceWsUrl.trim() : ''
  const fromEnv = process.env.BINANCE_WS_URL?.trim()
  return fromConfig || fromEnv || 'wss://stream.binance.com:9443'
}
