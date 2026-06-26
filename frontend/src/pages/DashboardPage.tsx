import DashboardHeader from '../components/DashboardHeader'
import CatalogHeading from '../components/CatalogHeading'
import mockUser from '../services/mockUser'
import CreditPanel from '../components/CreditPanel'
import FilterPill from '../components/FilterPill'
import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import { mockDisciplina } from '../services/mockDisciplinas'
import DisciplinaCard from '../components/DisciplinaCard'
import { FilterIcon } from '../assets/icons'

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('periodo');

  const filters = [
    { id: 'todos', label: 'Todos os Departamentos', icon: <FilterIcon /> },
    { id: 'periodo', label: 'Período Ideal: 4º Semestre' },
  ]

  const creditosAtuais = 16

  return (
    <div className="min-h-screen bg-ui-bg">
      <DashboardHeader user={mockUser} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top row: Heading + Credit Panel */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 sm:gap-6">
          <CatalogHeading semestre={mockUser.semestre} />

          <div className="w-full md:w-auto shrink-0">
            <CreditPanel creditosAtuais={creditosAtuais} limiteCreditos={24} />
          </div>
        </div>

        {/* Filter row: Filters left, Search right */}
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filter pills — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap">
            {filters.map((filter) => (
              <FilterPill 
                key={filter.id} 
                label={filter.label} 
                isActive={activeFilter === filter.id} 
                onClick={() => setActiveFilter(filter.id)}
                icon={filter.icon}
              />
            ))}
          </div>

          {/* Search bar */}
          <SearchBar 
            search={search} 
            setSearch={setSearch}
          />
        </div>

        {/* Cards grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockDisciplina.map((disciplina) => (
            <DisciplinaCard key={disciplina.codigo} {...disciplina} />
          ))}
        </div>
      </main>
    </div>
  )
}
