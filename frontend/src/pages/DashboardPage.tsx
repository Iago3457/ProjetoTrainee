import DashboardHeader from '../components/DashboardHeader'
import CatalogHeading from '../components/CatalogHeading'
import CreditPanel from '../components/CreditPanel'
import FilterPill from '../components/FilterPill'
import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import DisciplinaCard from '../components/DisciplinaCard'
import { FilterIcon } from '../assets/icons'
import { disciplinasService } from '../services/disciplinas.service'
import { User } from '../types'
import { DisciplinaCardProps } from '../components/DisciplinaCard'

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('periodo');
  const [user, setUser] = useState<User | null>(null);
  const [disciplinas, setDisciplinas] = useState<DisciplinaCardProps[]>([]);
  const [creditosAtuais, setCreditosAtuais] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErro('');
        
        // Obtém o perfil
        const perfil = await disciplinasService.getPerfil();
        
        // Obtém o catálogo de disciplinas
        const catalogo = await disciplinasService.listarCatalogo(perfil.id);
        
        // Mapear UserProfile para a interface User do frontend
        const mappedUser: User = {
          id: 0,
          name: perfil.nome,
          email: perfil.email,
          matricula: perfil.ra,
          curso: perfil.curso || 'Ciência da Computação',
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
    }

    loadData();
  }, []);

  const filters = [
    { id: 'todos', label: 'Todos os Departamentos', icon: <FilterIcon /> },
    { id: 'periodo', label: `Período Ideal: ${user?.periodo || '4º Semestre'}` },
  ]

  const filteredDisciplinas = disciplinas.filter((d) => {
    const matchesSearch = d.nome.toLowerCase().includes(search.toLowerCase()) ||
                          d.codigo.toLowerCase().includes(search.toLowerCase());
    
    // Se o filtro de período ideal estiver ativo, e caso tivéssemos dados de período na disciplina,
    // poderíamos aplicar um filtro extra aqui. Como não há, a busca textual já funciona perfeitamente.
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ui-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ui-medium font-medium">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (erro) {
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
      {user && <DashboardHeader user={user} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top row: Heading + Credit Panel */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 sm:gap-6">
          <CatalogHeading semestre={user?.semestre || '2026.1'} />

          <div className="w-full md:w-auto shrink-0">
            <CreditPanel creditosAtuais={creditosAtuais} limiteCreditos={24} />
          </div>
        </div>

        {/* Filter row: Filters left, Search right */}
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filter pills — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap">
            {filters.map((filter) => (
              <FilterPill 
                key={filter.id} 
                label={filter.label} 
                isActive={activeFilter === filter.id} 
                onClick={() => setActiveFilter(filter.id)}
                icon={filter.icon}
              />
            ))}
          </div>

          {/* Search bar */}
          <SearchBar 
            search={search} 
            setSearch={setSearch}
          />
        </div>

        {/* Cards grid */}
        {filteredDisciplinas.length === 0 ? (
          <div className="mt-12 text-center py-12 border-2 border-dashed border-ui-border rounded-xl">
            <p className="text-ui-medium font-medium">Nenhuma disciplina encontrada.</p>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDisciplinas.map((disciplina) => (
              <DisciplinaCard key={disciplina.codigo} {...disciplina} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
