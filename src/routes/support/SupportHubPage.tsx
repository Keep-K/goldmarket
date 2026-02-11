import { Link } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'

export function SupportHubPage() {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">고객센터</h1>
          <p className="section__desc">공지/FAQ/문의 폼 템플릿을 순차 구현합니다.</p>
        </header>

        <div className="grid grid--3">
          <Card>
            <div className="card__body">
              <h3 className="card__title">공지사항</h3>
              <p className="card__meta">리스트/상세</p>
              <div className="card__actions">
                <Link className="btn btn--ghost" to="/support/notice">보기</Link>
              </div>
            </div>
          </Card>
          <Card>
            <div className="card__body">
              <h3 className="card__title">FAQ</h3>
              <p className="card__meta">검색 + 아코디언</p>
              <div className="card__actions">
                <Link className="btn btn--ghost" to="/support/faq">보기</Link>
              </div>
            </div>
          </Card>
          <Card>
            <div className="card__body">
              <h3 className="card__title">문의</h3>
              <p className="card__meta">상품/일반/법인</p>
              <div className="card__actions">
                <Link className="btn btn--primary" to="/support/inquiry/general">문의하기</Link>
                <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
