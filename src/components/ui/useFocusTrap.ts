import React from 'react'

function getFocusable(container: HTMLElement) {
  const sel =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
  return Array.from(container.querySelectorAll<HTMLElement>(sel)).filter((el) => {
    const style = window.getComputedStyle(el)
    return style.visibility !== 'hidden' && style.display !== 'none'
  })
}

export function useFocusTrap(open: boolean, containerRef: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    if (!open) return
    const container = containerRef.current
    if (!container) return

    const prev = document.activeElement as HTMLElement | null
    const focusables = getFocusable(container)
    ;(focusables[0] ?? container).focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const els = getFocusable(container)
      if (els.length === 0) {
        e.preventDefault()
        container.focus()
        return
      }
      const first = els[0]
      const last = els[els.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (!active || active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      prev?.focus?.()
    }
  }, [open, containerRef])
}
