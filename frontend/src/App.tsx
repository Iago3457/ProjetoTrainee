import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import MinhasMateriasPage from './pages/MinhasMateriasPage'
import { Page } from './types'

import { Toaster } from 'react-hot-toast'

export default function App() {
  const [page, setPage] = useState<Page>('login')

  const renderPage = () => {
    if (page === 'signup') return <SignupPage onNavigate={setPage} />
    if (page === 'minhas-materias') return <MinhasMateriasPage onNavigate={setPage} />
    if (page === 'dashboard') return <DashboardPage onNavigate={setPage} />
    return <LoginPage onNavigate={setPage} />
  }

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0D0C15',
            border: '1px solid #EAEAEF',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            padding: '16px',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#3525cd',
              secondary: '#ffffff',
            },
          },
        }}
      />
      {renderPage()}
    </>
  )
}
