import { apiGet } from '@/services/api/client'

const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK !== '0'

export type Notice = {
  id: string
  title: string
  publishedAt: string
  contentHtml: string
}

export type FaqItem = {
  id: string
  category: string
  q: string
  a: string
}

function mockNotices(): Notice[] {
  const now = new Date()
  return Array.from({ length: 18 }).map((_, i) => {
    const d = new Date(now.getTime() - i * 5 * 24 * 60 * 60 * 1000)
    return {
      id: String(i + 1),
      title: `공지사항 샘플 ${i + 1}`,
      publishedAt: d.toISOString(),
      contentHtml:
        `<p>공지사항 콘텐츠 영역입니다. (fixture)</p>` +
        `<p>결제 기능 없이 안내/상담용으로 운영됩니다.</p>`
    }
  })
}

function mockFaq(): FaqItem[] {
  return [
    {
      id: 'f-001',
      category: 'general',
      q: '결제/주문 기능이 있나요?',
      a: '아니요. 본 사이트는 상품/시세 안내 및 상담 연결을 제공합니다.'
    },
    {
      id: 'f-002',
      category: 'prices',
      q: '시세는 어디서 가져오나요?',
      a: '외부 공급처 데이터를 중계 서버에서 표준화/캐시하여 제공하는 구조를 권장합니다. (현재는 mock 데이터 포함)'
    },
    {
      id: 'f-003',
      category: 'stores',
      q: '가맹점은 어떻게 찾나요?',
      a: '가맹점 찾기 페이지에서 지역/검색 조건으로 조회 후 전화 또는 지도 링크로 이동할 수 있습니다.'
    },
    {
      id: 'f-004',
      category: 'product',
      q: '상품 문의는 어디서 하나요?',
      a: '고객센터 > 문의하기에서 상품 문의 유형을 선택해 접수할 수 있습니다.'
    }
  ]
}

export async function getNotices(params: { page?: number; q?: string; signal?: AbortSignal }): Promise<{ items: Notice[]; total: number }> {
  if (USE_MOCK) {
    let items = mockNotices()
    if (params.q) {
      const q = params.q.toLowerCase()
      items = items.filter((n) => n.title.toLowerCase().includes(q))
    }
    const pageSize = 10
    const page = Math.max(1, params.page ?? 1)
    const total = items.length
    const start = (page - 1) * pageSize
    return { items: items.slice(start, start + pageSize), total }
  }

  return apiGet<{ items: Notice[]; total: number }>(
    '/api/notices',
    { page: params.page ?? 1, q: params.q ?? '' },
    params.signal
  )
}

export async function getNoticeById(params: { id: string; signal?: AbortSignal }): Promise<Notice> {
  if (USE_MOCK) {
    const found = mockNotices().find((n) => n.id === params.id)
    if (!found) throw new Error('not found')
    return found
  }
  return apiGet<Notice>(`/api/notices/${encodeURIComponent(params.id)}`, undefined, params.signal)
}

export async function getFaq(params: { q?: string; signal?: AbortSignal }): Promise<FaqItem[]> {
  if (USE_MOCK) {
    let items = mockFaq()
    if (params.q) {
      const q = params.q.toLowerCase()
      items = items.filter((x) => `${x.q} ${x.a}`.toLowerCase().includes(q))
    }
    return items
  }
  return apiGet<FaqItem[]>('/api/faq', { q: params.q ?? '' }, params.signal)
}
