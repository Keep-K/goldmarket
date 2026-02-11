import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

const NAV = [
  { to: '/prices', label: '시세조회' },
  { to: '/products', label: '상품' },
  { to: '/stores', label: '가맹점찾기' },
  { to: '/refining', label: '정련' },
  { to: '/news', label: '뉴스' },
  { to: '/support', label: '고객센터' },
  { to: '/about/company', label: '회사소개' }
]

export function Header() {
  const [compact, setCompact] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [q, setQ] = React.useState('')
  const navigate = useNavigate()

  React.useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const v = q.trim()
    setSearchOpen(false)
    if (v) navigate(`/products?q=${encodeURIComponent(v)}`)
  }

  return (
    <header className={compact ? 'header header--compact' : 'header'}>
      <div className="container header__inner">
        <Link className="header__logo" to="/" aria-label="KoreaGoldX 홈">
          <span className="header__logoMark" aria-hidden="true" />
          <span className="header__logoText">KoreaGoldX</span>
        </Link>

        <nav className="header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink key={item.to} className="navlink" to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} aria-haspopup="dialog">
            검색
          </Button>
          <Button
            className="header__burger"
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            aria-label="메뉴 열기"
          >
            메뉴
          </Button>
          <a className="btn btn--primary btn--sm" href="tel:02-0000-0000">
            전화
          </a>
        </div>
      </div>

      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} title="메뉴">
        <div className="grid" style={{ gap: 10 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="btn btn--ghost"
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="card" style={{ marginTop: 6 }}>
            <div className="card__body">
              <div className="card__title">빠른 문의</div>
              <div className="card__actions">
                <Link className="btn btn--primary" to="/support/inquiry/general" onClick={() => setDrawerOpen(false)}>
                  문의하기
                </Link>
                <a className="btn btn--ghost" href="tel:02-0000-0000">
                  전화하기
                </a>
                <Link className="btn btn--ghost" to="/stores" onClick={() => setDrawerOpen(false)}>
                  가맹점 찾기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="검색">
        <form onSubmit={submitSearch} className="grid" style={{ gap: 10 }}>
          <label className="srOnly" htmlFor="site-search">
            검색어
          </label>
          <input
            id="site-search"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="상품명/카테고리로 검색"
            autoComplete="off"
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setSearchOpen(false)}>
              닫기
            </Button>
            <Button type="submit" variant="primary">
              검색
            </Button>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>
            결제 기능 없이, 상품/시세 안내용 사이트입니다.
          </p>
        </form>
      </Modal>
    </header>
  )
}
