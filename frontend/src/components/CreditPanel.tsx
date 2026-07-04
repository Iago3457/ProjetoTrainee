import { GraduationCapIcon } from '../assets/icons';

interface CreditPanelProps {
  creditosAtuais: number;
  limiteCreditos?: number;
}

export default function CreditPanel({ creditosAtuais, limiteCreditos = 24 }: CreditPanelProps) {
  const limiteAtingido = creditosAtuais >= limiteCreditos;
  const percentage = Math.min((creditosAtuais / limiteCreditos) * 100, 100);

  return (
    <div className="relative bg-ui-dark rounded-xl p-4 pr-14 min-w-[220px] overflow-hidden">
      {/* Graduation cap icon - decorative overlay */}
      <div className="absolute -top-1 -right-1 opacity-20">
        <GraduationCapIcon width={50} height={40} color="#c3c0ff" />
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold tracking-widest uppercase text-brand-light mb-1">
        Créditos Selecionados
      </p>

      {/* Numbers */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className={`text-3xl font-bold ${limiteAtingido ? 'text-orange-400' : 'text-brand-light'}`}>
          {creditosAtuais}
        </span>
        <span className="text-white/50 text-sm font-medium">
          / {limiteCreditos} Max
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${limiteAtingido ? 'bg-orange-400' : 'bg-brand-primary'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}