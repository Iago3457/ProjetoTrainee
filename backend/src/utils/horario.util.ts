export function checkTimeConflict(horario1: string, horario2: string): boolean {
    // Expected format: 'Segunda, Quarta e Sexta. 08h-10h'
    const parseHorario = (str: string) => {
        const parts = str.split('.');
        if (parts.length !== 2) return null;
        
        const daysStr = parts[0].trim();
        const timeStr = parts[1].trim(); 

        const days = daysStr
            .replace(/ e /g, ', ')
            .split(',')
            .map(d => d.trim().toLowerCase())
            .filter(d => d.length > 0);

        const timeParts = timeStr.split('-');
        if (timeParts.length !== 2) return null;

        const start = parseInt(timeParts[0].replace('h', ''));
        const end = parseInt(timeParts[1].replace('h', ''));

        if (isNaN(start) || isNaN(end)) return null;

        return { days, start, end };
    };

    const parsed1 = parseHorario(horario1);
    const parsed2 = parseHorario(horario2);

    if (!parsed1 || !parsed2) {
        // Fallback to strict equality if parsing fails
        return horario1.trim() === horario2.trim();
    }

    const sharedDays = parsed1.days.some(day => parsed2.days.includes(day));
    if (!sharedDays) return false;

    // Check time overlap: (start1 < end2) && (start2 < end1)
    const hasTimeOverlap = parsed1.start < parsed2.end && parsed2.start < parsed1.end;
    
    return hasTimeOverlap;
}
