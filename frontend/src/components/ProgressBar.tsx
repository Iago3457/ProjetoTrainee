interface ProgressBarProps {
    current: number;
    max: number;
    variant?: 'primary' | 'warning' | 'danger';
}

export default function ProgressBar({ current, max, variant = 'primary' }: ProgressBarProps) {
    const percentage = Math.min((current/ max) * 100, 100);

    const colorClasses = {
        primary: 'bg-brand-primary',
        warning: 'bg-orange-500',
        danger: 'bg-red-500',
    };

    return (
        <div className="h2 w-full bg-brand-light roudend full overflow-hidden">
            <div className= {`h-full rounded-full transition-all duration-500 ${colorClasses[variant]}`} style={{ width: `${percentage}%`}} />
        </div>
    );
}