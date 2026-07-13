import { Page } from '../types'

interface AdminDashboardPageProps {
  onNavigate?: (page: Page) => void
}

export default function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  return (
    <div className="min-h-screen bg-[#0D0C15] flex items-center justify-center">
      <p className="text-white text-lg">Carregando painel administrativo...</p>
    </div>
  )
}
