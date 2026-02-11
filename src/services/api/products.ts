import { apiGet } from '@/services/api/client'
import type { Product } from '@/services/api/types'
import { mockProducts } from '@/services/api/mockData'

const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK !== '0'

export type ProductSort = 'updated_desc' | 'name_asc'

export async function getProducts(params: {
  category?: string
  q?: string
  page?: number
  pageSize?: number
  sort?: ProductSort
  signal?: AbortSignal
}): Promise<{ items: Product[]; total: number }> {
  if (USE_MOCK) {
    let items = mockProducts(params.category)
    if (params.q) {
      const q = params.q.toLowerCase()
      items = items.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (params.sort === 'name_asc') items = [...items].sort((a, b) => a.name.localeCompare(b.name))
    else items = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

    const pageSize = params.pageSize ?? 12
    const page = Math.max(1, params.page ?? 1)
    const total = items.length
    const start = (page - 1) * pageSize
    return { items: items.slice(start, start + pageSize), total }
  }

  return apiGet<{ items: Product[]; total: number }>(
    '/api/products',
    {
      category: params.category,
      q: params.q ?? '',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
      sort: params.sort ?? 'updated_desc'
    },
    params.signal
  )
}

export async function getProductById(params: { id: string; signal?: AbortSignal }): Promise<Product> {
  if (USE_MOCK) {
    const all = mockProducts()
    const found = all.find((p) => p.id === params.id)
    if (!found) throw new Error('not found')
    return found
  }
  return apiGet<Product>(`/api/products/${encodeURIComponent(params.id)}`, undefined, params.signal)
}
