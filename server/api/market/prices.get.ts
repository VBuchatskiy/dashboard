import { binanceGet } from '~/utils/binance/binanceClient'
import { resolveBinanceRestBaseUrl } from '~/utils/binance/resolveBinanceRestBaseUrl'
import { isValidBinanceSymbol } from '~/utils/binance/symbol'
import {
  MAX_MARKET_SYMBOLS,
  parseCommaSeparatedSymbols
} from '~/utils/market/parseSymbolsParam'

type BinancePriceRow = {
  symbol: string
  price: string
}

function normalizePriceRows(
  raw: BinancePriceRow | BinancePriceRow[]
): BinancePriceRow[] {
  return Array.isArray(raw) ? raw : [raw]
}

export default defineEventHandler(async (event) => {
  const raw = getQuery(event).symbols
  const queryStr =
    typeof raw === 'string'
      ? raw
      : Array.isArray(raw)
        ? raw.filter((x): x is string => typeof x === 'string').join(',')
        : undefined

  const tokens = parseCommaSeparatedSymbols(queryStr)
  if (tokens.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or empty symbols (comma-separated, e.g. BTCUSDT,ETHUSDT)'
    })
  }

  if (tokens.length > MAX_MARKET_SYMBOLS) {
    throw createError({
      statusCode: 400,
      statusMessage: `Too many symbols (max ${MAX_MARKET_SYMBOLS})`
    })
  }

  const invalid = tokens.filter((s) => !isValidBinanceSymbol(s))
  if (invalid.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid symbol in list'
    })
  }

  const baseUrl = resolveBinanceRestBaseUrl(event)
  const payload = await binanceGet<BinancePriceRow | BinancePriceRow[]>(
    '/api/v3/ticker/price',
    { symbols: JSON.stringify(tokens) },
    { baseUrl }
  )

  const rows = normalizePriceRows(payload)
  return rows.map((row) => ({
    symbol: row.symbol,
    price: row.price
  }))
})
