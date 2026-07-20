import { api } from './api';

export interface AdminDisciplina {
    id: string;
    codigo: string;
    nome: string;
    descricao: string | null;
    professor: string | null;
    creditos: number;
    vagas: number;
    horarios: { diaSemana: string; horarioInicio: string; horarioFim: string }[];
    departamento: string | null;
    periodoIdeal: number | null;
    preRequisito: { id: string; codigo: string; nome: string } | null;
    vagasOcupadas: number;
    inscritos: { id: string; nome: string; email: string; ra: string }[];
}

export interface MatriculaPendente {
    id: string;
    status: string;
    createdAt: string;
    aluno: { id: string; nome: string; email: string; ra: string };
    disciplina: { id: string; codigo: string; nome: string };
}

export interface AlunoMatriculaSemestre {
    disciplina: { id: string; codigo: string; nome: string };
    matriculas: {
        matriculaId: string;
        status: string;
        aluno: { id: string; nome: string; email: string; ra: string };
    }[];
}

export const adminService = {
    login: async (email: string, senha: string) => {
        const response = await api.post('/auth/admin/login', { email, senha });
        return response.data;
    },

    listarDisciplinas: async (): Promise<AdminDisciplina[]> => {
        const response = await api.get('/admin/disciplinas');
        return response.data;
    },

    criarDisciplina: async (dados: {
        codigo: string;
        nome: string;
        descricao?: string;
        professor?: string;
        creditos: number;
        vagas: number;
        horarios: { diaSemana: string; horarioInicio: string; horarioFim: string }[];
        departamento?: string;
        periodoIdeal?: number;
        preRequisitoId?: string;
    }) => {
        const response = await api.post('/admin/disciplinas', dados);
        return response.data;
    },

    atualizarDisciplina: async (id: string, dados: Record<string, any>) => {
        const response = await api.put(`/admin/disciplinas/${id}`, dados);
        return response.data;
    },

    excluirDisciplina: async (id: string) => {
        const response = await api.delete(`/admin/disciplinas/${id}`);
        return response.data;
    },

    listarPendentes: async (): Promise<MatriculaPendente[]> => {
        const response = await api.get('/admin/matriculas/pendentes');
        return response.data;
    },

    aprovarMatricula: async (id: string) => {
        const response = await api.put(`/admin/matriculas/${id}/aprovar`);
        return response.data;
    },

    rejeitarMatricula: async (id: string) => {
        const response = await api.put(`/admin/matriculas/${id}/rejeitar`);
        return response.data;
    },

    obterSemestreAtual: async (): Promise<{ ano: number; semestre: number }> => {
        const response = await api.get('/admin/semestre/atual');
        return response.data;
    },

    listarAlunosMatriculas: async (ano?: number, semestre?: number): Promise<AlunoMatriculaSemestre[]> => {
        const params = new URLSearchParams();
        if (ano) params.append('ano', ano.toString());
        if (semestre) params.append('semestre', semestre.toString());
        const response = await api.get(`/admin/alunos/matriculas?${params.toString()}`);
        return response.data;
    },

    definirStatusMatriculas: async (matriculas: { matriculaId: string; status: string }[]) => {
        const response = await api.put('/admin/matriculas/definir-status', { matriculas });
        return response.data;
    },

    avancarSemestre: async () => {
        const response = await api.post('/admin/semestre/avancar');
        return response.data;
    },
};
