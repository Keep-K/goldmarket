import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { LoadingBlock, ErrorBlock } from '@/components/ui/States'
import { getProductById } from '@/services/api/products'

export function ProductDetailTemplate({ id }: { id: string }) {
  const q = useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProductById({ id, signal })
  })
  const [zoomOpen, setZoomOpen] = React.useState(false)

  if (q.isLoading) {
    return (
      <section className="section">
        <div className="container">
          <header className="section__head">
            <Breadcrumb />
            <h1 className="section__title">상품 상세</h1>
          </header>
          <LoadingBlock title="상품 정보를 불러오는 중…" />
        </div>
      </section>
    )
  }

  if (q.isError || !q.data) {
    return (
      <section className="section">
        <div className="container">
          <header className="section__head">
            <Breadcrumb />
            <h1 className="section__title">상품 상세</h1>
          </header>
          <ErrorBlock title="상품 정보를 불러오지 못했습니다" onRetry={() => q.refetch()} />
        </div>
      </section>
    )
  }

  const p = q.data

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">{p.name}</h1>
          <p className="section__desc">
            <Badge>{p.category}</Badge> <Badge>{p.priceLabel}</Badge> {p.soldOut ? <Badge>품절/중단</Badge> : <Badge>안내중</Badge>}
          </p>
          <div className="section__actions">
            <Link className="btn btn--primary" to="/support/inquiry/product">문의하기</Link>
            <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
            <Link className="btn btn--ghost" to="/stores">가맹점 찾기</Link>
          </div>
        </header>

        <div className="grid grid--2">
          <Card>
            <div className="card__body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div className="card__title">갤러리</div>
                  <div className="card__meta">이미지 슬롯: {p.images[0]}</div>
                </div>
                <button className="btn btn--ghost btn--sm" type="button" onClick={() => setZoomOpen(true)}>
                  확대
                </button>
              </div>

              <div
                style={{
                  height: 320,
                  borderRadius: 14,
                  border: '1px solid var(--border)',
                  background:
                    'radial-gradient(900px 260px at 20% 0%, rgba(214,177,94,.20), transparent 60%), radial-gradient(700px 240px at 90% 0%, rgba(111,177,255,.16), transparent 55%), rgba(11,18,32,.02)'
                }}
                role="img"
                aria-label={`이미지 슬롯: ${p.images[0]}`}
              />
            </div>
          </Card>

          <div style={{ display: 'grid', gap: 16 }}>
            <Card>
              <div className="card__body">
                <div className="card__title">스펙</div>
                <div className="card__meta">간단 스펙 테이블</div>
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 14 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(p.specs).map(([k, v]) => (
                        <tr key={k}>
                          <td style={{ padding: 12, borderBottom: '1px solid var(--border)', color: 'var(--muted)', width: 140 }}>
                            {k}
                          </td>
                          <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card>
              <div className="card__body" style={{ position: 'sticky', top: 92 }}>
                <div className="card__title">상담 연결</div>
                <p className="card__meta">결제 기능 없이, 상담으로 안내합니다.</p>
                <div className="card__actions">
                  <Link className="btn btn--primary" to="/support/inquiry/product">문의하기</Link>
                  <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
                  <Link className="btn btn--ghost" to="/stores">가맹점 찾기</Link>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <Tabs
            items={[
              {
                id: 'detail',
                label: '상세',
                content: <p className="muted" style={{ margin: 0 }}>상세 설명은 추후 HTML/MD 또는 CMS로 연결합니다.</p>
              },
              {
                id: 'guide',
                label: '구매방법',
                content: (
                  <p className="muted" style={{ margin: 0 }}>
                    결제/주문 기능은 제공하지 않습니다. 문의/전화/가맹점 방문으로 안내받을 수 있습니다.
                  </p>
                )
              },
              {
                id: 'shipping',
                label: '배송',
                content: <p className="muted" style={{ margin: 0 }}>배송/수령 안내 템플릿 예정</p>
              },
              {
                id: 'exchange',
                label: '교환',
                content: <p className="muted" style={{ margin: 0 }}>교환/환불 안내 템플릿 예정</p>
              },
              {
                id: 'inquiry',
                label: '문의',
                content: (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link className="btn btn--primary" to="/support/inquiry/product">문의하기</Link>
                    <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
                    <Link className="btn btn--ghost" to="/stores">가맹점 찾기</Link>
                  </div>
                )
              }
            ]}
          />
        </div>

        <Modal open={zoomOpen} onClose={() => setZoomOpen(false)} title="이미지 확대">
          <div
            style={{
              height: 420,
              borderRadius: 14,
              border: '1px solid var(--border)',
              background:
                'radial-gradient(900px 300px at 20% 0%, rgba(214,177,94,.22), transparent 60%), radial-gradient(700px 280px at 90% 0%, rgba(111,177,255,.18), transparent 55%), rgba(11,18,32,.02)'
            }}
            role="img"
            aria-label={`이미지 슬롯: ${p.images[0]}`}
          />
          <p className="muted" style={{ margin: '10px 0 0 0', fontSize: 13 }}>
            이미지 파일은 추후 `src/assets/mock/...` 슬롯을 실제 이미지로 교체합니다. (현재: {p.images[0]})
          </p>
        </Modal>
      </div>
    </section>
  )
}
