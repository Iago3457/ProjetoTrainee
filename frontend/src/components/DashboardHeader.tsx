import { useState } from 'react'
import { GraduationCapIcon, MenuIcon, BellIcon, HelpCircleIcon, SearchIcon, CatalogIcon, BookOpenIcon, UserIcon } from '../assets/icons'
import { User } from '../types'

interface DashboardHeaderProps {
  user: User
}

interface NavLink {
  label: string
  href: string
  active: boolean
  icon: React.ReactNode
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks: NavLink[] = [
    { label: 'Catálogo', href: '#', active: true, icon: <CatalogIcon /> },
    { label: 'Minhas Matérias', href: '#', active: false, icon: <BookOpenIcon /> },
    { label: 'Perfil', href: '#', active: false, icon: <UserIcon /> },
  ]

  return (
    <header className="bg-white border-b border-ui-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left side: Mobile menu + Logo + Nav */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-ui-muted hover:text-ui-dark transition-colors p-1"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <MenuIcon />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-brand-light flex items-center justify-center w-8 h-8 rounded-lg">
                <GraduationCapIcon width={18} height={14} color="#3525cd" />
              </div>
              <span className="font-bold text-[17px] text-brand-primary tracking-tight">
                MatriculaFácil
              </span>
            </div>

            {/* Nav links — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={[
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    link.active
                      ? 'text-brand-primary'
                      : 'text-ui-medium hover:bg-ui-bg hover:text-ui-dark',
                  ].join(' ')}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search — desktop only */}
            <div className="hidden lg:flex items-center relative">
              <div className="absolute left-3 pointer-events-none text-ui-muted">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Buscar disciplinas..."
                className="pl-9 pr-4 py-2 w-[200px] bg-ui-bg border border-ui-border rounded-lg text-sm text-ui-dark placeholder:text-ui-muted outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            {/* Bell */}
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-ui-muted hover:bg-ui-bg hover:text-ui-dark transition-colors">
              <BellIcon />
            </button>

            {/* Help */}
            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-ui-muted hover:bg-ui-bg hover:text-ui-dark transition-colors">
              <HelpCircleIcon />
            </button>

            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center shrink-0 ring-2 ring-brand-light cursor-pointer hover:ring-brand-primary/40 transition-all">
              <span className="text-white text-xs font-semibold leading-none">
                {getInitials(user.name)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-ui-border py-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={[
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  link.active
                    ? 'bg-brand-light text-brand-primary'
                    : 'text-ui-medium hover:bg-ui-bg',
                ].join(' ')}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
