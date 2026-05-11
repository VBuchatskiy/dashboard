import { MAX_MARKET_SYMBOLS } from '~/utils/market/parseSymbolsParam'

/** Max symbols per browser connection (same order of magnitude as REST batch). */
export const WS_MARKET_SYMBOLS_PER_CLIENT = MAX_MARKET_SYMBOLS

/** Binance allows many streams per combined connection; keep shards smaller for stability. */
export const WS_MARKET_SYMBOLS_PER_UPSTREAM_SHARD = 200

/** Global cap on outbound Binance WebSocket connections from this process. */
export const WS_MARKET_MAX_UPSTREAM_SHARDS = 5

export const WS_MARKET_MAX_DISTINCT_SYMBOLS =
  WS_MARKET_SYMBOLS_PER_UPSTREAM_SHARD * WS_MARKET_MAX_UPSTREAM_SHARDS
