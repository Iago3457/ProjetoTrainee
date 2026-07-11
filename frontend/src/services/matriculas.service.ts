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

    listarMinhas: async (ano?: number, semestre?: number): Promise<MinhasMateriasResponse> => {
        let url = '/matriculas/minhas';
        const params = new URLSearchParams();
        if (ano) params.append('ano', ano.toString());
        if (semestre) params.append('semestre', semestre.toString());
        
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        const response = await api.get(url);
        return response.data;
    },

    cancelarInscricao: async (matriculaId: string) => {
        const response = await api.delete(`/matriculas/${matriculaId}/cancelar`);
        return response.data;
    },
};