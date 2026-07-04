import DashboardHeader from '../components/DashboardHeader'
import MinhasMateriasHeading from '../components/MinhasMateriasHeading'
import CreditPanel from '../components/CreditPanel'
import MatriculaCard from '../components/MatriculaCard'
import { PrinterIcon } from '../assets/icons'
import { useState, useEffect } from 'react'
import { disciplinasService } from '../services/disciplinas.service'
import { matriculasService, MinhaMateria } from '../services/matriculas.service'
import { User, Page } from '../types'

interface MinhasMateriasPageProps {
  onNavigate?: (page: Page) => void
}

export default function MinhasMateriasPage({ onNavigate }: MinhasMateriasPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [materias, setMaterias] = useState<MinhaMateria[]>([]);
  const [creditosAtuais, setCreditosAtuais] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setErro('');

      const perfil = await disciplinasService.getPerfil();
      const dados = await matriculasService.listarMinhas();

      const mappedUser: User = {
        id: perfil.id,
        name: perfil.nome,
        email: perfil.email,
        matricula: perfil.ra,
        curso: perfil.curso || 'Ciência da Computação',
        periodo: perfil.periodo,
        semestre: perfil.semestre,
        password: '',
        avatar: perfil.avatar,
        creditos: dados.creditosAtuais,
      };

      setUser(mappedUser);
      setMaterias(dados.materias);
      setCreditosAtuais(dados.creditosAtuais);
    } catch (err: any) {
      console.error(err);
      setErro(
        err.response?.data?.message ||
        err.message ||
        'Falha ao carregar suas matérias.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelar = async (matriculaId: string) => {
    const confirmacao = window.confirm('Tem certeza que deseja cancelar esta inscrição?');
    if (!confirmacao) return;

    try {
      setCancelingId(matriculaId);
      await matriculasService.cancelarInscricao(matriculaId);
      alert('Inscrição cancelada com sucesso!');
      await loadData();
    } catch (error: any) {
      const mensagemErro = error.response?.data?.message || 'Erro ao cancelar inscrição';
      alert(mensagemErro);
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ui-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ui-medium font-medium">Carregando suas matérias...</p>
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
    <div className="min-h-screen bg-ui-bg pb-24 sm:pb-10">
      {user && <DashboardHeader user={user} activePage="minhas-materias" onNavigate={onNavigate} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top row: Heading + Credit Panel */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 sm:gap-6">
          <MinhasMateriasHeading semestre={user?.semestre || '2026.1'} />

          <div className="w-full md:w-auto shrink-0">
            <CreditPanel creditosAtuais={creditosAtuais} limiteCreditos={24} />
          </div>
        </div>

        {/* Mobile: Credit info text */}
        <div className="sm:hidden mt-3 text-xs text-ui-muted bg-white border border-ui-border rounded-lg p-3">
          Você está dentro do limite recomendado de créditos.
        </div>

        {/* Cards grid */}
        {materias.length === 0 ? (
          <div className="mt-12 text-center py-12 border-2 border-dashed border-ui-border rounded-xl">
            <p className="text-ui-medium font-medium">Você ainda não está inscrito em nenhuma disciplina.</p>
            <p className="text-ui-muted text-sm mt-2">Acesse o catálogo para se inscrever.</p>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {materias.map((materia) => (
              <MatriculaCard
                key={materia.matriculaId}
                {...materia}
                onCancelar={handleCancelar}
                isCanceling={cancelingId === materia.matriculaId}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile: Imprimir Comprovante button */}
      {materias.length > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ui-border px-4 py-3 z-10">
          <button className="w-full flex items-center justify-center gap-2 bg-ui-dark text-white font-semibold text-sm py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all">
            <PrinterIcon className="text-white" />
            Imprimir Comprovante
          </button>
        </div>
      )}
    </div>
  )
}
