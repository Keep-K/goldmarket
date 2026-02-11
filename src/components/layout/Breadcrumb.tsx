import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const LABELS: Record<string, string> = {
  prices: '시세조회',
  gold: '금',
  silver: '은',
  platinum: '백금',
  benchmark: '국제/지표',
  live: '실시간',
  diamond: '다이아',
  'lab-diamond': '랩다이아',
  securities: '증권/ETF',
  products: '상품',
  'gold-bar': '골드바',
  'silver-bar': '실버바',
  coins: '코인',
  gifts: '기념품/선물',
  stores: '가맹점찾기',
  refining: '정련',
  news: '뉴스',
  support: '고객센터',
  notice: '공지사항',
  faq: 'FAQ',
  inquiry: '문의',
  about: '회사소개',
  company: '회사개요',
  history: '연혁',
  office: '오피스',
  organization: '조직도',
  why: '왜 KoreaGoldX',
  'sell-guide': '매각 가이드',
  careers: '채용',
  franchise: '가맹',
  legal: '정책',
  terms: '이용약관',
  privacy: '개인정보처리방침'
}

export function Breadcrumb({ homeLabel = '홈' }: { homeLabel?: string }) {
  const { pathname } = useLocation()
  const parts = pathname.split('/').filter(Boolean)

  const items = [{ to: '/', label: homeLabel }]
  let acc = ''
  for (const p of parts) {
    acc += `/${p}`
    items.push({
      to: acc,
      label: LABELS[p] ?? (p.length > 20 ? `${p.slice(0, 18)}…` : p)
    })
  }

  if (items.length <= 1) return null

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <React.Fragment key={it.to}>
          {i > 0 ? <span className="breadcrumb__sep" aria-hidden="true">/</span> : null}
          {i === items.length - 1 ? (
            <span aria-current="page">{it.label}</span>
          ) : (
            <Link to={it.to}>{it.label}</Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
