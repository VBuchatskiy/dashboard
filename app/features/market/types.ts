export type MarketTicker24h = {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  quoteVolume: string
  highPrice: string
  lowPrice: string
}

export type MarketBookTicker = {
  symbol: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
}

/** Current price from Binance ticker/price (REST snapshot; WS can update same shape later). */
export type MarketPrice = {
  symbol: string
  price: string
}
