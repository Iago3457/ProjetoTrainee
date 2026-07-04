import { DisciplinaCardProps } from "../components/DisciplinaCard";

export const mockDisciplina: DisciplinaCardProps[] = [
  {
    id: 'mock-1',
    codigo: 'COMP201',
    nome: 'Estrutura de Dados I',
    vagasOcupadas: 28,
    vagasTotais: 40,
    periodo: '4º Período',
    creditos: 4,
    statusInscricao: 'inscrito',
    preRequisito: { atendido: true, mensagem: 'Pré-requisito: COMP102 (Aprovado)' }
  },
  {
    id: 'mock-2',
    codigo: 'MAT305',
    nome: 'Cálculo Numérico',
    vagasOcupadas: 40,
    vagasTotais: 40,
    periodo: '5º Período',
    creditos: 4,
    statusInscricao: 'indisponivel',
    preRequisito: { atendido: false, mensagem: 'Falta: MAT201' }
  },
  {
    id: 'mock-3',
    codigo: 'HUM104',
    nome: 'Filosofia da Tecnologia',
    vagasOcupadas: 10,
    vagasTotais: 40,
    periodo: 'Eletiva',
    creditos: 2,
    statusInscricao: 'disponivel',
  },
  {
    id: 'mock-4',
    codigo: 'ENG202',
    nome: 'Sistemas Embarcados',
    vagasOcupadas: 35,
    vagasTotais: 40,
    periodo: '6º Período',
    creditos: 4,
    statusInscricao: 'disponivel',
    preRequisito: { atendido: true, mensagem: 'Pré-requisito: ENG105 (Aprovado)' },
  }
]