import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

export function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <h1 className="section__title">페이지를 찾을 수 없습니다</h1>
          <p className="section__desc">요청하신 주소가 변경되었거나 삭제되었습니다.</p>
          <div className="section__actions">
            <Link className="btn btn--primary" to="/">홈으로</Link>
            <Link className="btn btn--ghost" to="/support">고객센터</Link>
          </div>
        </header>
        <Card>
          <div className="card__body">
            <p className="card__meta">아래 메뉴를 통해 원하는 페이지로 이동할 수 있습니다.</p>
            <div className="card__actions">
              <Link className="btn btn--ghost" to="/prices">시세조회</Link>
              <Link className="btn btn--ghost" to="/products">상품</Link>
              <Link className="btn btn--ghost" to="/stores">가맹점찾기</Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
