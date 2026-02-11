import { Link } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNews } from '@/services/api/news'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/ui/States'

export function NewsListPage() {
  const [q, setQ] = React.useState('')
  const [page, setPage] = React.useState(1)

  const query = useQuery({
    queryKey: ['news', q, page],
    queryFn: ({ signal }) => getNews({ q: q || undefined, page, signal })
  })

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">뉴스</h1>
          <p className="section__desc">리스트/상세 (HTML render + related)</p>
        </header>

        <Card>
          <div className="card__body" style={{ gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <label style={{ flex: 1, minWidth: 240 }}>
                <span className="srOnly">검색</span>
                <input
                  className="input"
                  placeholder="뉴스 검색"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value)
                    setPage(1)
                  }}
                />
              </label>
              <button className="btn btn--ghost" type="button" onClick={() => { setQ(''); setPage(1) }}>
                초기화
              </button>
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 16 }}>
          {query.isLoading ? (
            <LoadingBlock title="뉴스를 불러오는 중…" />
          ) : query.isError ? (
            <ErrorBlock title="뉴스를 불러오지 못했습니다" onRetry={() => query.refetch()} />
          ) : (query.data?.items.length ?? 0) === 0 ? (
            <EmptyBlock title="뉴스가 없습니다" />
          ) : (
            <>
              <div className="grid grid--3">
                {query.data!.items.map((n) => (
                  <Card key={n.id}>
                    <div className="card__body">
                      <h3 className="card__title">{n.title}</h3>
                      <p className="card__meta">
                        <Badge>{n.category}</Badge> · {new Date(n.publishedAt).toLocaleDateString('ko-KR')}
                      </p>
                      {n.summary ? <p className="card__meta">{n.summary}</p> : null}
                      <div className="card__actions">
                        <Link className="btn btn--ghost" to={`/news/${encodeURIComponent(n.id)}`}>
                          자세히
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Pagination page={page} pageSize={9} total={query.data!.total} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
