import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getFaq } from '@/services/api/support'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/ui/States'

export function FaqPage() {
  const [q, setQ] = React.useState('')
  const [openId, setOpenId] = React.useState<string | null>(null)

  const query = useQuery({
    queryKey: ['faq', q],
    queryFn: ({ signal }) => getFaq({ q: q || undefined, signal })
  })

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">FAQ</h1>
          <p className="section__desc">검색 + 아코디언</p>
        </header>

        <Card>
          <div className="card__body" style={{ gap: 12 }}>
            <label>
              <span className="srOnly">FAQ 검색</span>
              <input
                className="input"
                placeholder="FAQ 검색"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setOpenId(null)
                }}
              />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn--ghost" type="button" onClick={() => { setQ(''); setOpenId(null) }}>
                초기화
              </button>
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 16 }}>
          {query.isLoading ? (
            <LoadingBlock title="FAQ를 불러오는 중…" />
          ) : query.isError ? (
            <ErrorBlock title="FAQ를 불러오지 못했습니다" onRetry={() => query.refetch()} />
          ) : (query.data?.length ?? 0) === 0 ? (
            <EmptyBlock title="FAQ가 없습니다" />
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {query.data!.map((item) => {
                const open = item.id === openId
                return (
                  <Card key={item.id}>
                    <div className="card__body">
                      <button
                        className="btn btn--ghost"
                        type="button"
                        onClick={() => setOpenId(open ? null : item.id)}
                        aria-expanded={open}
                        aria-controls={`faq-${item.id}`}
                        style={{ justifyContent: 'space-between' }}
                      >
                        <span style={{ textAlign: 'left' }}>{item.q}</span>
                        <span className="muted">{open ? '닫기' : '열기'}</span>
                      </button>
                      {open ? (
                        <div id={`faq-${item.id}`} className="tabs__panel" style={{ marginTop: 10 }}>
                          <p className="muted" style={{ margin: 0 }}>{item.a}</p>
                        </div>
                      ) : null}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
