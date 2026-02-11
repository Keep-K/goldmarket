import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '@/components/ui/States'
import { getStores } from '@/services/api/stores'

const REGIONS = [
  { id: '', label: '전체' },
  { id: 'seoul', label: '서울' },
  { id: 'gyeonggi', label: '경기' },
  { id: 'incheon', label: '인천' },
  { id: 'busan', label: '부산' },
  { id: 'daegu', label: '대구' },
  { id: 'daejeon', label: '대전' },
  { id: 'gwangju', label: '광주' }
]

export function StoresTemplate() {
  const [sp, setSp] = useSearchParams()
  const region = sp.get('region') ?? ''
  const q = sp.get('q') ?? ''

  const query = useQuery({
    queryKey: ['stores', region, q],
    queryFn: ({ signal }) => getStores({ region: region || undefined, q: q || undefined, signal })
  })

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(sp)
    if (!v) next.delete(k)
    else next.set(k, v)
    setSp(next)
  }

  const reset = () => setSp(new URLSearchParams())

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">가맹점 찾기</h1>
          <p className="section__desc">지역/검색 조건으로 가맹점을 조회하고, 전화/지도 링크로 연결합니다.</p>
          <div className="section__actions">
            <Link className="btn btn--primary" to="/support/inquiry/general">문의하기</Link>
            <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
          </div>
        </header>

        <Card>
          <div className="card__body" style={{ gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} aria-label="지역 선택">
                {REGIONS.map((r) => (
                  <button
                    key={r.id || 'all'}
                    type="button"
                    className={r.id === region ? 'btn btn--primary btn--sm' : 'btn btn--ghost btn--sm'}
                    onClick={() => setParam('region', r.id)}
                    aria-pressed={r.id === region}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <button className="btn btn--ghost" type="button" onClick={reset}>
                초기화
              </button>
            </div>

            <label>
              <span className="srOnly">검색</span>
              <input
                className="input"
                placeholder="지점명/주소 검색"
                value={q}
                onChange={(e) => setParam('q', e.target.value)}
              />
            </label>
          </div>
        </Card>

        <div className="grid grid--2" style={{ marginTop: 16 }}>
          <Card>
            <div className="card__body">
              <div className="card__title">목록</div>
              <p className="card__meta">결과를 선택해 전화/지도보기로 이동합니다.</p>

              {query.isLoading ? (
                <LoadingBlock title="가맹점을 불러오는 중…" />
              ) : query.isError ? (
                <ErrorBlock title="가맹점을 불러오지 못했습니다" onRetry={() => query.refetch()} />
              ) : (query.data?.length ?? 0) === 0 ? (
                <EmptyBlock
                  title="조건에 맞는 가맹점이 없습니다"
                  action={
                    <button className="btn btn--primary" type="button" onClick={reset}>
                      조건 초기화
                    </button>
                  }
                />
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {query.data!.map((s) => {
                    const mapQ = encodeURIComponent(s.address)
                    const mapHref = `https://map.naver.com/v5/search/${mapQ}`
                    return (
                      <div key={s.id} className="card" style={{ boxShadow: 'none' }}>
                        <div className="card__body">
                          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <div className="card__title" style={{ fontSize: 16 }}>{s.name}</div>
                            <Badge>{s.region}</Badge>
                          </div>
                          <p className="card__meta">{s.address}</p>
                          {s.hours ? <p className="card__meta">영업시간: {s.hours}</p> : null}
                          <div className="card__actions">
                            <a className="btn btn--primary" href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`}>
                              전화하기
                            </a>
                            <a className="btn btn--ghost" href={mapHref} target="_blank" rel="noreferrer">
                              지도보기
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <div className="card__body">
              <div className="card__title">지도</div>
              <p className="card__meta">지도 API 연동은 추후 적용(옵션)</p>
              <div
                className="skeleton"
                style={{ height: 360, borderRadius: 14 }}
                aria-label="지도 자리"
                role="img"
              />
              <p className="muted" style={{ margin: '10px 0 0 0', fontSize: 13 }}>
                현재는 외부 지도 링크(네이버 지도)로 연결합니다.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
