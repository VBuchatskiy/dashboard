/** Binance spot symbol: uppercase alphanumeric, length 4–32 (e.g. BTCUSDT). */
export const BINANCE_SYMBOL_PATTERN = /^[A-Z0-9]{4,32}$/

export function isValidBinanceSymbol(symbol: string): boolean {
  const trimmed = symbol.trim()
  return BINANCE_SYMBOL_PATTERN.test(trimmed)
}
