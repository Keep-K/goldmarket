import { useParams } from 'react-router-dom'
import { ProductDetailTemplate } from '@/routes/products/ProductDetailTemplate'

export function ProductDetailPage() {
  const { id } = useParams()

  if (!id) {
    return (
      <section className="section">
        <div className="container">
          <header className="section__head">
            <h1 className="section__title">상품 상세</h1>
            <p className="section__desc">잘못된 접근입니다.</p>
          </header>
        </div>
      </section>
    )
  }

  return <ProductDetailTemplate id={id} />
}
