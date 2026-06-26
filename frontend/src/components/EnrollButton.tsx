import { CheckCircleIcon } from '../assets/icons';

interface EnrollButtonProps {
  status: 'disponivel' | 'inscrito' | 'bloqueado';
  onClick?: () => void;
}

export default function EnrollButton({ status, onClick }: EnrollButtonProps) {
  const baseClasses = "mt-auto w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors";
  
  if (status === 'inscrito') {
    return (
      <button disabled className={`${baseClasses} bg-brand-light text-brand-primary border border-brand-primary/20`}>
        <CheckCircleIcon className="text-brand-primary" /> Inscrito
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
    <button onClick={onClick} className={`${baseClasses} bg-brand-primary text-white hover:bg-brand-accent active:scale-[0.98]`}>
      Inscrever-se
    </button>
  );
}