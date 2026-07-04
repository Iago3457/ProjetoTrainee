import { api } from "./api";
import { DisciplinaCardProps } from "../components/DisciplinaCard";

export interface ListarCatalogoResponse {
    creditosAtuais: number;
    limiteCreditosAtingido: boolean;
    disciplinas: DisciplinaCardProps[];
}

export interface UserProfile {
    id: string;
    nome: string;
    email: string;
    ra: string;
    periodo: string;
    semestre: string;
    curso: string | null;
    avatar: string | null;
}

export const disciplinasService = {
    listarCatalogo: async (alunoId: string): Promise<ListarCatalogoResponse> => {
        const response = await api.get('/disciplinas', {
            params: { alunoId }
        });
        
        const { creditosAtuais, limiteCreditosAtingido, disciplinas } = response.data;
        
        const disciplinasMapeadas: DisciplinaCardProps[] = disciplinas.map((d: any) => ({
            id: d.id,
            codigo: d.codigo,
            nome: d.nome,
            vagasOcupadas: d.vagasOcupadas,
            vagasTotais: d.vagasTotais,
            periodo: d.horario, // Mapeia o horário ("Segunda e Quarta...") para ser exibido no card
            creditos: d.creditos,
            statusInscricao: d.statusInscricao,
            preRequisito: d.infoPreRequisito || undefined,
            limiteCreditosAtingido: d.limiteCreditosAtingido,
        }));

        return {
            creditosAtuais,
            limiteCreditosAtingido,
            disciplinas: disciplinasMapeadas
        };
    },

    getPerfil: async (): Promise<UserProfile> => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};