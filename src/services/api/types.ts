export type PricePoint = {
  t: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export type SpotQuote = {
  symbol: string
  buy?: number
  sell?: number
  price: number
  unit: string
  currency: string
  change?: number
  changePct?: number
  updatedAt: string
  source: string
}

export type Product = {
  id: string
  name: string
  category: string
  subCategory?: string
  priceLabel: string
  soldOut: boolean
  weight?: string
  purity?: string
  brand?: string
  images: string[]
  specs: Record<string, string>
  updatedAt: string
}

export type Store = {
  id: string
  name: string
  region: string
  address: string
  phone: string
  lat?: number
  lng?: number
  hours?: string
}

export type News = {
  id: string
  category: string
  title: string
  summary?: string
  publishedAt: string
  contentHtml: string
}

export type Inquiry = {
  type: 'product' | 'general' | 'corporate'
  name: string
  phone: string
  email?: string
  title: string
  message: string
  attachments?: string[]
}
