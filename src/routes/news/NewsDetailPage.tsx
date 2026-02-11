import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { getNewsById, getNews } from '@/services/api/news'
import { LoadingBlock, ErrorBlock } from '@/components/ui/States'

export function NewsDetailPage() {
  const { id } = useParams()

  const detailQuery = useQuery({
    queryKey: ['newsDetail', id],
    enabled: !!id,
    queryFn: ({ signal }) => getNewsById({ id: id!, signal })
  })

  const relatedQuery = useQuery({
    queryKey: ['newsRelated', id],
    enabled: !!id,
    queryFn: ({ signal }) => getNews({ page: 1, signal })
  })

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">뉴스 상세</h1>
          <p className="section__desc">ID: {id}</p>
          <div className="section__actions">
            <Link className="btn btn--ghost" to="/news">목록</Link>
            <Link className="btn btn--primary" to="/support/inquiry/general">문의하기</Link>
          </div>
        </header>

        {detailQuery.isLoading ? (
          <LoadingBlock title="뉴스를 불러오는 중…" />
        ) : detailQuery.isError || !detailQuery.data ? (
          <ErrorBlock title="뉴스를 불러오지 못했습니다" onRetry={() => detailQuery.refetch()} />
        ) : (
          <>
            <Card>
              <div className="card__body">
                <h3 className="card__title">{detailQuery.data.title}</h3>
                <p className="card__meta">{new Date(detailQuery.data.publishedAt).toLocaleString('ko-KR')}</p>
                <div
                  style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}
                  dangerouslySetInnerHTML={{ __html: detailQuery.data.contentHtml }}
                />
                <div className="card__actions" style={{ marginTop: 12 }}>
                  <a
                    className="btn btn--ghost"
                    href={`https://www.addtoany.com/share#url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    공유
                  </a>
                </div>
              </div>
            </Card>

            <div style={{ marginTop: 16 }}>
              <Card>
                <div className="card__body">
                  <div className="card__title">관련 뉴스</div>
                  <p className="card__meta">최근 게시물 일부를 노출합니다.</p>

                  {relatedQuery.isLoading ? (
                    <LoadingBlock title="관련 뉴스를 불러오는 중…" />
                  ) : relatedQuery.isError ? (
                    <ErrorBlock title="관련 뉴스를 불러오지 못했습니다" onRetry={() => relatedQuery.refetch()} />
                  ) : (
                    <div className="grid grid--3">
                      {relatedQuery.data!.items
                        .filter((x) => x.id !== id)
                        .slice(0, 3)
                        .map((x) => (
                          <Card key={x.id}>
                            <div className="card__body">
                              <h3 className="card__title" style={{ fontSize: 16 }}>{x.title}</h3>
                              <p className="card__meta">{new Date(x.publishedAt).toLocaleDateString('ko-KR')}</p>
                              <div className="card__actions">
                                <Link className="btn btn--ghost" to={`/news/${encodeURIComponent(x.id)}`}>
                                  보기
                                </Link>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
