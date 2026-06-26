interface IconProps {
  width?: number
  height?: number
  color?: string
  className?: string
}

export function GraduationCapIcon({ width = 26, height = 21, color = '#3525cd', className }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13 2L25 8.5L13 15L1 8.5L13 2Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path
        d="M7 11.5V16.5C8.5 18.5 10.5 19.5 13 19.5C15.5 19.5 17.5 18.5 19 16.5V11.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M25 8.5V14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function EmailIcon() {
  return (
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="15.5" height="11.5" rx="1.75" stroke="#777587" strokeWidth="1.3" />
      <path d="M1 3.5L8.5 8L16 3.5" stroke="#777587" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg width="13" height="18" viewBox="0 0 13 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="8.25" width="11.5" height="9" rx="1.75" stroke="#777587" strokeWidth="1.3" />
      <path
        d="M3.5 8V5.5C3.5 3.567 4.843 2 6.5 2C8.157 2 9.5 3.567 9.5 5.5V8"
        stroke="#777587"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6H10M7 3L10 6L7 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M9 1C9 1 3 4 3 10V15H15V10C15 4 9 1 9 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 15C7 16.1 7.9 17 9 17C10.1 17 11 16.1 11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function MenuIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1 8H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M1 15H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function EyeOffIcon() {
  return (
    <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 1.5L17.5 15.5" stroke="#c7c4d8" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M7.5 4.2C8.1 4 8.8 3.9 9.5 3.9C13.5 3.9 16.8 6.6 18 9.5C17.4 10.7 16.5 11.7 15.3 12.5"
        stroke="#c7c4d8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4.5 6C2.8 7.2 1.5 8.5 1 9.5C2.2 12.4 5.5 15.1 9.5 15.1C11 15.1 12.4 14.7 13.6 14"
        stroke="#c7c4d8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7.2 9.5C7.2 8.3 8.2 7.3 9.5 7.3"
        stroke="#c7c4d8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.5 11.7C10.8 11.7 11.8 10.7 11.8 9.5"
        stroke="#c7c4d8"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CreditBookIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M8 12h8M12 8v8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function FilterIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" strokeWidth="1.8" />
    </svg>
  )
}

export function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CatalogIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.8" />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.8" />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.8" />
    </svg>
  )
}

export function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M15 9l-6 6M9 9l6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function InfoCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
