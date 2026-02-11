import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router-dom'

export function CareersPage() {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">채용</h1>
          <p className="section__desc">정적 페이지 템플릿 예정</p>
          <div className="section__actions">
            <Link className="btn btn--primary" to="/support/inquiry/corporate">채용 문의</Link>
          </div>
        </header>
        <Card>
          <div className="card__body">
            <p className="card__meta">공고/복지/지원 방법 등을 여기에 구성합니다.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
