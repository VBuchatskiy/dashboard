import WebSocket from 'ws'

import type { MarketPrice } from '@/features/market/types'
import { normalizeBinanceCombinedMiniTickerMessage } from '~/utils/binance/normalizeBinanceMiniTicker'
import { resolveBinanceWsBaseUrl } from '~/utils/binance/resolveBinanceWsBaseUrl'
import {
  WS_MARKET_MAX_DISTINCT_SYMBOLS,
  WS_MARKET_MAX_UPSTREAM_SHARDS,
  WS_MARKET_SYMBOLS_PER_UPSTREAM_SHARD
} from '~/utils/market/wsMarketLimits'

type Listener = {
  symbols: Set<string>
  onPrice: (row: MarketPrice) => void
  onIssue?: (message: string) => void
}

const listeners = new Map<string, Listener>()

type Shard = {
  /** When true, `close` events must not schedule reconnect (full hub teardown). */
  disposed: boolean
  streamNames: string[]
  ws: WebSocket | null
  reconnectTimer: ReturnType<typeof setTimeout> | null
  backoffMs: number
}

const shards: Shard[] = []

function getUnionSorted(): string[] {
  const u = new Set<string>()
  for (const l of listeners.values()) {
    for (const s of l.symbols) u.add(s)
  }
  return [...u].sort()
}

function chunkSymbols(sorted: string[]): string[][] {
  const out: string[][] = []
  for (let i = 0; i < sorted.length; i += WS_MARKET_SYMBOLS_PER_UPSTREAM_SHARD) {
    out.push(sorted.slice(i, i + WS_MARKET_SYMBOLS_PER_UPSTREAM_SHARD))
  }
  return out
}

function toStreamNames(chunk: string[]): string[] {
  return chunk.map((s) => `${s.toLowerCase()}@miniTicker`)
}

function buildCombinedUrl(streamNames: string[]): string {
  const base = resolveBinanceWsBaseUrl().replace(/\/+$/, '')
  return `${base}/stream?streams=${streamNames.join('/')}`
}

function broadcastPrice(row: MarketPrice) {
  for (const { symbols, onPrice } of listeners.values()) {
    if (symbols.has(row.symbol)) onPrice(row)
  }
}

function notifyUpstreamIssue(message: string) {
  for (const { onIssue } of listeners.values()) {
    onIssue?.(message)
  }
}

function destroyShard(shard: Shard) {
  shard.disposed = true
  if (shard.reconnectTimer) {
    clearTimeout(shard.reconnectTimer)
    shard.reconnectTimer = null
  }
  if (shard.ws) {
    shard.ws.removeAllListeners()
    if (
      shard.ws.readyState === WebSocket.OPEN ||
      shard.ws.readyState === WebSocket.CONNECTING
    ) {
      shard.ws.close()
    }
    shard.ws = null
  }
}

function destroyAllShards() {
  for (const s of shards) destroyShard(s)
  shards.length = 0
}

function scheduleShardReconnect(shard: Shard) {
  if (shard.reconnectTimer) return
  const delay = Math.min(shard.backoffMs, 30_000)
  shard.reconnectTimer = setTimeout(() => {
    shard.reconnectTimer = null
    shard.backoffMs = Math.min(shard.backoffMs * 2, 30_000)
    openShard(shard)
  }, delay)
}

function openShard(shard: Shard) {
  if (shard.streamNames.length === 0) return
  destroyShard(shard)
  shard.disposed = false
  const url = buildCombinedUrl(shard.streamNames)
  const ws = new WebSocket(url)
  shard.ws = ws

  ws.on('open', () => {
    shard.backoffMs = 1000
  })

  ws.on('message', (data) => {
    const raw = typeof data === 'string' ? data : data.toString('utf8')
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return
    }
    if (
      parsed &&
      typeof parsed === 'object' &&
      'ping' in parsed &&
      typeof (parsed as { ping?: unknown }).ping === 'number'
    ) {
      ws.send(
        JSON.stringify({ pong: (parsed as { ping: number }).ping })
      )
      return
    }
    const row = normalizeBinanceCombinedMiniTickerMessage(raw)
    if (row) broadcastPrice(row)
  })

  ws.on('close', () => {
    shard.ws = null
    if (shard.disposed || listeners.size === 0) return
    notifyUpstreamIssue('Binance stream disconnected; reconnecting')
    scheduleShardReconnect(shard)
  })

  ws.on('error', () => {
    if (!shard.disposed) notifyUpstreamIssue('Binance stream error')
  })
}

function sameShardPlan(next: string[][], prev: Shard[]): boolean {
  if (next.length !== prev.length) return false
  for (let i = 0; i < next.length; i++) {
    const a = next[i]!.join('/')
    const b = prev[i]!.streamNames
      .map((n) => n.replace(/@miniTicker$/i, '').toUpperCase())
      .sort()
      .join('/')
    if (a !== b) return false
  }
  return true
}

function shardsHealthy(): boolean {
  return (
    shards.length > 0 &&
    shards.every((s) => s.ws?.readyState === WebSocket.OPEN)
  )
}

function syncUpstreamSockets() {
  const union = getUnionSorted()
  if (union.length === 0) {
    destroyAllShards()
    return
  }

  const plan = chunkSymbols(union)
  if (plan.length > WS_MARKET_MAX_UPSTREAM_SHARDS) {
    return
  }

  if (sameShardPlan(plan, shards) && shardsHealthy()) return

  destroyAllShards()
  for (const chunk of plan) {
    const streamNames = toStreamNames(chunk)
    const shard: Shard = {
      disposed: false,
      streamNames,
      ws: null,
      reconnectTimer: null,
      backoffMs: 1000
    }
    shards.push(shard)
    openShard(shard)
  }
}

function unionSizeIfClientSymbolsWere(
  clientId: string,
  next: Set<string>
): number {
  const u = new Set<string>()
  for (const [id, l] of listeners) {
    if (id === clientId) continue
    for (const s of l.symbols) u.add(s)
  }
  for (const s of next) u.add(s)
  return u.size
}

export type MarketStreamSubscribeResult =
  | { ok: true }
  | { ok: false; error: string }

export const marketStreamHub = {
  subscribe(
    clientId: string,
    symbols: string[],
    onPrice: (row: MarketPrice) => void,
    onIssue?: (message: string) => void
  ): MarketStreamSubscribeResult {
    const next = new Set(symbols)
    const union = unionSizeIfClientSymbolsWere(clientId, next)
    if (union > WS_MARKET_MAX_DISTINCT_SYMBOLS) {
      return {
        ok: false,
        error: `Too many distinct symbols across connections (max ${WS_MARKET_MAX_DISTINCT_SYMBOLS})`
      }
    }

    listeners.set(clientId, { symbols: next, onPrice, onIssue })
    syncUpstreamSockets()
    return { ok: true }
  },

  unsubscribe(clientId: string) {
    listeners.delete(clientId)
    syncUpstreamSockets()
  }
}
