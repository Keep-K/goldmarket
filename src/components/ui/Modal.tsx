import React from 'react'
import { createPortal } from 'react-dom'
import { getPortalRoot } from '@/components/ui/portal'
import { Button } from '@/components/ui/Button'
import { useFocusTrap } from '@/components/ui/useFocusTrap'

export function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useFocusTrap(open, ref)

  React.useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}>
        <div className="modal__head">
          <h2 className="modal__title">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="닫기">
            닫기
          </Button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    getPortalRoot()
  )
}
