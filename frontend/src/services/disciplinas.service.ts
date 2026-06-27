import { api } from "./api";
import { DisciplinaCardProps } from "../components/DisciplinaCard";

export const disciplinasService = {
    listarCatalogo: async (): Promise<DisciplinaCardProps[]> => {
        const response = await api.get('/disciplinas');
        return response.data;
    },
};