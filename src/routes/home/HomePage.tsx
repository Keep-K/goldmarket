import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function HomePage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <header className="section__head">
            <h1 className="section__title" style={{ fontSize: 'var(--fs-1)' }}>
              시세와 상품 안내를
              <br />
              더 빠르고 명확하게
            </h1>
            <p className="section__desc">
              결제 기능 없이, 금/은/백금/다이아 시세와 상품 정보를 제공하고 상담 연결을 돕습니다.
            </p>
            <div className="section__actions">
              <Link className="btn btn--primary" to="/prices">시세조회</Link>
              <Link className="btn btn--ghost" to="/products">상품 보기</Link>
              <Link className="btn btn--ghost" to="/support/inquiry/general">문의하기</Link>
            </div>
          </header>

          <div className="grid grid--3">
            <Card>
              <div className="card__body">
                <h3 className="card__title">시세 허브</h3>
                <p className="card__meta">금/은/백금/국제/다이아 등 라우트 구조를 먼저 고정합니다.</p>
                <div className="card__actions">
                  <Link className="btn btn--ghost" to="/prices">바로가기</Link>
                </div>
              </div>
            </Card>
            <Card>
              <div className="card__body">
                <h3 className="card__title">상품 안내</h3>
                <p className="card__meta">결제/장바구니 없이, 상담 중심의 CTA(문의/전화/가맹점)를 유지합니다.</p>
                <div className="card__actions">
                  <Link className="btn btn--ghost" to="/products">바로가기</Link>
                </div>
              </div>
            </Card>
            <Card>
              <div className="card__body">
                <h3 className="card__title">고객센터</h3>
                <p className="card__meta">공지/FAQ/문의 폼을 템플릿 단위로 확장합니다.</p>
                <div className="card__actions">
                  <Link className="btn btn--ghost" to="/support">바로가기</Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid--3">
            <Card>
              <div className="card__body">
                <h3 className="card__title">원칙</h3>
                <p className="card__meta">
                  <Badge>결제 없음</Badge> <Badge>접근성</Badge> <Badge>로딩/에러/빈 상태</Badge>
                </p>
              </div>
            </Card>
            <Card>
              <div className="card__body">
                <h3 className="card__title">Mock Asset 슬롯</h3>
                <p className="card__meta">이미지는 `src/assets/mock/...` 경로로 고정하고 추후 교체합니다.</p>
              </div>
            </Card>
            <Card>
              <div className="card__body">
                <h3 className="card__title">다음 구현</h3>
                <p className="card__meta">PriceTemplate(차트+테이블)부터 진행하면 구조가 빠르게 잡힙니다.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
