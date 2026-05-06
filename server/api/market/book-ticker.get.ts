import { binanceGet } from '~/utils/binance/binanceClient'
import { resolveBinanceRestBaseUrl } from '~/utils/binance/resolveBinanceRestBaseUrl'
import { isValidBinanceSymbol } from '~/utils/binance/symbol'

type BinanceBookTickerRow = {
  symbol: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
}

export default defineEventHandler(async (event) => {
  const raw = getQuery(event).symbol
  const symbol = Array.isArray(raw) ? raw[0] : raw
  if (!symbol || typeof symbol !== 'string' || !isValidBinanceSymbol(symbol)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or missing symbol' })
  }

  const baseUrl = resolveBinanceRestBaseUrl(event)
  const row = await binanceGet<BinanceBookTickerRow | BinanceBookTickerRow[]>(
    '/api/v3/ticker/bookTicker',
    { symbol },
    { baseUrl }
  )

  const data = Array.isArray(row) ? row[0] : row
  if (!data) {
    throw createError({ statusCode: 502, statusMessage: 'Empty book ticker response' })
  }

  return {
    symbol: data.symbol,
    bidPrice: data.bidPrice,
    bidQty: data.bidQty,
    askPrice: data.askPrice,
    askQty: data.askQty
  }
})
