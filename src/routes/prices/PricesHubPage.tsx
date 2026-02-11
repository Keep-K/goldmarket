import { Link } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'

const LINKS = [
  { to: '/prices/gold', label: '금' },
  { to: '/prices/silver', label: '은' },
  { to: '/prices/platinum', label: '백금' },
  { to: '/prices/benchmark', label: '국제/지표' },
  { to: '/prices/live', label: '실시간' },
  { to: '/prices/diamond', label: '다이아' },
  { to: '/prices/lab-diamond', label: '랩다이아' },
  { to: '/prices/securities', label: '증권/ETF' }
]

export function PricesHubPage() {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">시세조회</h1>
          <p className="section__desc">PriceTemplate 구현 전까지는 라우트/레이아웃만 고정합니다.</p>
        </header>
        <div className="grid grid--4">
          {LINKS.map((x) => (
            <Card key={x.to}>
              <div className="card__body">
                <h3 className="card__title">{x.label}</h3>
                <p className="card__meta">차트+테이블 템플릿 예정</p>
                <div className="card__actions">
                  <Link className="btn btn--ghost" to={x.to}>
                    보기
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
