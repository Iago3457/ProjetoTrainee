import { useState, useEffect } from 'react'
import { Page } from '../types'
import { adminService, AdminDisciplina, MatriculaPendente } from '../services/admin.service'
import { GraduationCapIcon, SearchIcon, PlusIcon, EditIcon, TrashIcon, LogOutIcon, CheckCircleIcon, XCircleIcon, UsersIcon } from '../assets/icons'
import AdminDisciplinaModal from '../components/AdminDisciplinaModal'
import AdminAlunosModal from '../components/AdminAlunosModal'
import { toast } from 'react-hot-toast'
import { formatHorarios } from '../utils/horarioFormatter'

interface AdminDashboardPageProps {
  onNavigate?: (page: Page) => void
}

export default function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'aprovacoes'>('catalogo')
  const [disciplinas, setDisciplinas] = useState<AdminDisciplina[]>([])
  const [pendentes, setPendentes] = useState<MatriculaPendente[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAlunosModalOpen, setIsAlunosModalOpen] = useState(false)
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<AdminDisciplina | null>(null)
  const [disciplinaAlunosSelecionada, setDisciplinaAlunosSelecionada] = useState<AdminDisciplina | null>(null)

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [dataDisciplinas, dataPendentes] = await Promise.all([
        adminService.listarDisciplinas(),
        adminService.listarPendentes()
      ])
      setDisciplinas(dataDisciplinas)
      setPendentes(dataPendentes)
    } catch (error: any) {
      toast.error('Erro ao carregar dados do painel.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    if (onNavigate) {
      onNavigate('login');
    }
  }

  const handleNovaDisciplina = () => {
    setDisciplinaSelecionada(null)
    setIsModalOpen(true)
  }

  const handleEditarDisciplina = (d: AdminDisciplina) => {
    setDisciplinaSelecionada(d)
    setIsModalOpen(true)
  }

  const handleSalvarDisciplina = async (dados: any) => {
    if (disciplinaSelecionada) {
      await adminService.atualizarDisciplina(disciplinaSelecionada.id, dados)
      toast.success('Disciplina atualizada!')
    } else {
      await adminService.criarDisciplina(dados)
      toast.success('Disciplina criada!')
    }
    carregarDados()
  }

  const handleVerAlunos = (disciplina: AdminDisciplina) => {
    setDisciplinaAlunosSelecionada(disciplina)
    setIsAlunosModalOpen(true)
  }

  const handleExcluirDisciplina = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        await adminService.excluirDisciplina(id)
        toast.success('Disciplina excluída!')
        carregarDados()
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao excluir')
      }
    }
  }

  const handleAprovar = async (id: string) => {
    try {
      await adminService.aprovarMatricula(id)
      toast.success('Matrícula aprovada!')
      carregarDados()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao aprovar')
    }
  }

  const handleRejeitar = async (id: string) => {
    if (window.confirm('Tem certeza que deseja rejeitar essa matrícula?')) {
      try {
        await adminService.rejeitarMatricula(id)
        toast.success('Matrícula rejeitada!')
        carregarDados()
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao rejeitar')
      }
    }
  }

  const filteredDisciplinas = disciplinas.filter(d => 
    d.nome.toLowerCase().includes(search.toLowerCase()) || 
    d.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const filteredPendentes = pendentes.filter(p => 
    p.aluno.nome.toLowerCase().includes(search.toLowerCase()) || 
    p.aluno.ra.includes(search) ||
    p.disciplina.codigo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0D0C15] flex flex-col">
      
      {/* Header Admin */}
      <header className="bg-[#1A1929] border-b border-[#2A2940] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary/15 flex items-center justify-center w-9 h-9 rounded-lg">
                <GraduationCapIcon color="#8B7CF7" />
              </div>
              <div>
                <h1 className="font-bold text-white text-[15px] leading-tight">Painel Administrativo</h1>
                <p className="text-xs text-[#9794A8]">Gestão de Catálogo</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-6 mt-4">
            <button 
              onClick={() => setActiveTab('catalogo')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'catalogo' 
                  ? 'border-brand-primary text-white' 
                  : 'border-transparent text-[#9794A8] hover:text-[#B0ADC0]'
              }`}
            >
              Catálogo de Disciplinas
            </button>
            <button 
              onClick={() => setActiveTab('aprovacoes')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'aprovacoes' 
                  ? 'border-brand-primary text-white' 
                  : 'border-transparent text-[#9794A8] hover:text-[#B0ADC0]'
              }`}
            >
              Aprovações Pendentes
              {pendentes.length > 0 && (
                <span className="bg-brand-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendentes.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">
            {activeTab === 'catalogo' ? 'Disciplinas do Catálogo' : 'Aprovações Pendentes'}
          </h2>
          {activeTab === 'catalogo' && (
            <button 
              onClick={handleNovaDisciplina}
              className="flex items-center gap-2 bg-brand-primary hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Nova Disciplina
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-[#1A1929] border border-[#2A2940] rounded-t-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555367] w-4 h-4" />
            <input 
              type="text" 
              placeholder={activeTab === 'catalogo' ? "Buscar por código ou nome..." : "Buscar por aluno, RA ou disciplina..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#12111E] border border-[#2A2940] text-sm text-white rounded-lg pl-9 pr-4 py-2 focus:border-brand-primary/50 outline-none transition-colors"
            />
          </div>
          <div className="text-sm text-[#9794A8]">
            {activeTab === 'catalogo' 
              ? `${filteredDisciplinas.length} disciplinas`
              : `${filteredPendentes.length} requisições`
            }
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#1A1929] border-x border-b border-[#2A2940] rounded-b-xl overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-[#9794A8]">Carregando dados...</div>
          ) : activeTab === 'catalogo' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2940] text-xs uppercase tracking-wider text-[#9794A8] bg-[#12111E]/50">
                  <th className="px-6 py-4 font-medium">Código</th>
                  <th className="px-6 py-4 font-medium">Disciplina</th>
                  <th className="px-6 py-4 font-medium">Depto/Período</th>
                  <th className="px-6 py-4 font-medium">Lotação</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2940]">
                {filteredDisciplinas.map(d => {
                  const perc = Math.min(100, Math.round((d.vagasOcupadas / d.vagas) * 100))
                  const isFull = perc >= 100
                  
                  return (
                    <tr key={d.id} className="hover:bg-[#201F31] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                          {d.codigo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{d.nome}</p>
                        <p className="text-xs text-[#9794A8] mt-0.5">{d.creditos} Créditos • {d.horarios ? formatHorarios(d.horarios) : 'Sem horário'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0ADC0]">
                        {d.departamento || '-'} / {d.periodoIdeal ? `${d.periodoIdeal}º Sem` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 w-32">
                          <div className="flex justify-between text-xs">
                            <span className={isFull ? 'text-red-400 font-medium' : 'text-[#B0ADC0]'}>
                              {d.vagasOcupadas}/{d.vagas} vagas
                            </span>
                            <span className="text-[#9794A8]">{perc}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#2A2940] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-brand-primary'}`} 
                              style={{ width: `${perc}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleVerAlunos(d)}
                            className="p-1.5 text-[#9794A8] hover:text-brand-primary hover:bg-brand-primary/10 rounded transition-colors"
                            title="Ver Inscritos"
                          >
                            <UsersIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditarDisciplina(d)}
                            className="p-1.5 text-[#9794A8] hover:text-white hover:bg-[#2A2940] rounded transition-colors"
                            title="Editar"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleExcluirDisciplina(d.id)}
                            className="p-1.5 text-[#9794A8] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Excluir"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredDisciplinas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#9794A8] text-sm">
                      Nenhuma disciplina encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2940] text-xs uppercase tracking-wider text-[#9794A8] bg-[#12111E]/50">
                  <th className="px-6 py-4 font-medium">Aluno</th>
                  <th className="px-6 py-4 font-medium">Disciplina</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2940]">
                {filteredPendentes.map(p => {
                  const dataFormatada = new Date(p.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })
                  
                  return (
                    <tr key={p.id} className="hover:bg-[#201F31] transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">{p.aluno.nome}</p>
                        <p className="text-xs text-[#9794A8] mt-0.5">RA: {p.aluno.ra} • {p.aluno.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                          {p.disciplina.codigo}
                        </span>
                        <span className="text-sm text-white ml-2">{p.disciplina.nome}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B0ADC0]">
                        {dataFormatada}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleRejeitar(p.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded transition-colors border border-red-500/30"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            Rejeitar
                          </button>
                          <button 
                            onClick={() => handleAprovar(p.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors border border-emerald-500/30"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Aprovar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredPendentes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-[#9794A8] text-sm">
                      Nenhuma requisição pendente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>

      <AdminDisciplinaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSalvarDisciplina}
        disciplinaInicial={disciplinaSelecionada}
        todasDisciplinas={disciplinas}
      />

      <AdminAlunosModal 
        isOpen={isAlunosModalOpen}
        onClose={() => setIsAlunosModalOpen(false)}
        disciplina={disciplinaAlunosSelecionada}
      />
    </div>
  )
}
