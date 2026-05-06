import { binanceGet } from '~/utils/binance/binanceClient'
import { resolveBinanceRestBaseUrl } from '~/utils/binance/resolveBinanceRestBaseUrl'
import { isValidBinanceSymbol } from '~/utils/binance/symbol'

type Binance24hrTicker = {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  quoteVolume: string
  highPrice: string
  lowPrice: string
}

export default defineEventHandler(async (event) => {
  const raw = getQuery(event).symbol
  const symbol = Array.isArray(raw) ? raw[0] : raw
  if (!symbol || typeof symbol !== 'string' || !isValidBinanceSymbol(symbol)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing symbol' })
  }

  const baseUrl = resolveBinanceRestBaseUrl(event)
  const row = await binanceGet<Binance24hrTicker>(
    '/api/v3/ticker/24hr',
    { symbol },
    { baseUrl }
  )

  return {
    symbol: row.symbol,
    lastPrice: row.lastPrice,
    priceChangePercent: row.priceChangePercent,
    quoteVolume: row.quoteVolume,
    highPrice: row.highPrice,
    lowPrice: row.lowPrice
  }
})
