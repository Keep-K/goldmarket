import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router-dom'

export function FranchisePage() {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">가맹</h1>
          <p className="section__desc">정적 섹션 + 문의 CTA</p>
          <div className="section__actions">
            <Link className="btn btn--primary" to="/support/inquiry/corporate">가맹 문의</Link>
            <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
          </div>
        </header>
        <Card>
          <div className="card__body">
            <p className="card__meta">가맹 절차/조건/FAQ 등 콘텐츠를 여기에 배치합니다.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
