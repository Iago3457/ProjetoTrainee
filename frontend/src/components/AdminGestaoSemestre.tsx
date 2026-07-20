import { useState, useEffect } from 'react';
import { adminService, AlunoMatriculaSemestre } from '../services/admin.service';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '../assets/icons';
import ConfirmModal from './ConfirmModal';

export default function AdminGestaoSemestre() {
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState<number>(2026);
    const [semestre, setSemestre] = useState<number>(1);
    const [disciplinas, setDisciplinas] = useState<AlunoMatriculaSemestre[]>([]);
    
    // Matrículas com status alterado antes de salvar
    const [mudancasStatus, setMudancasStatus] = useState<Record<string, string>>({});

    const [isAvançarModalOpen, setIsAvançarModalOpen] = useState(false);
    const [temPendencias, setTemPendencias] = useState(false);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const atual = await adminService.obterSemestreAtual();
            setAno(atual.ano);
            setSemestre(atual.semestre);

            const dados = await adminService.listarAlunosMatriculas(atual.ano, atual.semestre);
            setDisciplinas(dados);
            setMudancasStatus({});
        } catch (error) {
            toast.error('Erro ao carregar matrículas do semestre.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const handleStatusChange = (matriculaId: string, novoStatus: string) => {
        setMudancasStatus(prev => ({
            ...prev,
            [matriculaId]: novoStatus
        }));
    };

    const handleSalvarAlteracoes = async () => {
        const payload = Object.entries(mudancasStatus).map(([matriculaId, status]) => ({
            matriculaId,
            status
        }));

        if (payload.length === 0) {
            toast.success('Nenhuma alteração para salvar.');
            return;
        }

        try {
            await adminService.definirStatusMatriculas(payload);
            toast.success('Status salvos com sucesso!');
            carregarDados();
        } catch (error) {
            toast.error('Erro ao salvar status.');
        }
    };

    const verificarPendenciasEAbrirModal = () => {
        // Verifica se ainda existe alguma matrícula 'inscrito' ou 'requisitada' 
        // levando em conta o estado local que ainda não foi salvo
        let pendentes = false;

        for (const d of disciplinas) {
            for (const m of d.matriculas) {
                const statusLocal = mudancasStatus[m.matriculaId] || m.status;
                if (statusLocal === 'inscrito' || statusLocal === 'requisitada') {
                    pendentes = true;
                    break;
                }
            }
            if (pendentes) break;
        }

        setTemPendencias(pendentes);
        setIsAvançarModalOpen(true);
    };

    const handleAvancarSemestre = async () => {
        try {
            const result = await adminService.avancarSemestre();
            toast.success(`Avançado para ${result.novoSemestre.ano}.${result.novoSemestre.semestre}`);
            setIsAvançarModalOpen(false);
            carregarDados();
        } catch (error) {
            toast.error('Erro ao avançar semestre.');
        }
    };

    const proxSemestreText = semestre === 1 ? `${ano}.2` : `${ano + 1}.1`;
    const mensagemAviso = temPendencias
        ? `Você ainda tem alunos sem nota definida (inscritos). Se você avançar, eles serão marcados como reprovados automaticamente. Tem certeza que deseja avançar para o semestre ${proxSemestreText}?`
        : `Deseja avançar o sistema para o semestre ${proxSemestreText}?`;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Gestão de Semestre</h2>
                    <p className="text-sm text-[#9794A8]">
                        Semestre Ativo: <span className="font-semibold text-brand-primary">{ano}.{semestre}</span>
                    </p>
                </div>
                
                <div className="flex gap-4">
                    <button
                        onClick={handleSalvarAlteracoes}
                        disabled={Object.keys(mudancasStatus).length === 0}
                        className="bg-[#2A2940] hover:bg-[#34334A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                        Salvar Alterações
                    </button>
                    <button
                        onClick={verificarPendenciasEAbrirModal}
                        className="bg-brand-primary hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                        Avançar Semestre
                    </button>
                </div>
            </div>

            <div className="bg-[#1A1929] border border-[#2A2940] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-[#9794A8]">Carregando matrículas...</div>
                ) : disciplinas.length === 0 ? (
                    <div className="p-12 text-center text-[#9794A8]">Nenhuma disciplina com inscritos neste semestre.</div>
                ) : (
                    <div className="divide-y divide-[#2A2940]">
                        {disciplinas.map(d => (
                            <div key={d.disciplina.id} className="p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    <span className="text-brand-primary mr-2">{d.disciplina.codigo}</span> 
                                    {d.disciplina.nome}
                                </h3>
                                
                                <div className="overflow-x-auto border border-[#2A2940] rounded-lg">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#12111E]/50 border-b border-[#2A2940] text-xs uppercase tracking-wider text-[#9794A8]">
                                                <th className="px-4 py-3 font-medium">Aluno</th>
                                                <th className="px-4 py-3 font-medium">RA</th>
                                                <th className="px-4 py-3 font-medium">Status Atual</th>
                                                <th className="px-4 py-3 font-medium text-right">Lançar Nota</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2A2940]">
                                            {d.matriculas.map(m => {
                                                const currentStatus = mudancasStatus[m.matriculaId] || m.status;
                                                return (
                                                    <tr key={m.matriculaId} className="hover:bg-[#201F31] transition-colors">
                                                        <td className="px-4 py-3 text-sm font-medium text-white">{m.aluno.nome}</td>
                                                        <td className="px-4 py-3 text-sm text-[#B0ADC0]">{m.aluno.ra}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {currentStatus === 'aprovado' || currentStatus === 'concluida' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                                                                    <CheckCircleIcon className="w-3.5 h-3.5" /> Aprovado
                                                                </span>
                                                            ) : currentStatus === 'reprovado' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 font-medium">
                                                                    <XCircleIcon className="w-3.5 h-3.5" /> Reprovado
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-medium">
                                                                    <ClockIcon className="w-3.5 h-3.5" /> {currentStatus === 'requisitada' ? 'Requisitada' : 'Inscrito'}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right">
                                                            <select
                                                                value={currentStatus}
                                                                onChange={(e) => handleStatusChange(m.matriculaId, e.target.value)}
                                                                className="bg-[#12111E] border border-[#2A2940] text-white text-sm rounded-lg p-2 outline-none focus:border-brand-primary"
                                                            >
                                                                <option value="inscrito">Inscrito (Sem Nota)</option>
                                                                <option value="aprovado">Aprovado</option>
                                                                <option value="reprovado">Reprovado</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={isAvançarModalOpen}
                onClose={() => setIsAvançarModalOpen(false)}
                onConfirm={handleAvancarSemestre}
                title="Avançar Semestre"
                message={mensagemAviso}
                confirmText={temPendencias ? 'Sim, reprovar e avançar' : 'Sim, avançar semestre'}
                cancelText="Cancelar"
                isDestructive={temPendencias}
            />
        </div>
    );
}
