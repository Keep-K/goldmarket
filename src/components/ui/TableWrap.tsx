import React from 'react'

export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14 }}>
      {children}
    </div>
  )
}
