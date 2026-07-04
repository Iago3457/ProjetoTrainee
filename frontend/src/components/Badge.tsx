import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'primary';
  icon?: ReactNode;
}

export default function Badge({ children, variant = 'neutral', icon }: BadgeProps) {
  const baseClasses = "text-[11px] px-2 py-1 rounded flex items-center gap-1 font-medium w-fit";

  const variantClasses = {
    success: "bg-green-50 text-green-700 border border-green-100",
    warning: "bg-orange-50 text-orange-700 border border-orange-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    neutral: "bg-gray-100 text-gray-700",
    primary: "bg-brand-light text-brand-primary font-bold uppercase tracking-wider"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}