import React from 'react'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { submitInquiry } from '@/services/api/inquiries'

export function InquiryPage({ type }: { type: 'product' | 'general' | 'corporate' }) {
  const { toast } = useToast()
  const [name, setName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !title.trim() || !message.trim()) {
      toast({ title: '필수 항목을 확인해 주세요', description: '이름/전화/제목/내용은 필수입니다.' })
      return
    }

    setSubmitting(true)
    try {
      await submitInquiry({
        type,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        title: title.trim(),
        message: message.trim()
      })
      toast({ title: '문의가 접수되었습니다', description: '담당자가 확인 후 연락드리겠습니다.' })
      setName('')
      setPhone('')
      setEmail('')
      setTitle('')
      setMessage('')
    } catch {
      toast({ title: '접수에 실패했습니다', description: '잠시 후 다시 시도해 주세요.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">문의하기</h1>
          <p className="section__desc">유형: {type}</p>
        </header>

        <Card>
          <div className="card__body">
            <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
              <label>
                <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>이름 *</div>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>전화번호 *</div>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
              </label>
              <label>
                <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>이메일</div>
                <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
              </label>
              <label>
                <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>제목 *</div>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label>
                <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>내용 *</div>
                <textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
              </label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <a className="btn btn--ghost" href="tel:02-0000-0000">전화하기</a>
                <Button type="submit" variant="primary" disabled={submitting} aria-busy={submitting}>
                  {submitting ? '전송 중…' : '문의 접수'}
                </Button>
              </div>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                결제/주문 기능 없이, 문의 접수 후 유선/메일로 안내드립니다.
              </p>
            </form>
          </div>
        </Card>
      </div>
    </section>
  )
}
