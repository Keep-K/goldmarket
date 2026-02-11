import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'

export function LegalPage({ kind }: { kind: 'terms' | 'privacy' }) {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">{kind === 'terms' ? '이용약관' : '개인정보처리방침'}</h1>
          <p className="section__desc">정적 문서 템플릿 예정</p>
        </header>
        <Card>
          <div className="card__body">
            <p className="card__meta">추후 마크다운/HTML 기반으로 채웁니다.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
