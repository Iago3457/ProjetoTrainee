import { ReactNode } from 'react';

interface FilterPillProps {
  label: string;
  isActive?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
}

export default function FilterPill({ label, isActive = false, icon, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap
        ${isActive 
          ? 'bg-brand-primary text-white' 
          : 'bg-white text-ui-dark border border-ui-border hover:bg-gray-50'
        }
      `}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}