export function Pagination({
  page,
  pageSize,
  total,
  onPageChange
}: {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const p = Math.min(Math.max(1, page), pageCount)

  const windowSize = 5
  const start = Math.max(1, p - Math.floor(windowSize / 2))
  const end = Math.min(pageCount, start + windowSize - 1)
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <div className="muted" style={{ fontSize: 14 }}>
        {total === 0 ? '결과 없음' : `총 ${total.toLocaleString()}개`}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }} aria-label="Pagination">
        <button className="btn btn--ghost btn--sm" type="button" onClick={() => onPageChange(1)} disabled={p <= 1}>
          처음
        </button>
        <button className="btn btn--ghost btn--sm" type="button" onClick={() => onPageChange(p - 1)} disabled={p <= 1}>
          이전
        </button>
        {pages.map((x) => (
          <button
            key={x}
            className={x === p ? 'btn btn--primary btn--sm' : 'btn btn--ghost btn--sm'}
            type="button"
            onClick={() => onPageChange(x)}
            aria-current={x === p ? 'page' : undefined}
          >
            {x}
          </button>
        ))}
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => onPageChange(p + 1)}
          disabled={p >= pageCount}
        >
          다음
        </button>
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => onPageChange(pageCount)}
          disabled={p >= pageCount}
        >
          마지막
        </button>
      </div>
    </div>
  )
}
