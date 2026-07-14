import { CheckCircleIcon } from '../assets/icons';

interface EnrollButtonProps {
  status: 'disponivel' | 'inscrito' | 'bloqueado' | 'concluido' | 'requisitada';
  onClick?: () => void;
  isLoading?: boolean;
}

export default function EnrollButton({ status, onClick, isLoading }: EnrollButtonProps) {
  const baseClasses = "mt-auto w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors";
  
  if (status === 'concluido') {
    return (
      <button disabled className={`${baseClasses} bg-green-100 text-green-700 border border-green-200`}>
        <CheckCircleIcon className="text-green-600" /> Concluída
      </button>
    );
  }

  if (status === 'inscrito') {
    return (
      <button disabled className={`${baseClasses} bg-brand-light text-brand-primary border border-brand-primary/20`}>
        <CheckCircleIcon className="text-brand-primary" /> Inscrito
      </button>
    );
  }

  if (status === 'requisitada') {
    return (
      <button disabled className={`${baseClasses} bg-amber-100 text-amber-700 border border-amber-200`}>
        <CheckCircleIcon className="text-amber-600" /> Requisitada
      </button>
    );
  }

  if (status === 'bloqueado') {
    return (
      <button disabled className={`${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`}>
        Bloqueado
      </button>
    );
  }

  // Estado: Disponível
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} disabled={isLoading} className={`${baseClasses} bg-brand-primary text-white hover:bg-brand-accent ${isLoading ? 'opacity-70 cursor-wait' : ''} active:scale-[0.98]`}>
      {isLoading ? 'Processando...' : 'Inscrever-se'}
    </button>
  );
}