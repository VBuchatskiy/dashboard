import { defineWebSocketHandler } from 'h3'

import { marketStreamHub } from '~/utils/binance/binanceStreamHub'
import { isValidBinanceSymbol } from '~/utils/binance/symbol'
import { MAX_MARKET_SYMBOLS } from '~/utils/market/parseSymbolsParam'

function parseSubscribeSymbols(symbols: unknown):
  | { ok: true; symbols: string[] }
  | { ok: false; error: string } {
  if (!Array.isArray(symbols)) {
    return { ok: false, error: 'symbols must be an array' }
  }
  if (symbols.length > MAX_MARKET_SYMBOLS) {
    return {
      ok: false,
      error: `Too many symbols (max ${MAX_MARKET_SYMBOLS})`
    }
  }
  const out: string[] = []
  const seen = new Set<string>()
  for (const x of symbols) {
    if (typeof x !== 'string') {
      return { ok: false, error: 'Each symbol must be a string' }
    }
    const upper = x.trim().toUpperCase()
    if (!upper || seen.has(upper)) continue
    if (!isValidBinanceSymbol(upper)) {
      return { ok: false, error: 'Invalid symbol in list' }
    }
    seen.add(upper)
    out.push(upper)
  }
  return { ok: true, symbols: out }
}

export default defineWebSocketHandler({
  open(peer) {
    peer.send({ type: 'hello', ok: true })
  },

  message(peer, message) {
    let body: unknown
    try {
      body = message.json()
    } catch {
      peer.send({ type: 'error', message: 'Invalid JSON' })
      return
    }

    if (!body || typeof body !== 'object') {
      peer.send({ type: 'error', message: 'Message must be a JSON object' })
      return
    }

    const rec = body as { type?: unknown }
    const t = rec.type

    if (t === 'ping') {
      peer.send({ type: 'pong' })
      return
    }

    if (t === 'subscribe') {
      const parsed = parseSubscribeSymbols(
        (body as { symbols?: unknown }).symbols
      )
      if (!parsed.ok) {
        peer.send({ type: 'error', message: parsed.error })
        return
      }

      const result = marketStreamHub.subscribe(
        peer.id,
        parsed.symbols,
        (row) => {
          peer.send({ type: 'price', data: row })
        },
        (issue) => {
          peer.send({ type: 'error', message: issue })
        }
      )

      if (!result.ok) {
        peer.send({ type: 'error', message: result.error })
        return
      }

      peer.send({ type: 'subscribed', symbols: parsed.symbols })
      return
    }

    peer.send({
      type: 'error',
      message: `Unknown message type: ${String(t)}`
    })
  },

  close(peer) {
    marketStreamHub.unsubscribe(peer.id)
  }
})
