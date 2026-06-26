import Badge from './Badge';
import EnrollButton from './EnrollButton';

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
  
  const isBloqueado = (preRequisito && !preRequisito.atendido) || limiteCreditosAtingido;
  const isInscrito = statusInscricao === 'inscrito';
  
  const buttonStatus = isInscrito ? 'inscrito' : isBloqueado ? 'bloqueado' : 'disponivel';

  return (
    <div className={`p-4 rounded-xl border bg-white flex flex-col gap-3 transition-all ${isInscrito ? 'border-brand-primary/30 shadow-sm' : 'border-ui-border'}`}>
      
      {/* Linha 1: Código e Vagas */}
      <div className="flex justify-between items-center">
        <Badge variant="primary">{codigo}</Badge>
        <Badge variant="neutral">Vagas: {vagasOcupadas}/{vagasTotais}</Badge>
      </div>

      {/* Linha 2: Título */}
      <h3 className="font-bold text-[17px] text-ui-dark leading-tight">{nome}</h3>

      {/* Linha 3: Período e Créditos */}
      <div className="flex gap-4 text-xs font-medium text-ui-muted">
        <span className="flex items-center gap-1">🕒 Período: {periodo}</span>
        <span className="flex items-center gap-1">📚 Créditos: {creditos}</span>
      </div>

      {/* Linha 4: Badges de Validação */}
      <div className="flex flex-wrap gap-2 mt-1">
        {preRequisito && (
          <Badge 
            variant={preRequisito.atendido ? 'success' : 'error'}
            icon={preRequisito.atendido ? '✓' : '⊗'}
          >
            {preRequisito.mensagem}
          </Badge>
        )}
        
        {limiteCreditosAtingido && !isInscrito && (
          <Badge variant="warning" icon="⚠">
            Limite de 24 créditos excedido
          </Badge>
        )}
      </div>

      <EnrollButton status={buttonStatus} />
      
    </div>
  );
}