interface EnrollButtonProps {
  status: 'disponivel' | 'inscrito' | 'bloqueado';
  onClick?: () => void;
}

export default function EnrollButton({ status, onClick }: EnrollButtonProps) {
  const baseClasses = "mt-2 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors";
  
  if (status === 'inscrito') {
    return (
      <button disabled className={`${baseClasses} bg-brand-light text-brand-primary border border-brand-primary/20`}>
        <span>✓</span> Inscrito
      </button>
    );
  }

  if (status === 'bloqueado') {
    return (
      <button disabled className={`${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`}>
        <span>🔒</span> Bloqueado
      </button>
    );
  }

  // Estado: Disponível
  return (
    <button onClick={onClick} className={`${baseClasses} bg-brand-primary text-white hover:bg-brand-primary/90`}>
      <span>⊕</span> Inscrever-se
    </button>
  );
}