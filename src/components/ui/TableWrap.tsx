import React from 'react'

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 14 }}>
      {children}
    </div>
  )
}
