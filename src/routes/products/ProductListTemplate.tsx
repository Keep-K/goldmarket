import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/ui/States'
import { getProducts } from '@/services/api/products'

type ProductSort = 'updated_desc' | 'name_asc'

function getNumber(v: string | null, fallback: number) {
  const n = v ? Number(v) : NaN
  return Number.isFinite(n) ? n : fallback
}

export function ProductListTemplate({ category }: { category?: string }) {
  const [sp, setSp] = useSearchParams()
  const q = sp.get('q') ?? ''
  const sort = (sp.get('sort') as ProductSort) ?? 'updated_desc'
  const pageSize = Math.min(24, Math.max(6, getNumber(sp.get('pageSize'), 12)))
  const page = Math.max(1, getNumber(sp.get('page'), 1))

  const query = useQuery({
    queryKey: ['products', category ?? 'all', q, sort, page, pageSize],
    queryFn: ({ signal }) => getProducts({ category, q: q || undefined, sort, page, pageSize, signal })
  })

  const total = query.data?.total ?? 0
  const items = query.data?.items ?? []

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(sp)
    if (!v) next.delete(k)
    else next.set(k, v)
    if (k !== 'page') next.set('page', '1')
    setSp(next)
  }

  const reset = () => {
    const next = new URLSearchParams()
    setSp(next)
  }

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">상품</h1>
          <p className="section__desc">결제 기능 없이, 상품 정보 안내 및 상담 연결을 제공합니다.</p>
        </header>

        <Card>
          <div className="card__body" style={{ gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                <label style={{ flex: 1, minWidth: 220 }}>
                  <span className="srOnly">검색</span>
                  <input
                    className="input"
                    placeholder="검색어 (상품명)"
                    value={q}
                    onChange={(e) => setParam('q', e.target.value)}
                  />
                </label>

                <label className="muted" style={{ fontSize: 14 }}>
                  정렬
                  <select
                    className="input"
                    style={{ width: 170, marginLeft: 8, padding: '10px 10px' }}
                    value={sort}
                    onChange={(e) => setParam('sort', e.target.value)}
                  >
                    <option value="updated_desc">최신순</option>
                    <option value="name_asc">이름순</option>
                  </select>
                </label>

                <label className="muted" style={{ fontSize: 14 }}>
                  보기
                  <select
                    className="input"
                    style={{ width: 120, marginLeft: 8, padding: '10px 10px' }}
                    value={String(pageSize)}
                    onChange={(e) => setParam('pageSize', e.target.value)}
                  >
                    <option value="6">6개</option>
                    <option value="12">12개</option>
                    <option value="18">18개</option>
                    <option value="24">24개</option>
                  </select>
                </label>
              </div>

              <button className="btn btn--ghost" type="button" onClick={reset}>
                초기화
              </button>
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              카테고리: <Badge>{category ?? 'all'}</Badge>
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 16 }}>
          {query.isLoading ? (
            <LoadingBlock title="상품을 불러오는 중…" />
          ) : query.isError ? (
            <ErrorBlock title="상품 목록을 불러오지 못했습니다" onRetry={() => query.refetch()} />
          ) : items.length === 0 ? (
            <EmptyBlock
              title="조건에 맞는 상품이 없습니다"
              action={
                <button className="btn btn--primary" type="button" onClick={reset}>
                  필터 초기화
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid--3">
                {items.map((p) => (
                  <Card key={p.id}>
                    <div className="card__body">
                      <div
                        style={{
                          height: 150,
                          borderRadius: 14,
                          border: '1px solid var(--border)',
                          background:
                            'radial-gradient(800px 220px at 20% 0%, rgba(214,177,94,.18), transparent 60%), radial-gradient(600px 200px at 90% 0%, rgba(111,177,255,.14), transparent 55%), rgba(11,18,32,.02)'
                        }}
                        aria-label={`이미지 슬롯: ${p.images[0]}`}
                        role="img"
                      />

                      <h3 className="card__title">{p.name}</h3>
                      <p className="card__meta">
                        <Badge>{p.priceLabel}</Badge>
                        {p.soldOut ? <Badge>품절/중단</Badge> : <Badge>안내중</Badge>}
                        {p.weight ? <Badge>{p.weight}</Badge> : null}
                      </p>

                      <div className="card__actions">
                        <Link className="btn btn--ghost" to={`/products/${encodeURIComponent(p.id)}`}>
                          상세보기
                        </Link>
                        <Link className="btn btn--primary" to="/support/inquiry/product">
                          문의하기
                        </Link>
                        <Link className="btn btn--ghost" to="/stores">
                          가맹점 찾기
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={(p) => setParam('page', String(p))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
