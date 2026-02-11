import type { Inquiry } from '@/services/api/types'

const USE_MOCK = (import.meta as any).env?.VITE_USE_MOCK !== '0'

export async function submitInquiry(payload: Inquiry): Promise<{ ok: true }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 650))
    return { ok: true }
  }

  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('submit failed')
  return { ok: true }
}
