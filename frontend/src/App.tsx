import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import MinhasMateriasPage from './pages/MinhasMateriasPage'
import { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>('login')

  if (page === 'signup') return <SignupPage onNavigate={setPage} />
  if (page === 'minhas-materias') return <MinhasMateriasPage onNavigate={setPage} />
  if (page === 'dashboard') return <DashboardPage onNavigate={setPage} />
  return <LoginPage onNavigate={setPage} />
}
