import { ProductListTemplate } from '@/routes/products/ProductListTemplate'

export function ProductCategoryPage({ category }: { category: string }) {
  return <ProductListTemplate category={category} />
}
