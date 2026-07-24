import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { disciplinasService, DisciplinaDetalhes } from '../services/disciplinas.service';
import { matriculasService } from '../services/matriculas.service';
import { XIcon, ClockIcon, CreditBookIcon, UserTeacherIcon, CheckCircleIcon, XCircleIcon } from '../assets/icons';
import Badge from './Badge';
import { formatHorarios } from '../utils/horarioFormatter';

interface DisciplinaDetailModalProps {
  disciplinaId: string;
  onClose: () => void;
  onInscricaoSuccess?: () => void;
}

export default function DisciplinaDetailModal({ disciplinaId, onClose, onInscricaoSuccess }: DisciplinaDetailModalProps) {
  const [detalhes, setDetalhes] = useState<DisciplinaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadDetalhes() {
      try {
        setLoading(true);
        const data = await disciplinasService.buscarDetalhes(disciplinaId);
        setDetalhes(data);
      } catch (err: any) {
        setErro(err.response?.data?.message || 'Erro ao carregar detalhes da disciplina');
      } finally {
        setLoading(false);
      }
    }
    loadDetalhes();
  }, [disciplinaId]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleInscrever = async () => {
    if (!detalhes) return;
    try {
      setIsEnrolling(true);
      await matriculasService.inscrever(detalhes.id);
      toast.success('Inscrição realizada com sucesso!');
      if (onInscricaoSuccess) onInscricaoSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar inscrição');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-dark/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (erro || !detalhes) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-dark/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="font-bold text-lg text-ui-dark mb-2">Erro ao carregar</h3>
          <p className="text-ui-medium text-sm mb-6">{erro}</p>
          <button 
            onClick={onClose}
            className="w-full bg-ui-bg border border-ui-border text-ui-dark font-medium text-sm py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const faltamRequisitos = detalhes.preRequisitos.some(pr => !pr.atendido);
  const isInscrito = detalhes.statusAluno === 'inscrito';
  const isRequisitado = detalhes.statusAluno === 'requisitada';
  const isAprovado = detalhes.statusAluno === 'aprovado' || detalhes.statusAluno === 'concluida';
  
  const isCheio = detalhes.vagasTotais - detalhes.vagasOcupadas <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-dark/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-ui-border">
          <div>
            <Badge variant="primary">{detalhes.codigo}</Badge>
            <h2 className="font-bold text-xl text-ui-dark mt-2 leading-tight pr-4">
              {detalhes.nome}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-ui-muted hover:text-ui-dark p-1.5 rounded-lg hover:bg-ui-bg transition-colors shrink-0"
            aria-label="Fechar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-6">
          
          {/* Descrição */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ui-muted mb-2">Ementa / Descrição</h4>
            <p className="text-sm text-ui-dark leading-relaxed">
              {detalhes.descricao || 'Nenhuma descrição disponível para esta disciplina.'}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-ui-bg rounded-xl p-4 border border-ui-border">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-ui-muted flex items-center gap-1">
                <CreditBookIcon className="w-3 h-3" /> Créditos
              </span>
              <span className="text-sm font-semibold text-ui-dark">{detalhes.creditos}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-ui-muted flex items-center gap-1">
                <ClockIcon className="w-3 h-3" /> Horário
              </span>
              <span className="text-sm font-semibold text-ui-dark truncate" title={detalhes.horarios ? formatHorarios(detalhes.horarios) : 'Sem horário'}>
                {detalhes.horarios ? formatHorarios(detalhes.horarios) : 'Sem horário'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-ui-muted flex items-center gap-1">
                <UserTeacherIcon className="w-3 h-3" /> Professor
              </span>
              <span className="text-sm font-semibold text-ui-dark truncate" title={detalhes.professor || 'A definir'}>
                {detalhes.professor || 'A definir'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-ui-muted">
                Vagas
              </span>
              <span className={`text-sm font-semibold ${isCheio ? 'text-orange-600' : 'text-green-600'}`}>
                {detalhes.vagasTotais - detalhes.vagasOcupadas} restantes
              </span>
            </div>
          </div>

          {/* Pré-requisitos */}
          {detalhes.preRequisitos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ui-muted mb-3">Pré-requisitos</h4>
              <div className="flex flex-col gap-2">
                {detalhes.preRequisitos.map((pr) => (
                  <div key={pr.codigo} className="flex items-center gap-3 bg-white border border-ui-border p-3 rounded-lg">
                    {pr.atendido ? (
                      <CheckCircleIcon className="text-green-500 shrink-0" />
                    ) : (
                      <XCircleIcon className="text-red-500 shrink-0" />
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-ui-dark">{pr.codigo}</span>
                      <span className="text-sm text-ui-medium truncate">{pr.nome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-ui-border bg-ui-bg mt-auto">
          {isInscrito ? (
             <div className="w-full bg-brand-light text-brand-primary font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2">
               <CheckCircleIcon /> Você já está inscrito nesta disciplina
             </div>
          ) : isRequisitado ? (
             <div className="w-full bg-amber-100 text-amber-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2">
               <CheckCircleIcon className="text-amber-600" /> Sua inscrição foi requisitada e aguarda aprovação
             </div>
          ) : isAprovado ? (
            <div className="w-full bg-green-100 text-green-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircleIcon /> Você já foi aprovado nesta disciplina
            </div>
          ) : faltamRequisitos ? (
            <div className="w-full bg-red-50 text-red-600 font-bold text-sm py-3 rounded-xl flex items-center justify-center border border-red-100">
              Você não cumpre os pré-requisitos para se inscrever
            </div>
          ) : isCheio ? (
            <div className="w-full bg-orange-50 text-orange-600 font-bold text-sm py-3 rounded-xl flex items-center justify-center border border-orange-100">
              Não há vagas disponíveis
            </div>
          ) : (
            <button
              onClick={handleInscrever}
              disabled={isEnrolling}
              className={`w-full bg-brand-primary text-white font-bold text-sm py-3 rounded-xl hover:bg-brand-accent active:scale-[0.98] transition-all flex items-center justify-center ${isEnrolling ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isEnrolling ? 'Inscrevendo...' : 'Inscrever-se na Disciplina'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
