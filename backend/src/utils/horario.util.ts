interface HorarioEstruturado {
    diaSemana: string;
    horarioInicio: string;
    horarioFim: string;
}

function timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + (minutes || 0);
}

export function checkTimeConflict(horarios1: HorarioEstruturado[], horarios2: HorarioEstruturado[]): boolean {
    for (const h1 of horarios1) {
        for (const h2 of horarios2) {
            // Se não forem no mesmo dia, não há conflito
            if (h1.diaSemana !== h2.diaSemana) continue;

            const start1 = timeToMinutes(h1.horarioInicio);
            const end1 = timeToMinutes(h1.horarioFim);
            const start2 = timeToMinutes(h2.horarioInicio);
            const end2 = timeToMinutes(h2.horarioFim);

            // Verifica se há sobreposição (start1 < end2 && start2 < end1)
            if (start1 < end2 && start2 < end1) {
                return true;
            }
        }
    }
    return false;
}
