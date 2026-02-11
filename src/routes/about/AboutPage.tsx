import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/ui/Card'

export function AboutPage({ kind }: { kind: string }) {
  return (
    <section className="section">
      <div className="container">
        <header className="section__head">
          <Breadcrumb />
          <h1 className="section__title">회사소개: {kind}</h1>
          <p className="section__desc">정적 섹션 템플릿 예정</p>
        </header>
        <Card>
          <div className="card__body">
            <h3 className="card__title">콘텐츠 자리</h3>
            <p className="card__meta">추후 텍스트/이미지(Mock Asset)로 채웁니다.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
