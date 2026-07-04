import { SearchIcon } from '../assets/icons';

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
    return (
        <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-ui-muted">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Buscar disciplinas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-ui-border rounded-lg text-sm text-ui-dark placeholder:text-ui-muted outline-none focus:border-brand-primary transition-colors"
            />
        </div>
    );
}