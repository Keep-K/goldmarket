import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { FloatingCTA } from '@/components/ui/FloatingCTA'

export function App() {
  return (
    <ToastProvider>
      <div id="app" className="app">
        <a className="skip" href="#main">본문 바로가기</a>
        <Header />
        <main id="main" className="main" tabIndex={-1}>
          <div className="page">
            <Outlet />
          </div>
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </ToastProvider>
  )
}
