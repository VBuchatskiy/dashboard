const DEFAULT_BINANCE_REST_URL = 'https://api.binance.com'

export function getBinanceRestBaseUrl(): string {
  const fromEnv = process.env.BINANCE_REST_URL?.trim()
  return fromEnv || DEFAULT_BINANCE_REST_URL
}

export type BinanceGetOptions = {
  baseUrl?: string
  fetch?: typeof fetch
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Public GET to Binance REST. Does not sign requests.
 * Optional `fetch` is for tests; defaults to `globalThis.fetch`.
 */
export async function binanceGet<T = unknown>(
  path: string,
  searchParams?: Record<string, string | undefined> | URLSearchParams,
  options?: BinanceGetOptions
): Promise<T> {
  const baseUrl = options?.baseUrl ?? getBinanceRestBaseUrl()
  const url = new URL(normalizePath(path), baseUrl)
  if (searchParams instanceof URLSearchParams) {
    for (const [key, value] of searchParams) {
      url.searchParams.append(key, value)
    }
  } else if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, value)
      }
    }
  }
  const fetchFn = options?.fetch ?? globalThis.fetch
  const res = await fetchFn(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' }
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Binance HTTP ${res.status}: ${body.slice(0, 500)}`)
  }
  return res.json() as Promise<T>
}
