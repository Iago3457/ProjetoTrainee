import Badge from './Badge';
import EnrollButton from './EnrollButton';
import { ClockIcon, CreditBookIcon, CheckCircleIcon, XCircleIcon, InfoCircleIcon } from '../assets/icons';

export interface DisciplinaCardProps {
  codigo: string;
  nome: string;
  vagasOcupadas: number;
  vagasTotais: number;
  periodo: number | string;
  creditos: number;
  statusInscricao: 'disponivel' | 'inscrito' | 'indisponivel';
  preRequisito?: { atendido: boolean; mensagem: string };
  limiteCreditosAtingido?: boolean;
}

export default function DisciplinaCard({
  codigo, nome, vagasOcupadas, vagasTotais, periodo, creditos,
  statusInscricao, preRequisito, limiteCreditosAtingido
}: DisciplinaCardProps) {
  
  const isBloqueado = (preRequisito && !preRequisito.atendido) || (statusInscricao === 'indisponivel');
  const isInscrito = statusInscricao === 'inscrito';
  
  const buttonStatus = isInscrito ? 'inscrito' : isBloqueado ? 'bloqueado' : 'disponivel';

  const vagasRestantes = vagasTotais - vagasOcupadas;
  const isCheio = vagasRestantes <= 0;

  return (
    <div className={`p-5 rounded-xl border bg-white flex flex-col gap-3 transition-all ${isInscrito ? 'border-brand-primary/30 shadow-sm' : 'border-ui-border'}`}>
      
      {/* Linha 1: Código e Vagas */}
      <div className="flex justify-between items-center">
        <Badge variant="primary">{codigo}</Badge>
        {isCheio ? (
          <span className="text-[11px] text-ui-muted font-medium">
            Lotação: {vagasOcupadas}/{vagasTotais}
          </span>
        ) : (
          <Badge variant="success">{vagasRestantes} vagas restantes</Badge>
        )}
      </div>

      {/* Linha 2: Título */}
      <h3 className="font-bold text-[17px] text-ui-dark leading-tight">{nome}</h3>

      {/* Linha 3: Período e Créditos */}
      <div className="flex gap-4 text-xs font-medium text-ui-muted">
        <span className="flex items-center gap-1">
          <ClockIcon className="text-ui-muted" />
          {periodo}
        </span>
        <span className="flex items-center gap-1">
          <CreditBookIcon className="text-ui-muted" />
          {creditos} Créditos
        </span>
      </div>

      {/* Linha 4: Badges de Validação */}
      <div className="flex flex-wrap gap-2 mt-1">
        {preRequisito ? (
          <Badge 
            variant={preRequisito.atendido ? 'success' : 'error'}
            icon={preRequisito.atendido ? <CheckCircleIcon className="text-green-600" /> : <XCircleIcon className="text-red-600" />}
          >
            {preRequisito.mensagem}
          </Badge>
        ) : (
          <Badge variant="neutral" icon={<InfoCircleIcon className="text-ui-muted" />}>
            Sem pré-requisitos
          </Badge>
        )}
        
        {limiteCreditosAtingido && !isInscrito && (
          <Badge variant="warning" icon="⚠">
            Limite de 24 créditos atingido
          </Badge>
        )}
      </div>

      <EnrollButton status={buttonStatus} />
      
    </div>
  );
}