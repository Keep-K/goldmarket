import { Link, useSearchParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const CATS = [
  { to: '/products/gold-bar', label: '골드바', badge: 'Gold' },
  { to: '/products/silver-bar', label: '실버바', badge: 'Silver' },
  { to: '/products/coins', label: '코인', badge: 'Coins' },
  { to: '/products/gifts', label: '기념품/선물', badge: 'Gifts' },
  { to: '/products/diamond', label: '다이아', badge: 'Diamond' }
]

export function ProductsHubPage() {
  const [sp] = useSearchParams()
  const q = sp.get('q')

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">상품</h1>
          <p className="section__desc">ProductListTemplate 구현 전까지는 카테고리/상세 라우트만 고정합니다.</p>
          {q ? <p className="section__desc">검색어: {q}</p> : null}
        </header>

        <div className="grid grid--3">
          {CATS.map((c) => (
            <Card key={c.to}>
              <div className="card__body">
                <h3 className="card__title">{c.label}</h3>
                <p className="card__meta">
                  <Badge>{c.badge}</Badge>
                </p>
                <div className="card__actions">
                  <Link className="btn btn--ghost" to={c.to}>
                    리스트 보기
                  </Link>
                  <Link className="btn btn--primary" to="/support/inquiry/product">
                    문의하기
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
