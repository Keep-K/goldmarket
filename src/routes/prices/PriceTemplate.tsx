import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { TableWrap } from '@/components/ui/TableWrap'
import { Pagination } from '@/components/ui/Pagination'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/ui/States'
import { getPriceHistory, getSpotQuotes } from '@/services/api/prices'
import type { PricePoint, SpotQuote } from '@/services/api/types'

export type PriceKind =
  | 'gold'
  | 'silver'
  | 'platinum'
  | 'benchmark'
  | 'live'
  | 'diamond'
  | 'lab-diamond'
  | 'securities'

const TABS: Array<{ kind: PriceKind; label: string; symbol: string }> = [
  { kind: 'gold', label: '금', symbol: 'gold' },
  { kind: 'silver', label: '은', symbol: 'silver' },
  { kind: 'platinum', label: '백금', symbol: 'platinum' },
  { kind: 'benchmark', label: '국제/지표', symbol: 'benchmark' },
  { kind: 'live', label: '실시간', symbol: 'gold' },
  { kind: 'diamond', label: '다이아', symbol: 'diamond' },
  { kind: 'lab-diamond', label: '랩다이아', symbol: 'lab-diamond' },
  { kind: 'securities', label: '증권/ETF', symbol: 'securities' }
]

const RANGE_PRESETS: Array<{ id: string; label: string; range: string; interval: string }> = [
  { id: '5m', label: '5M', range: '5m', interval: '1m' },
  { id: '1y', label: '1Y', range: '1y', interval: '1d' },
  { id: '3y', label: '3Y', range: '3y', interval: '1w' },
  { id: '5y', label: '5Y', range: '5y', interval: '1w' },
  { id: 'all', label: 'ALL', range: 'all', interval: '1w' }
]

function formatNumber(n: number) {
  if (!Number.isFinite(n)) return '-'
  return n.toLocaleString('ko-KR')
}

function formatTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ko-KR', { hour12: false })
}

function computeHighLow(points: PricePoint[]) {
  let hi = -Infinity
  let lo = Infinity
  for (const p of points) {
    if (p.high > hi) hi = p.high
    if (p.low < lo) lo = p.low
  }
  return { hi: Number.isFinite(hi) ? hi : undefined, lo: Number.isFinite(lo) ? lo : undefined }
}

function miniChartPath(points: PricePoint[], w: number, h: number, pad: number) {
  if (points.length < 2) return { d: '', xs: [] as number[], ys: [] as number[], min: 0, max: 0 }
  const closes = points.map((p) => p.close)
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const innerW = w - pad * 2
  const innerH = h - pad * 2
  const xs: number[] = []
  const ys: number[] = []

  const scaleY = (v: number) => {
    if (max === min) return pad + innerH / 2
    const t = (v - min) / (max - min)
    return pad + (1 - t) * innerH
  }

  for (let i = 0; i < points.length; i++) {
    const x = pad + (i / (points.length - 1)) * innerW
    const y = scaleY(points[i].close)
    xs.push(x)
    ys.push(y)
  }

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < xs.length; i++) d += ` L ${xs[i]} ${ys[i]}`
  return { d, xs, ys, min, max }
}

function MiniLineChart({
  points,
  currency
}: {
  points: PricePoint[]
  currency: string
}) {
  const w = 760
  const h = 240
  const pad = 16
  const { d, xs, ys, min, max } = miniChartPath(points, w, h, pad)
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (xs.length === 0) return
    let best = 0
    let bestDist = Infinity
    for (let i = 0; i < xs.length; i++) {
      const dist = Math.abs(xs[i] - x)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    }
    setHoverIndex(best)
  }

  const idx = hoverIndex
  const p = idx === null ? null : points[idx]
  const x = idx === null ? null : xs[idx]
  const y = idx === null ? null : ys[idx]

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        onMouseMove={onMove}
        onMouseLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="가격 추이 차트"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="kcx-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(214,177,94,.95)" />
            <stop offset="1" stopColor="rgba(111,177,255,.9)" />
          </linearGradient>
          <linearGradient id="kcx-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(214,177,94,.22)" />
            <stop offset="1" stopColor="rgba(214,177,94,0)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={w} height={h} fill="rgba(11,18,32,.03)" rx="14" />

        {d ? (
          <>
            <path
              d={`${d} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`}
              fill="url(#kcx-area)"
            />
            <path d={d} fill="none" stroke="url(#kcx-line)" strokeWidth="2" />
          </>
        ) : null}

        {x !== null && y !== null ? (
          <>
            <line x1={x} y1={pad} x2={x} y2={h - pad} stroke="rgba(11,18,32,.18)" strokeDasharray="4 6" />
            <circle cx={x} cy={y} r="4" fill="rgba(214,177,94,.95)" />
          </>
        ) : null}

        <text x={pad} y={pad + 10} fill="rgba(11,18,32,.55)" fontSize="12">
          {formatNumber(max)} {currency}
        </text>
        <text x={pad} y={h - pad} fill="rgba(11,18,32,.55)" fontSize="12">
          {formatNumber(min)} {currency}
        </text>
      </svg>

      {p && x !== null && y !== null ? (
        <div
          style={{
            position: 'absolute',
            left: `min(calc(100% - 220px), max(10px, ${(x / w) * 100}%))`,
            top: 12,
            width: 220,
            pointerEvents: 'none'
          }}
          className="card"
        >
          <div className="card__body" style={{ padding: 12 }}>
            <div className="card__title" style={{ fontSize: 14 }}>
              {formatNumber(p.close)} {currency}
            </div>
            <div className="card__meta">{formatTime(p.t)}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function kpiFromSpot(spot: SpotQuote | undefined, history: PricePoint[]) {
  const hl = computeHighLow(history)
  return {
    price: spot?.price,
    change: spot?.change,
    changePct: spot?.changePct,
    hi: hl.hi,
    lo: hl.lo,
    unit: spot?.unit,
    updatedAt: spot?.updatedAt
  }
}

export function PriceTemplate({ kind }: { kind: PriceKind }) {
  const tab = TABS.find((t) => t.kind === kind) ?? TABS[0]
  const [rangeId, setRangeId] = React.useState('1y')
  const [sort, setSort] = React.useState<'t_desc' | 't_asc' | 'close_desc' | 'close_asc'>('t_desc')
  const [page, setPage] = React.useState(1)
  const [autoRefresh, setAutoRefresh] = React.useState(kind === 'live')
  const pageSize = 10

  const range = RANGE_PRESETS.find((r) => r.id === rangeId) ?? RANGE_PRESETS[1]
  const refetchIntervalMs = kind === 'live' && autoRefresh ? 8_000 : false

  const spotQuery = useQuery({
    queryKey: ['spot', tab.symbol],
    queryFn: ({ signal }) => getSpotQuotes({ symbols: [tab.symbol], currency: 'KRW', signal }),
    refetchInterval: refetchIntervalMs
  })
  const historyQuery = useQuery({
    queryKey: ['history', tab.symbol, range.range, range.interval],
    queryFn: ({ signal }) => getPriceHistory({ symbol: tab.symbol, range: range.range, interval: range.interval, signal }),
    refetchInterval: refetchIntervalMs
  })

  const spot = spotQuery.data?.[0]
  const history = historyQuery.data ?? []
  const kpi = kpiFromSpot(spot, history)

  const sorted = React.useMemo(() => {
    const arr = [...history]
    const byT = (a: PricePoint, b: PricePoint) => a.t.localeCompare(b.t)
    const byClose = (a: PricePoint, b: PricePoint) => (a.close ?? 0) - (b.close ?? 0)
    arr.sort((a, b) => {
      if (sort === 't_asc') return byT(a, b)
      if (sort === 't_desc') return byT(b, a)
      if (sort === 'close_asc') return byClose(a, b)
      return byClose(b, a)
    })
    return arr
  }, [history, sort])

  const total = sorted.length
  const start = (page - 1) * pageSize
  const rows = sorted.slice(start, start + pageSize)

  React.useEffect(() => {
    setPage(1)
  }, [rangeId, sort, kind])

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">시세조회</h1>
          <p className="section__desc">차트/테이블은 API 연동 구조로 구성되며, 현재는 mock 데이터를 포함합니다.</p>

          <div className="section__actions" role="tablist" aria-label="시세 탭">
            {TABS.map((t) => (
              <Link
                key={t.kind}
                to={`/prices/${t.kind}`}
                className={t.kind === kind ? 'btn btn--primary btn--sm' : 'btn btn--ghost btn--sm'}
                role="tab"
                aria-selected={t.kind === kind}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="section__actions">
            <Link className="btn btn--primary" to="/support/inquiry/general">문의하기</Link>
            <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
            <Link className="btn btn--ghost" to="/stores">가맹점 찾기</Link>
          </div>
        </header>

        <div className="grid grid--4">
          <Card>
            <div className="card__body">
              <div className="card__meta">현재가</div>
              <div className="card__title">
                {kpi.price ? `${formatNumber(kpi.price)} ${spot?.currency ?? 'KRW'}` : '—'}
              </div>
              <div className="card__meta">단위: {kpi.unit ?? '—'}</div>
            </div>
          </Card>
          <Card>
            <div className="card__body">
              <div className="card__meta">변동</div>
              <div className="card__title">
                {kpi.change !== undefined ? `${formatNumber(kpi.change)} (${kpi.changePct ?? 0}%)` : '—'}
              </div>
              <div className="card__meta">업데이트: {kpi.updatedAt ? formatTime(kpi.updatedAt) : '—'}</div>
            </div>
          </Card>
          <Card>
            <div className="card__body">
              <div className="card__meta">고가</div>
              <div className="card__title">{kpi.hi !== undefined ? formatNumber(kpi.hi) : '—'}</div>
              <div className="card__meta">기간: {range.label}</div>
            </div>
          </Card>
          <Card>
            <div className="card__body">
              <div className="card__meta">저가</div>
              <div className="card__title">{kpi.lo !== undefined ? formatNumber(kpi.lo) : '—'}</div>
              <div className="card__meta">소스: {spot?.source ?? '—'}</div>
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 16 }} className="grid grid--2">
          <Card>
            <div className="card__body">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <div className="card__title">가격 추이</div>
                  <div className="card__meta">기간 프리셋 + tooltip</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} aria-label="기간 선택">
                  {RANGE_PRESETS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={r.id === rangeId ? 'btn btn--primary btn--sm' : 'btn btn--ghost btn--sm'}
                      onClick={() => setRangeId(r.id)}
                      aria-pressed={r.id === rangeId}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {kind === 'live' ? (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <span className="muted" style={{ fontSize: 14 }}>자동 새로고침 (8초)</span>
                  </label>
                  <span className="muted" style={{ fontSize: 13 }}>데모에서는 mock 데이터를 주기적으로 갱신합니다.</span>
                </div>
              ) : null}

              {historyQuery.isLoading ? (
                <LoadingBlock title="차트를 불러오는 중…" />
              ) : historyQuery.isError ? (
                <ErrorBlock
                  description="차트 데이터를 불러오지 못했습니다."
                  onRetry={() => historyQuery.refetch()}
                />
              ) : history.length === 0 ? (
                <EmptyBlock title="차트 데이터가 없습니다" />
              ) : (
                <MiniLineChart points={history} currency={spot?.currency ?? 'KRW'} />
              )}
            </div>
          </Card>

          <Card>
            <div className="card__body">
              <div className="card__title">상담 안내</div>
              <p className="card__meta">결제 기능 없이, 문의/전화/가맹점으로 안내합니다.</p>
              <div className="card__actions">
                <Link className="btn btn--primary" to="/support/inquiry/general">문의하기</Link>
                <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
                <Link className="btn btn--ghost" to="/stores">가맹점 찾기</Link>
              </div>
              <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
                <div className="badge">데이터 소스: {spot?.source ?? '—'}</div>
                <div className="badge">업데이트: {kpi.updatedAt ? formatTime(kpi.updatedAt) : '—'}</div>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 16 }}>
          <Card>
            <div className="card__body">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div>
                  <div className="card__title">히스토리 테이블</div>
                  <div className="card__meta">정렬/페이지네이션</div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="muted" style={{ fontSize: 14 }}>
                    정렬
                    <select
                      className="input"
                      style={{ width: 180, marginLeft: 8, padding: '10px 10px' }}
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                    >
                      <option value="t_desc">최신순</option>
                      <option value="t_asc">과거순</option>
                      <option value="close_desc">종가 높은순</option>
                      <option value="close_asc">종가 낮은순</option>
                    </select>
                  </label>
                </div>
              </div>

              {spotQuery.isLoading && !spot ? (
                <LoadingBlock title="시세를 불러오는 중…" />
              ) : spotQuery.isError ? (
                <ErrorBlock description="현재가 정보를 불러오지 못했습니다." onRetry={() => spotQuery.refetch()} />
              ) : null}

              {historyQuery.isLoading ? (
                <LoadingBlock title="테이블을 불러오는 중…" />
              ) : historyQuery.isError ? (
                <ErrorBlock description="테이블 데이터를 불러오지 못했습니다." onRetry={() => historyQuery.refetch()} />
              ) : total === 0 ? (
                <EmptyBlock title="테이블 데이터가 없습니다" />
              ) : (
                <>
                  <TableWrap>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left' }}>
                          <th style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>시간</th>
                          <th style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>시가</th>
                          <th style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>고가</th>
                          <th style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>저가</th>
                          <th style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>종가</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.t}>
                            <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>
                              <span className="muted">{formatTime(r.t)}</span>
                            </td>
                            <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{formatNumber(r.open)}</td>
                            <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{formatNumber(r.high)}</td>
                            <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{formatNumber(r.low)}</td>
                            <td style={{ padding: 12, borderBottom: '1px solid var(--border)' }}>{formatNumber(r.close)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                  <div style={{ marginTop: 12 }}>
                    <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
