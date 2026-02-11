import { Link, useLocation } from 'react-router-dom'

export function FloatingCTA() {
  const { pathname } = useLocation()
  const hidden = pathname.startsWith('/support/inquiry')
  if (hidden) return null

  return (
    <div className="floatingCTA" aria-label="Mobile quick actions">
      <div className="floatingCTA__inner">
        <Link className="btn btn--primary" to="/support/inquiry/general">
          문의하기
        </Link>
        <a className="btn btn--ghost" href="tel:02-0000-0000">
          전화하기
        </a>
        <Link className="btn btn--ghost" to="/stores">
          가맹점 찾기
        </Link>
      </div>
    </div>
  )
}
