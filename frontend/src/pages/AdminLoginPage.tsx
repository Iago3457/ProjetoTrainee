import { useState } from 'react'
import { GraduationCapIcon, EmailIcon, LockIcon, ArrowRightIcon } from '../assets/icons'
import InputField from '../components/InputField'
import { Page } from '../types'
import { adminService } from '../services/admin.service'

interface AdminLoginPageProps {
  onNavigate?: (page: Page) => void
}

export default function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    try {
      const data = await adminService.login(email, senha)
      localStorage.setItem('access_token', data.access_token)
      onNavigate?.('admin-dashboard')
    } catch (error: any) {
      const msg = error.response?.data?.message
      const mensagem = Array.isArray(msg) ? msg.join('\n') : msg || 'Credenciais inválidas'
      setErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0D0C15] flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="bg-[#1A1929] border border-[#2A2940] rounded-xl drop-shadow-[0px_4px_24px_rgba(0,0,0,0.3)] flex flex-col gap-8 p-6 sm:p-[33px]">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="bg-brand-primary/15 flex items-center justify-center w-12 py-[10px] rounded-xl">
              <GraduationCapIcon color="#8B7CF7" />
            </div>

            <div className="flex flex-col items-center w-full pt-3">
              <h1 className="font-bold text-[30px] text-white tracking-[-0.6px] leading-[38px] text-center w-full">
                MatriculaFácil
              </h1>
              <p className="text-base text-[#9794A8] leading-6 text-center">
                Painel Administrativo
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            {erro && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 whitespace-pre-line">
                {erro}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#B0ADC0] leading-5">E-mail</label>
              <div className="flex items-center gap-2 border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] focus-within:border-brand-primary/50 transition-colors">
                <EmailIcon />
                <input
                  type="email"
                  placeholder="admin@ufscar.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#555367] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#B0ADC0] leading-5">Senha</label>
              <div className="flex items-center gap-2 border border-[#2A2940] rounded-lg px-3 py-2 bg-[#12111E] focus-within:border-brand-primary/50 transition-colors">
                <LockIcon />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#555367] outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-medium text-sm leading-5 px-4 py-2.5 rounded-lg hover:bg-indigo-500 active:bg-indigo-600 transition-colors disabled:opacity-50"
              >
                {carregando ? 'Entrando...' : 'Entrar como Admin'}
                <ArrowRightIcon />
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-[#2A2940] w-full pt-[25px]">
            <div className="flex items-center justify-center gap-1">
              <span className="text-base text-[#9794A8] leading-6">
                É aluno?
              </span>
              <button
                type="button"
                onClick={() => onNavigate?.('login')}
                className="font-medium text-sm text-brand-primary leading-5 hover:underline"
              >
                Portal do Aluno
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
