import React from 'react'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <article className={['card', className].filter(Boolean).join(' ')}>{children}</article>
}
