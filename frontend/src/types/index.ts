export type Page = 'login' | 'signup' | 'dashboard' | 'minhas-materias' | 'perfil'

export interface User {
  id: string | number
  name: string
  email: string
  matricula: string
  curso: string
  periodo: string
  semestre: string
  password: string
  avatar: string | null
  creditos: number
}

