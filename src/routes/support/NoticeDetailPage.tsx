import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { useQuery } from '@tanstack/react-query'
import { getNoticeById } from '@/services/api/support'
import { LoadingBlock, ErrorBlock } from '@/components/ui/States'

export function NoticeDetailPage() {
  const { id } = useParams()
  const query = useQuery({
    queryKey: ['notice', id],
    enabled: !!id,
    queryFn: ({ signal }) => getNoticeById({ id: id!, signal })
  })

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">공지 상세</h1>
          <p className="section__desc">ID: {id}</p>
          <div className="section__actions">
            <Link className="btn btn--ghost" to="/support/notice">목록</Link>
          </div>
        </header>

        {query.isLoading ? (
          <LoadingBlock title="공지사항을 불러오는 중…" />
        ) : query.isError || !query.data ? (
          <ErrorBlock title="공지사항을 불러오지 못했습니다" onRetry={() => query.refetch()} />
        ) : (
          <Card>
            <div className="card__body">
              <h3 className="card__title">{query.data.title}</h3>
              <p className="card__meta">{new Date(query.data.publishedAt).toLocaleString('ko-KR')}</p>
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,.08)',
                  paddingTop: 12,
                  color: 'var(--fg)'
                }}
                dangerouslySetInnerHTML={{ __html: query.data.contentHtml }}
              />
            </div>
          </Card>
        )}
      </div>
    </section>
  )
}
