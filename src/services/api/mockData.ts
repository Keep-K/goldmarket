import type { News, PricePoint, Product, SpotQuote, Store } from '@/services/api/types'

function isoNow() {
  return new Date().toISOString()
}

function seededRand(seed: number) {
  let x = Math.sin(seed) * 10000
  return () => {
    x = Math.sin(x) * 10000
    return x - Math.floor(x)
  }
}

export function mockSpot(symbols: string[]): SpotQuote[] {
  const now = isoNow()
  return symbols.map((s, idx) => {
    const r = seededRand(idx + s.length)
    const base = s === 'gold' ? 98000 : s === 'silver' ? 1200 : s === 'platinum' ? 42000 : 10000
    const jitter = (r() - 0.5) * base * 0.015
    const price = Math.max(1, Math.round(base + jitter))
    const change = Math.round(((r() - 0.5) * base * 0.006) * 10) / 10
    const changePct = Math.round((change / price) * 1000) / 10
    return {
      symbol: s,
      price,
      buy: Math.round(price * 0.998),
      sell: Math.round(price * 1.002),
      unit: s === 'silver' ? 'g' : 'g',
      currency: 'KRW',
      change,
      changePct,
      updatedAt: now,
      source: 'mock'
    }
  })
}

export function mockHistory(symbol: string, range: string): PricePoint[] {
  const points = range === '5m' ? 120 : range === '1y' ? 260 : range === '3y' ? 520 : range === '5y' ? 780 : 900
  const seed = symbol.length * 31 + range.length * 17
  const r = seededRand(seed)
  const base = symbol === 'gold' ? 98000 : symbol === 'silver' ? 1200 : symbol === 'platinum' ? 42000 : 10000

  let v = base
  const out: PricePoint[] = []
  const now = Date.now()
  const step = range === '5m' ? 60 * 1000 : 24 * 60 * 60 * 1000

  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now - i * step)
    const drift = (r() - 0.5) * base * (range === '5m' ? 0.0008 : 0.003)
    v = Math.max(1, v + drift)
    const o = v + (r() - 0.5) * base * 0.001
    const c = v + (r() - 0.5) * base * 0.001
    const hi = Math.max(o, c) + r() * base * 0.002
    const lo = Math.min(o, c) - r() * base * 0.002
    out.push({
      t: t.toISOString(),
      open: Math.round(o * 10) / 10,
      high: Math.round(hi * 10) / 10,
      low: Math.round(lo * 10) / 10,
      close: Math.round(c * 10) / 10
    })
  }
  return out
}

export function mockProducts(category?: string): Product[] {
  const now = isoNow()
  const cats = ['gold-bar', 'silver-bar', 'coins', 'gifts', 'diamond']
  const selected = category ? [category] : cats
  const out: Product[] = []
  let idx = 1
  for (const c of selected) {
    for (let i = 0; i < 24; i++) {
      const id = `${c}-${String(idx).padStart(4, '0')}`
      out.push({
        id,
        name: `${c} 샘플 ${i + 1}`,
        category: c,
        subCategory: i % 3 === 0 ? 'standard' : i % 3 === 1 ? 'premium' : 'limited',
        priceLabel: c === 'diamond' ? '상담 후 안내' : `${(i + 1) * 10}만원대`,
        soldOut: i % 11 === 0,
        weight: c === 'diamond' ? undefined : `${(i % 5) + 1}g`,
        purity: c === 'diamond' ? undefined : '999.9',
        brand: 'KoreaGoldX',
        images: [
          `/assets/mock/products/p-${String((idx % 30) + 1).padStart(4, '0')}.jpg`
        ],
        specs: {
          카테고리: c,
          규격: c === 'diamond' ? '상담 안내' : '표준 규격',
          안내: '결제 기능 없이 상담으로 안내합니다.'
        },
        updatedAt: now
      })
      idx++
    }
  }
  return out
}

export function mockStores(region?: string): Store[] {
  const regions = ['seoul', 'gyeonggi', 'incheon', 'busan', 'daegu', 'daejeon', 'gwangju']
  const list = Array.from({ length: 18 }).map((_, i) => {
    const r = regions[i % regions.length]
    return {
      id: `s-${String(i + 1).padStart(3, '0')}`,
      name: `KoreaGoldX ${r.toUpperCase()} ${i + 1}`,
      region: r,
      address: `${r} 샘플로 ${i + 1} (예시 주소)`,
      phone: '02-0000-0000',
      hours: '10:00-19:00'
    }
  })
  return region ? list.filter((x) => x.region === region) : list
}

export function mockNews(): News[] {
  const now = new Date()
  return Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000)
    const id = `n-${String(i + 1).padStart(4, '0')}`
    return {
      id,
      category: i % 2 === 0 ? 'domestic' : 'global',
      title: `샘플 뉴스 타이틀 ${i + 1}`,
      summary: '요약 문구가 들어갑니다. (fixture)',
      publishedAt: d.toISOString(),
      contentHtml:
        `<p>이 영역은 <strong>HTML</strong> 기반 렌더링 테스트용입니다.</p>` +
        `<p>결제 기능 없이, 시세/상품 안내 및 상담 연결을 제공합니다.</p>`
    }
  })
}
