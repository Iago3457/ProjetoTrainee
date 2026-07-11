import { ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../assets/icons';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  icon?: ReactNode;
  options: FilterOption[];
  activeOptionId?: string | null;
  onSelect: (optionId: string) => void;
  isActive?: boolean;
}

export default function FilterDropdown({ label, icon, options, activeOptionId, onSelect, isActive = false }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = activeOptionId 
    ? options.find(o => o.id === activeOptionId)?.label 
    : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap
          ${isActive 
            ? 'bg-brand-primary text-white' 
            : 'bg-white text-ui-dark border border-ui-border hover:bg-gray-50'
          }
        `}
      >
        {icon && <span>{icon}</span>}
        {isActive && activeLabel ? activeLabel : label}
        <ChevronDownIcon className="ml-1 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 min-w-[200px] bg-white border border-ui-border rounded-lg shadow-lg py-1">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                ${activeOptionId === option.id 
                  ? 'bg-brand-light text-brand-primary font-semibold' 
                  : 'text-ui-dark hover:bg-ui-bg'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
