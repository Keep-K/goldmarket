import { apiGet } from '@/services/api/client'
import type { PricePoint, SpotQuote } from '@/services/api/types'
import { mockHistory, mockSpot } from '@/services/api/mockData'

const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK !== '0'

export async function getSpotQuotes(params: {
  symbols: string[]
  currency?: string
  signal?: AbortSignal
}): Promise<SpotQuote[]> {
  if (USE_MOCK) return mockSpot(params.symbols)
  return apiGet<SpotQuote[]>('/api/prices/spot', { symbols: params.symbols.join(','), currency: params.currency ?? 'KRW' }, params.signal)
}

export async function getPriceHistory(params: {
  symbol: string
  range: string
  interval?: string
  signal?: AbortSignal
}): Promise<PricePoint[]> {
  if (USE_MOCK) return mockHistory(params.symbol, params.range)
  return apiGet<PricePoint[]>('/api/prices/history', { symbol: params.symbol, range: params.range, interval: params.interval ?? '1d' }, params.signal)
}
