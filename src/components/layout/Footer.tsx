import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <h3 className="footer__title">KoreaGoldX</h3>
          <p className="footer__meta">
            본 사이트는 금/은/백금 시세 및 상품 안내를 제공합니다. 결제/주문 기능은 제공하지 않습니다.
          </p>
          <p className="footer__meta" style={{ marginTop: 10 }}>
            대표전화: <a href="tel:02-0000-0000">02-0000-0000</a>
            <br />
            주소: (예시) 서울특별시 ○○구 ○○로 00
          </p>
        </div>

        <div>
          <h3 className="footer__title">바로가기</h3>
          <div className="footer__links" aria-label="Footer links">
            <Link to="/prices">시세조회</Link>
            <Link to="/products">상품</Link>
            <Link to="/stores">가맹점찾기</Link>
            <Link to="/support">고객센터</Link>
          </div>
        </div>

        <div>
          <h3 className="footer__title">정책</h3>
          <div className="footer__links" aria-label="Policy links">
            <Link to="/legal/terms">이용약관</Link>
            <Link to="/legal/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
