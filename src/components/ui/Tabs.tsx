import React from 'react'

export type TabItem = { id: string; label: string; content: React.ReactNode }

export function Tabs({ items, initialId }: { items: TabItem[]; initialId?: string }) {
  const first = items[0]?.id
  const [active, setActive] = React.useState(initialId ?? first ?? '')
  const panelId = (id: string) => `panel-${id}`
  const tabId = (id: string) => `tab-${id}`

  if (items.length === 0) return null
  const current = items.find((x) => x.id === active) ?? items[0]

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label="Tabs">
        {items.map((t) => (
          <button
            key={t.id}
            id={tabId(t.id)}
            className="tab"
            role="tab"
            type="button"
            aria-selected={t.id === current.id}
            aria-controls={panelId(t.id)}
            tabIndex={t.id === current.id ? 0 : -1}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={panelId(current.id)}
        className="tabs__panel"
        role="tabpanel"
        aria-labelledby={tabId(current.id)}
      >
        {current.content}
      </div>
    </div>
  )
}
