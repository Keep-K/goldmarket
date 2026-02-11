import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Link } from 'react-router-dom'

export function RefiningPage() {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">정련 (FTC)</h1>
          <p className="section__desc">정적 섹션 템플릿으로 구성 예정</p>
        </header>

        <Card>
          <div className="card__body">
            <h3 className="card__title">상담 안내</h3>
            <p className="card__meta">정련 관련 문의는 고객센터로 연결됩니다.</p>
            <div className="card__actions">
              <Link className="btn btn--primary" to="/support/inquiry/corporate">문의하기</Link>
              <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
              <Link className="btn btn--ghost" to="/stores">가맹점 찾기</Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
