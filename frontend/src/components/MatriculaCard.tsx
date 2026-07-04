import { ClockIcon, CalendarIcon, CreditBookIcon, MoreVerticalIcon } from '../assets/icons';
import { MinhaMateria } from '../services/matriculas.service';
import { useState } from 'react';

interface MatriculaCardProps extends MinhaMateria {
  onCancelar: (matriculaId: string) => void;
  isCanceling: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    inscrito: { bg: 'bg-brand-light', text: 'text-brand-primary', label: 'Inscrito' },
    confirmada: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Confirmada' },
    pendente: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pendente' },
    aprovado: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aprovado' },
    reprovado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reprovado' },
  };

  const c = config[status] || config.inscrito;

  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export default function MatriculaCard({
  matriculaId, codigo, nome, creditos, horario, status, semestre, onCancelar, isCanceling
}: MatriculaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const canCancel = status === 'inscrito';

  return (
    <div className="bg-white rounded-xl border border-ui-border p-5 flex flex-col gap-3 transition-all hover:shadow-md">

      {/* ── MOBILE LAYOUT ── */}
      <div className="sm:hidden flex flex-col gap-3">
        {/* Title row + badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[17px] text-ui-dark leading-tight">{nome}</h3>
          <StatusBadge status={status} />
        </div>

        {/* Credits & Code */}
        <div className="flex gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ui-muted font-medium">Créditos</p>
            <p className="text-sm font-bold text-ui-dark">{creditos}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ui-muted font-medium">Código</p>
            <p className="text-sm font-bold text-ui-dark">{codigo}</p>
          </div>
        </div>

        {/* Schedule pill */}
        <div className="flex items-center gap-1.5 bg-ui-bg rounded-full px-3 py-1.5 w-fit">
          <ClockIcon className="text-ui-muted" />
          <span className="text-xs text-ui-medium font-medium">{horario}</span>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden sm:flex sm:flex-col sm:gap-3">
        {/* Status badge + more menu */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-1 rounded-md hover:bg-ui-bg transition-colors text-ui-muted"
            >
              <MoreVerticalIcon />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-ui-border rounded-lg shadow-lg py-1 min-w-[160px]">
                  <button className="w-full text-left px-4 py-2 text-sm text-ui-medium hover:bg-ui-bg transition-colors">
                    Ver Detalhes
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => { setMenuOpen(false); onCancelar(matriculaId); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cancelar Inscrição
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Code */}
        <p className="text-xs font-semibold text-ui-muted tracking-wide uppercase">{codigo}</p>

        {/* Name */}
        <h3 className="font-bold text-[17px] text-ui-dark leading-tight">{nome}</h3>

        {/* Info row */}
        <div className="flex flex-col gap-1.5 text-xs font-medium text-ui-muted">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="text-ui-muted" />
            Semestre {semestre}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="text-ui-muted" />
            {horario}
          </span>
          <span className="flex items-center gap-1.5">
            <CreditBookIcon className="text-ui-muted" />
            {creditos} Créditos
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-brand-primary text-brand-primary hover:bg-brand-light transition-colors active:scale-[0.98]">
            Ver Detalhes
          </button>
          {canCancel && (
            <button
              onClick={() => onCancelar(matriculaId)}
              disabled={isCanceling}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 border-ui-border text-ui-medium hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors active:scale-[0.98] ${isCanceling ? 'opacity-60 cursor-wait' : ''}`}
            >
              {isCanceling ? 'Cancelando...' : 'Cancelar Inscrição'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
