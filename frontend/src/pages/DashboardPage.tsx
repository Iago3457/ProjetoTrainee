import DashboardHeader from '../components/DashboardHeader'
import CatalogHeading from '../components/CatalogHeading'
import CreditPanel from '../components/CreditPanel'
import FilterDropdown from '../components/FilterDropdown'
import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import DisciplinaCard from '../components/DisciplinaCard'
import { FilterIcon } from '../assets/icons'
import { disciplinasService } from '../services/disciplinas.service'
import { User, Page } from '../types'
import { DisciplinaCardProps } from '../components/DisciplinaCard'
import { matriculasService } from '../services/matriculas.service'
import DisciplinaDetailModal from '../components/DisciplinaDetailModal'
import { toast } from 'react-hot-toast'

interface DashboardPageProps {
  onNavigate?: (page: Page) => void
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [search, setSearch] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string | null>(null);
  const [filtroDepartamento, setFiltroDepartamento] = useState<string | null>('todos');
  const [user, setUser] = useState<User | null>(null);
  const [disciplinas, setDisciplinas] = useState<DisciplinaCardProps[]>([]);
  const [creditosAtuais, setCreditosAtuais] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [enrolling, setEnrollingId] = useState<string | null>(null);
  const [showConcluidas, setShowConcluidas] = useState(false);
  const [showIndisponiveis, setShowIndisponiveis] = useState(false);
  const [showOutrosCursos, setShowOutrosCursos] = useState(false);
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setErro('');
      
      const perfil = await disciplinasService.getPerfil();
      const catalogo = await disciplinasService.listarCatalogo(perfil.id);
      
      const mappedUser: User = {
        id: perfil.id,
        name: perfil.nome,
        email: perfil.email,
        matricula: perfil.ra,
        curso: perfil.curso?.nome || 'Ciência da Computação',
        periodo: perfil.periodo,
        semestre: perfil.semestre,
        password: '',
        avatar: perfil.avatar,
        creditos: catalogo.creditosAtuais
      };
      
      setUser(mappedUser);
      setDisciplinas(catalogo.disciplinas);
      setCreditosAtuais(catalogo.creditosAtuais);
    } catch (err: any) {
      console.error(err);
      setErro(
        err.response?.data?.message || 
        err.message || 
        'Falha ao carregar dados do catálogo.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const refreshCatalogo = async () => {
    if (user) {
      const dadosAtualizados = await disciplinasService.listarCatalogo(user.id.toString());
      setDisciplinas(dadosAtualizados.disciplinas);
      setCreditosAtuais(dadosAtualizados.creditosAtuais);
    }
  };

  const handleInscrever = async(disciplinaId: string) => {
    try {
      setEnrollingId(disciplinaId);
      const res = await matriculasService.inscrever(disciplinaId);
      toast.success(res.mensagem || 'Inscrição requisitada com sucesso');
      await refreshCatalogo();
    } catch (error: any) {
      const mensagemErro = error.response?.data?.message || 'Erro ao inscrever-se na disciplina';
      toast.error(mensagemErro);
    } finally {
      setEnrollingId(null);
    }
  }

  const defaultPeriodLabel = 'Todos os Períodos';

  const periodOptions = [
    { id: 'todos', label: 'Todos os Períodos' },
    { id: '1', label: '1º Semestre' },
    { id: '2', label: '2º Semestre' },
    { id: '3', label: '3º Semestre' },
    { id: '4', label: '4º Semestre' },
    { id: '5', label: '5º Semestre' },
    { id: '6', label: '6º Semestre' },
    { id: '7', label: '7º Semestre' },
    { id: '8', label: '8º Semestre' },
  ];

  const deptOptions = [
    { id: 'todos', label: 'Todos os Departamentos' },
    { id: 'DC', label: 'Departamento DC' },
    { id: 'DM', label: 'Departamento DM' },
    { id: 'DEs', label: 'Departamento DEs' },
  ];

  const filteredDisciplinas = disciplinas.filter((d) => {
    if (!showConcluidas && d.statusInscricao === 'concluido') return false;
    if (!showIndisponiveis && d.statusInscricao === 'indisponivel') return false;
    if (!showOutrosCursos && d.doCursoDoAluno === false) return false;


    if (filtroPeriodo && filtroPeriodo !== 'todos') {
      if (d.periodoIdeal !== parseInt(filtroPeriodo)) return false;
    }


    if (filtroDepartamento && filtroDepartamento !== 'todos') {
      if (d.departamento !== filtroDepartamento) return false;
    }

    const matchesSearch = d.nome.toLowerCase().includes(search.toLowerCase()) ||
                          d.codigo.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-ui-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ui-medium font-medium">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (erro && !user) {
    return (
      <div className="min-h-screen bg-ui-bg flex items-center justify-center p-4">
        <div className="bg-white border border-ui-border rounded-xl p-6 max-w-md w-full shadow-sm text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="font-bold text-lg text-ui-dark mb-2">Erro ao carregar dados</h3>
          <p className="text-ui-medium text-sm mb-6">{erro}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-brand-primary text-white font-medium text-sm py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ui-bg">
      {user && <DashboardHeader user={user} activePage="catalogo" onNavigate={onNavigate} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 sm:gap-6">
          <CatalogHeading semestre={user?.semestre || '2026.1'} />

          <div className="w-full md:w-auto shrink-0">
            <CreditPanel creditosAtuais={creditosAtuais} limiteCreditos={24} />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap">
            <FilterDropdown
              label={defaultPeriodLabel}
              options={periodOptions}
              activeOptionId={filtroPeriodo}
              onSelect={(id) => setFiltroPeriodo(id)}
              isActive={filtroPeriodo !== 'todos'}
            />
            
            <FilterDropdown
              label="Todos os Departamentos"
              icon={<FilterIcon />}
              options={deptOptions}
              activeOptionId={filtroDepartamento}
              onSelect={(id) => setFiltroDepartamento(id)}
              isActive={filtroDepartamento !== 'todos' && filtroDepartamento !== null}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1 text-sm text-ui-medium font-medium mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer hover:text-ui-dark transition-colors">
                <input 
                  type="checkbox" 
                  checked={showConcluidas} 
                  onChange={(e) => setShowConcluidas(e.target.checked)} 
                  className="w-4 h-4 rounded border-ui-border text-brand-primary focus:ring-brand-primary"
                />
                Mostrar matérias concluídas
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-ui-dark transition-colors">
                <input 
                  type="checkbox" 
                  checked={showIndisponiveis} 
                  onChange={(e) => setShowIndisponiveis(e.target.checked)} 
                  className="w-4 h-4 rounded border-ui-border text-brand-primary focus:ring-brand-primary"
                />
                Mostrar matérias indisponíveis
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-ui-dark transition-colors">
                <input 
                  type="checkbox" 
                  checked={showOutrosCursos} 
                  onChange={(e) => setShowOutrosCursos(e.target.checked)} 
                  className="w-4 h-4 rounded border-ui-border text-brand-primary focus:ring-brand-primary"
                />
                Mostrar matérias de outros cursos
              </label>
            </div>
            <SearchBar 
              search={search} 
              setSearch={setSearch}
            />
          </div>
        </div>

        {filteredDisciplinas.length === 0 ? (
          <div className="mt-12 text-center py-12 border-2 border-dashed border-ui-border rounded-xl">
            <p className="text-ui-medium font-medium">Nenhuma disciplina encontrada.</p>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDisciplinas.map((disciplina) => (
              <DisciplinaCard 
                key={disciplina.codigo} 
                {...disciplina} 
                onInscrever={() => handleInscrever(disciplina.id)} 
                isEnrolling={enrolling === disciplina.id}
                onVerDetalhes={() => setSelectedDisciplinaId(disciplina.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedDisciplinaId && (
        <DisciplinaDetailModal 
          disciplinaId={selectedDisciplinaId}
          onClose={() => setSelectedDisciplinaId(null)}
          onInscricaoSuccess={refreshCatalogo}
        />
      )}
    </div>
  )
}
