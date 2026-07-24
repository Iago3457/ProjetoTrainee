import { useState, useEffect } from 'react';
import { adminService, Curso } from '../services/admin.service';
import { toast } from 'react-hot-toast';
import { EditIcon, TrashIcon, PlusIcon } from '../assets/icons';

export default function AdminCursosTab() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);

  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const data = await adminService.listarCursos();
      setCursos(data);
    } catch (error) {
      toast.error('Erro ao carregar cursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  const handleNovoCurso = () => {
    setCursoEditando(null);
    setNome('');
    setCodigo('');
    setIsModalOpen(true);
  };

  const handleEditarCurso = (curso: Curso) => {
    setCursoEditando(curso);
    setNome(curso.nome);
    setCodigo(curso.codigo);
    setIsModalOpen(true);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSalvando(true);
      if (cursoEditando) {
        await adminService.atualizarCurso(cursoEditando.id, { nome, codigo });
        toast.success('Curso atualizado!');
      } else {
        await adminService.criarCurso({ nome, codigo });
        toast.success('Curso criado!');
      }
      setIsModalOpen(false);
      carregarCursos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar curso');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirCurso = async (curso: Curso) => {
    if (curso._count?.alunos && curso._count.alunos > 0) {
      toast.error('Não é possível excluir um curso que possui alunos vinculados.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await adminService.excluirCurso(curso.id);
        toast.success('Curso excluído!');
        carregarCursos();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao excluir');
      }
    }
  };

  return (
    <div className="bg-[#1A1929] border border-[#2A2940] rounded-xl overflow-hidden w-full">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2940]">
        <div>
          <h2 className="text-xl font-bold text-white">Gestão de Cursos</h2>
          <p className="text-sm text-[#9794A8]">
            Adicione e edite os cursos disponíveis na instituição.
          </p>
        </div>
        <button
          onClick={handleNovoCurso}
          className="flex items-center gap-2 bg-brand-primary hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Novo Curso
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-[#9794A8]">Carregando cursos...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#12111E]/50 border-b border-[#2A2940] text-xs uppercase tracking-wider text-[#9794A8]">
                <th className="px-6 py-4 font-medium">Código</th>
                <th className="px-6 py-4 font-medium">Nome do Curso</th>
                <th className="px-6 py-4 font-medium text-center">Disciplinas Vinculadas</th>
                <th className="px-6 py-4 font-medium text-center">Alunos Inscritos</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2940]">
              {cursos.map(curso => (
                <tr key={curso.id} className="hover:bg-[#201F31] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                      {curso.codigo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{curso.nome}</p>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-[#B0ADC0]">
                    {curso._count?.disciplinas || 0}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-[#B0ADC0]">
                    {curso._count?.alunos || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditarCurso(curso)}
                        className="p-1.5 text-[#9794A8] hover:text-white hover:bg-[#2A2940] rounded transition-colors"
                        title="Editar"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExcluirCurso(curso)}
                        className="p-1.5 text-[#9794A8] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Excluir"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cursos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9794A8] text-sm">
                    Nenhum curso encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1929] border border-[#2A2940] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-[#2A2940] flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">
                {cursoEditando ? 'Editar Curso' : 'Novo Curso'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#9794A8] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#B0ADC0]">Código do Curso *</label>
                <input
                  type="text"
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: BCC"
                  className="bg-[#12111E] border border-[#2A2940] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#B0ADC0]">Nome do Curso *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Bacharelado em Ciência da Computação"
                  className="bg-[#12111E] border border-[#2A2940] text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#B0ADC0] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="bg-brand-primary text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {salvando ? 'Salvando...' : 'Salvar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
