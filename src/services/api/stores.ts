import { apiGet } from '@/services/api/client'
import type { Store } from '@/services/api/types'
import { mockStores } from '@/services/api/mockData'

const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK !== '0'

export async function getStores(params: { region?: string; q?: string; signal?: AbortSignal }): Promise<Store[]> {
  if (USE_MOCK) {
    let items = mockStores(params.region)
    if (params.q) {
      const q = params.q.toLowerCase()
      items = items.filter((s) => `${s.name} ${s.address}`.toLowerCase().includes(q))
    }
    return items
  }
  return apiGet<Store[]>('/api/stores', { region: params.region, q: params.q ?? '' }, params.signal)
}
