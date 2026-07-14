export function formatHorarios(horarios: { diaSemana: string; horarioInicio: string; horarioFim: string }[]): string {
    if (!horarios || horarios.length === 0) return 'Sem horário definido';

    // Group by time window to combine days (e.g., "08:00-10:00" -> ["Segunda", "Quarta"])
    const grouped: Record<string, string[]> = {};
    for (const h of horarios) {
        const timeWindow = `${h.horarioInicio.slice(0, 5)}-${h.horarioFim.slice(0, 5)}`;
        if (!grouped[timeWindow]) grouped[timeWindow] = [];
        grouped[timeWindow].push(h.diaSemana);
    }

    const formatTimeStr = (t: string) => t.replace(':00', 'h').replace(/^0/, ''); // "08:00" -> "8h", "10:00" -> "10h"

    const parts = [];
    for (const [timeWindow, days] of Object.entries(grouped)) {
        const [start, end] = timeWindow.split('-');
        let daysStr = days.join(', ');
        if (days.length > 1) {
            const lastComma = daysStr.lastIndexOf(', ');
            daysStr = daysStr.substring(0, lastComma) + ' e ' + daysStr.substring(lastComma + 2);
        }
        parts.push(`${daysStr}. ${formatTimeStr(start)}-${formatTimeStr(end)}`);
    }

    return parts.join(' | ');
}
