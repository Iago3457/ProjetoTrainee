import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import DashboardHeader from '../components/DashboardHeader'
import { disciplinasService } from '../services/disciplinas.service'
import { User, Page } from '../types'
import { UserIcon } from '../assets/icons'

interface PerfilPageProps {
  onNavigate?: (page: Page) => void
}

export default function PerfilPage({ onNavigate }: PerfilPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [savingAvatar, setSavingAvatar] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setErro('');
      const perfil = await disciplinasService.getPerfil();
      
      const mappedUser: User = {
        id: perfil.id,
        name: perfil.nome,
        email: perfil.email,
        matricula: perfil.ra,
        curso: perfil.curso || 'Bacharelado em Ciência da Computação',
        periodo: perfil.periodo,
        semestre: perfil.semestre,
        password: '',
        avatar: perfil.avatar,
        creditos: 0,
      };

      setUser(mappedUser);
      setNewAvatarUrl(perfil.avatar || '');
    } catch (err: any) {
      setErro('Falha ao carregar perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAvatar(true);
      const res = await disciplinasService.atualizarAvatar(newAvatarUrl);
      toast.success(res.mensagem);
      setUser(prev => prev ? { ...prev, avatar: res.avatarUrl } : null);
      setIsEditingAvatar(false);
    } catch (err: any) {
      toast.error('Erro ao atualizar imagem de perfil.');
    } finally {
      setSavingAvatar(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-ui-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ui-medium font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ui-bg pb-24 sm:pb-10">
      {user && <DashboardHeader user={user} activePage="perfil" onNavigate={onNavigate} />}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-ui-dark tracking-tight">Meu Perfil</h1>
          <p className="text-ui-medium text-sm sm:text-base mt-1">Gerencie suas informações e sua foto de perfil.</p>
        </div>

        {erro ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{erro}</div>
        ) : user ? (
          <div className="bg-white border border-ui-border rounded-xl shadow-sm overflow-hidden">
            {/* Header / Avatar Area */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-ui-border">
              <div className="relative group">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Foto de perfil" 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-ui-bg"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-brand-light flex items-center justify-center border-4 border-white shadow-md text-brand-primary">
                    <UserIcon width={48} height={48} color="currentColor" />
                  </div>
                )}
                <button 
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                  className="absolute bottom-0 right-0 bg-brand-primary text-white p-2 rounded-full shadow-lg hover:bg-brand-secondary transition-colors"
                  title="Alterar foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-ui-dark">{user.name}</h2>
                <p className="text-ui-medium mt-1">{user.email}</p>
                
                {isEditingAvatar && (
                  <form onSubmit={handleUpdateAvatar} className="mt-4 flex gap-2 w-full max-w-md">
                    <input 
                      type="url" 
                      placeholder="Cole a URL da nova imagem..." 
                      value={newAvatarUrl}
                      onChange={(e) => setNewAvatarUrl(e.target.value)}
                      className="flex-1 bg-ui-bg border border-ui-border rounded-lg px-3 py-2 text-sm text-ui-dark placeholder:text-ui-muted outline-none focus:border-brand-primary transition-colors"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={savingAvatar}
                      className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50"
                    >
                      {savingAvatar ? 'Salvando...' : 'Salvar'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* User Info Area */}
            <div className="p-6 sm:p-8 bg-ui-bg/30">
              <h3 className="text-lg font-bold text-ui-dark mb-4">Informações Acadêmicas</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm font-medium text-ui-muted">Registro Acadêmico (RA)</p>
                  <p className="mt-1 text-ui-dark font-medium">{user.matricula}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ui-muted">Curso</p>
                  <p className="mt-1 text-ui-dark font-medium">{user.curso}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ui-muted">Período Ideal</p>
                  <p className="mt-1 text-ui-dark font-medium">{user.periodo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ui-muted">Semestre de Ingresso/Atual</p>
                  <p className="mt-1 text-ui-dark font-medium">{user.semestre}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
