import { createBrowserRouter, Navigate } from 'react-router-dom'
import { App } from '@/app/App'

import { HomePage } from '@/routes/home/HomePage'
import { PricesHubPage } from '@/routes/prices/PricesHubPage'
import { PricePage } from '@/routes/prices/PricePage'
import { ProductsHubPage } from '@/routes/products/ProductsHubPage'
import { ProductCategoryPage } from '@/routes/products/ProductCategoryPage'
import { ProductDetailPage } from '@/routes/products/ProductDetailPage'
import { StoresPage } from '@/routes/stores/StoresPage'
import { RefiningPage } from '@/routes/refining/RefiningPage'
import { NewsListPage } from '@/routes/news/NewsListPage'
import { NewsDetailPage } from '@/routes/news/NewsDetailPage'
import { SupportHubPage } from '@/routes/support/SupportHubPage'
import { NoticeListPage } from '@/routes/support/NoticeListPage'
import { NoticeDetailPage } from '@/routes/support/NoticeDetailPage'
import { FaqPage } from '@/routes/support/FaqPage'
import { InquiryPage } from '@/routes/support/InquiryPage'
import { AboutPage } from '@/routes/about/AboutPage'
import { CareersPage } from '@/routes/careers/CareersPage'
import { FranchisePage } from '@/routes/franchise/FranchisePage'
import { LegalPage } from '@/routes/legal/LegalPage'
import { NotFoundPage } from '@/routes/_shared/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />, // simple fallback
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'prices',
        children: [
          { index: true, element: <PricesHubPage /> },
          { path: 'gold', element: <PricePage kind="gold" /> },
          { path: 'silver', element: <PricePage kind="silver" /> },
          { path: 'platinum', element: <PricePage kind="platinum" /> },
          { path: 'benchmark', element: <PricePage kind="benchmark" /> },
          { path: 'live', element: <PricePage kind="live" /> },
          { path: 'diamond', element: <PricePage kind="diamond" /> },
          { path: 'lab-diamond', element: <PricePage kind="lab-diamond" /> },
          { path: 'securities', element: <PricePage kind="securities" /> }
        ]
      },
      {
        path: 'products',
        children: [
          { index: true, element: <ProductsHubPage /> },
          { path: 'gold-bar', element: <ProductCategoryPage category="gold-bar" /> },
          { path: 'silver-bar', element: <ProductCategoryPage category="silver-bar" /> },
          { path: 'coins', element: <ProductCategoryPage category="coins" /> },
          { path: 'gifts', element: <ProductCategoryPage category="gifts" /> },
          { path: 'diamond', element: <ProductCategoryPage category="diamond" /> },
          { path: ':id', element: <ProductDetailPage /> }
        ]
      },
      { path: 'stores', element: <StoresPage /> },
      { path: 'refining', element: <RefiningPage /> },
      {
        path: 'news',
        children: [
          { index: true, element: <NewsListPage /> },
          { path: ':id', element: <NewsDetailPage /> }
        ]
      },
      {
        path: 'support',
        children: [
          { index: true, element: <SupportHubPage /> },
          {
            path: 'notice',
            children: [
              { index: true, element: <NoticeListPage /> },
              { path: ':id', element: <NoticeDetailPage /> }
            ]
          },
          { path: 'faq', element: <FaqPage /> },
          { path: 'inquiry/product', element: <InquiryPage type="product" /> },
          { path: 'inquiry/general', element: <InquiryPage type="general" /> },
          { path: 'inquiry/corporate', element: <InquiryPage type="corporate" /> },
          { path: '*', element: <Navigate to="/support" replace /> }
        ]
      },
      {
        path: 'about',
        children: [
          { path: 'company', element: <AboutPage kind="company" /> },
          { path: 'history', element: <AboutPage kind="history" /> },
          { path: 'office', element: <AboutPage kind="office" /> },
          { path: 'organization', element: <AboutPage kind="organization" /> },
          { path: 'why', element: <AboutPage kind="why" /> },
          { path: 'sell-guide', element: <AboutPage kind="sell-guide" /> }
        ]
      },
      { path: 'careers', element: <CareersPage /> },
      { path: 'franchise', element: <FranchisePage /> },
      {
        path: 'legal',
        children: [
          { path: 'terms', element: <LegalPage kind="terms" /> },
          { path: 'privacy', element: <LegalPage kind="privacy" /> }
        ]
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
])
