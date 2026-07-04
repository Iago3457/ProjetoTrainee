interface MinhasMateriasHeadingProps {
  semestre: string
}

export default function MinhasMateriasHeading({ semestre }: MinhasMateriasHeadingProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-bold text-[28px] sm:text-[32px] text-ui-dark tracking-tight leading-tight">
        Minhas Matérias
      </h1>
      {/* Mobile: longer description */}
      <p className="text-sm text-ui-muted leading-relaxed sm:hidden">
        Confira a lista de disciplinas e seus respectivos horários para o semestre atual.
      </p>
      {/* Desktop: compact subtitle */}
      <p className="hidden sm:block text-base text-ui-muted leading-6">
        Semestre{' '}
        <span className="font-medium text-brand-accent">{semestre}</span>
      </p>
    </div>
  )
}
