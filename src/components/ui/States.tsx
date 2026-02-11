import React from 'react'
import { Button } from '@/components/ui/Button'

export function LoadingBlock({ title = '불러오는 중…' }: { title?: string }) {
  return (
    <div className="card">
      <div className="card__body">
        <div className="card__title">{title}</div>
        <div className="skeleton" style={{ height: 14, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, width: '72%' }} />
      </div>
    </div>
  )
}

export function ErrorBlock({
  title = '오류가 발생했습니다',
  description,
  onRetry
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="card">
      <div className="card__body">
        <div className="card__title">{title}</div>
        <p className="card__meta">{description ?? '잠시 후 다시 시도해 주세요.'}</p>
        {onRetry ? (
          <div className="card__actions">
            <Button variant="primary" onClick={onRetry}>
              재시도
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function EmptyBlock({
  title = '결과가 없습니다',
  description,
  action
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="card">
      <div className="card__body">
        <div className="card__title">{title}</div>
        <p className="card__meta">{description ?? '조건을 변경해 다시 시도해 주세요.'}</p>
        {action ? <div className="card__actions">{action}</div> : null}
      </div>
    </div>
  )
}
