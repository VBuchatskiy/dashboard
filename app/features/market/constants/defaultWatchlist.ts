/**
 * Default market pairs for the dashboard first load (init data).
 * One batched GET /api/market/prices — replace later with user prefs / API / store if needed.
 */
export const DEFAULT_WATCHLIST_SYMBOLS = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'AVAXUSDT',
  'DOTUSDT',
  'LINKUSDT',
  'LTCUSDT',
  'ATOMUSDT',
  'ETCUSDT',
  'XLMUSDT',
  'TRXUSDT',
  'NEARUSDT',
  'ARBUSDT',
  'OPUSDT',
  'UNIUSDT',
  'APTUSDT'
] as const
