import { api } from './api';

export interface MinhaMateria {
    matriculaId: string;
    disciplinaId: string;
    codigo: string;
    nome: string;
    creditos: number;
    horario: string;
    status: string;
    semestre: string;
}

export interface MinhasMateriasResponse {
    creditosAtuais: number;
    materias: MinhaMateria[];
}

export const matriculasService = {
    inscrever: async (disciplinaId: string) => {
        const response = await api.post(`/matriculas/${disciplinaId}/inscrever`);
        return response.data;
    },

    listarMinhas: async (): Promise<MinhasMateriasResponse> => {
        const response = await api.get('/matriculas/minhas');
        return response.data;
    },

    cancelarInscricao: async (matriculaId: string) => {
        const response = await api.delete(`/matriculas/${matriculaId}/cancelar`);
        return response.data;
    },
};