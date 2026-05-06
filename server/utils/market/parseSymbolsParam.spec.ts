import { describe, it, expect } from 'vitest'
import {
  MAX_MARKET_SYMBOLS,
  parseCommaSeparatedSymbols
} from '~/utils/market/parseSymbolsParam'

describe('parseCommaSeparatedSymbols', () => {
  it('returns empty for missing or blank input', () => {
    expect(parseCommaSeparatedSymbols(undefined)).toEqual([])
    expect(parseCommaSeparatedSymbols('')).toEqual([])
    expect(parseCommaSeparatedSymbols('  ,  ,')).toEqual([])
  })

  it('trims and preserves first-seen order', () => {
    expect(parseCommaSeparatedSymbols(' BTCUSDT , ETHUSDT ')).toEqual([
      'BTCUSDT',
      'ETHUSDT'
    ])
  })

  it('dedupes repeats', () => {
    expect(parseCommaSeparatedSymbols('BTCUSDT,ETHUSDT,BTCUSDT')).toEqual([
      'BTCUSDT',
      'ETHUSDT'
    ])
  })
})

describe('MAX_MARKET_SYMBOLS', () => {
  it('is a positive cap for batch routes', () => {
    expect(MAX_MARKET_SYMBOLS).toBeGreaterThan(0)
    expect(MAX_MARKET_SYMBOLS).toBeLessThanOrEqual(100)
  })
})
