import { apiGet } from '@/services/api/client'
import type { News } from '@/services/api/types'
import { mockNews } from '@/services/api/mockData'

const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK !== '0'

export async function getNews(params: { page?: number; q?: string; category?: string; signal?: AbortSignal }): Promise<{ items: News[]; total: number }> {
  if (USE_MOCK) {
    let items = mockNews()
    if (params.category) items = items.filter((n) => n.category === params.category)
    if (params.q) {
      const q = params.q.toLowerCase()
      items = items.filter((n) => `${n.title} ${n.summary ?? ''}`.toLowerCase().includes(q))
    }
    const pageSize = 9
    const page = Math.max(1, params.page ?? 1)
    const total = items.length
    const start = (page - 1) * pageSize
    return { items: items.slice(start, start + pageSize), total }
  }
  return apiGet<{ items: News[]; total: number }>(
    '/api/news',
    { category: params.category, page: params.page ?? 1, q: params.q ?? '' },
    params.signal
  )
}

export async function getNewsById(params: { id: string; signal?: AbortSignal }): Promise<News> {
  if (USE_MOCK) {
    const found = mockNews().find((n) => n.id === params.id)
    if (!found) throw new Error('not found')
    return found
  }
  return apiGet<News>(`/api/news/${encodeURIComponent(params.id)}`, undefined, params.signal)
}
