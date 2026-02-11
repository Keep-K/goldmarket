import React from 'react'

type Variant = 'primary' | 'ghost' | 'danger'
type Size = 'md' | 'sm'

export function Button({
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}) {
  const v = variant === 'primary' ? 'btn--primary' : variant === 'danger' ? 'btn--danger' : 'btn--ghost'
  const s = size === 'sm' ? 'btn--sm' : ''
  return <button className={['btn', v, s, className].filter(Boolean).join(' ')} {...props} />
}
