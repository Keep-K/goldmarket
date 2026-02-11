import React from 'react'
import { createPortal } from 'react-dom'
import { getPortalRoot } from '@/components/ui/portal'

type ToastItem = { id: string; title: string; description?: string }
type ToastCtx = { toast: (t: Omit<ToastItem, 'id'> & { durationMs?: number }) => void }

const ToastContext = React.createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  const toast: ToastCtx['toast'] = (t) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const item: ToastItem = { id, title: t.title, description: t.description }
    setItems((prev) => [item, ...prev].slice(0, 3))
    const duration = t.durationMs ?? 3200
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id))
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="toastWrap" aria-live="polite" aria-relevant="additions removals">
          {items.map((t) => (
            <div key={t.id} className="toast" role="status">
              <p className="toast__title">{t.title}</p>
              {t.description ? <p className="toast__desc">{t.description}</p> : null}
            </div>
          ))}
        </div>,
        getPortalRoot()
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
