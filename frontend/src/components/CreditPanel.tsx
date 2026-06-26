import { GraduationCapIcon } from '../assets/icons';
import ProgressBar from './ProgressBar';

interface CreditPanelProps {
  creditosAtuais: number;
  limiteCreditos?: number;
}

export default function CreditPanel({ creditosAtuais, limiteCreditos = 24 }: CreditPanelProps) {
  const limiteAtingido = creditosAtuais >= limiteCreditos;
  const progressBarVariant = limiteAtingido ? 'warning' : 'primary';

  return (
    <div className="bg-brand-light/30 border border-brand-light p-4 rounded-xl flex flex-col gap-3 min-w-[280px]">
      
      {/* Cabeçalho do Painel */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-brand-light w-8 h-8 rounded-full flex items-center justify-center">
            <GraduationCapIcon color="#9333EA" />
          </div>
          <span className="text-brand-primary font-bold text-[10px] tracking-wide uppercase leading-tight">
            Créditos<br/>Selecionados
          </span>
        </div>

        <div className="text-right flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${limiteAtingido ? 'text-orange-500' : 'text-brand-primary'}`}>
            {creditosAtuais}
          </span>
          <span className="text-ui-muted text-xs font-semibold">
            / {limiteCreditos} Max
          </span>
        </div>
      </div>

      <ProgressBar 
        current={creditosAtuais} 
        max={limiteCreditos} 
        variant={progressBarVariant} 
      />
      
      {/* Mensagem de status */}
      <div className="text-[11px] text-right text-ui-muted font-medium">
        {limiteAtingido ? (
          <span className="text-orange-500">Limite de {limiteCreditos} créditos atingido</span>
        ) : (
          `${limiteCreditos - creditosAtuais} créditos restantes`
        )}
      </div>
      
    </div>
  );
}