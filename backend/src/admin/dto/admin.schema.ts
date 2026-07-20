import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Constantes ──

const DIAS_SEMANA = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado',
] as const;

const HORARIO_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// ── Helpers ──

function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

// ── Sub-schemas ──

const horarioSchema = z.object({
    diaSemana: z.enum(DIAS_SEMANA, {
        error: 'Dia da semana inválido. Valores aceitos: Segunda, Terça, Quarta, Quinta, Sexta, Sábado',
    }),
    horarioInicio: z.string().regex(HORARIO_REGEX, {
        message: 'horarioInicio deve estar no formato HH:MM (ex: 08:00)',
    }),
    horarioFim: z.string().regex(HORARIO_REGEX, {
        message: 'horarioFim deve estar no formato HH:MM (ex: 10:00)',
    }),
}).refine(
    (h) => timeToMinutes(h.horarioInicio) < timeToMinutes(h.horarioFim),
    { message: 'horarioInicio deve ser anterior a horarioFim' },
);

// ── Schemas ──

export const criarDisciplinaSchema = z.object({
    codigo: z
        .string()
        .min(1, { error: 'Código é obrigatório' })
        .regex(/^[A-Z]{2,5}\d{3,4}$/, {
            message: 'Código deve seguir o formato: 2–5 letras maiúsculas + 3–4 dígitos (ex: BCC099)',
        }),
    nome: z.string().min(3, { error: 'Nome deve ter no mínimo 3 caracteres' }),
    descricao: z.string().optional(),
    professor: z.string().optional(),
    creditos: z.number().int().min(1, { error: 'Créditos deve ser pelo menos 1' }),
    vagas: z.number().int().min(1, { error: 'Vagas deve ser pelo menos 1' }),
    horarios: z
        .array(horarioSchema)
        .min(1, { error: 'Ao menos um horário é obrigatório' }),
    departamento: z.string().optional(),
    periodoIdeal: z.number().int().min(1).max(10).optional(),
    preRequisitoId: z.string().uuid().optional(),
});

export const atualizarDisciplinaSchema = z.object({
    nome: z.string().min(3).optional(),
    descricao: z.string().optional().nullable(),
    professor: z.string().optional().nullable(),
    creditos: z.number().int().min(1).optional(),
    vagas: z.number().int().min(1).optional(),
    horarios: z
        .array(horarioSchema)
        .min(1)
        .optional(),
    departamento: z.string().optional().nullable(),
    periodoIdeal: z.number().int().min(1).max(10).optional().nullable(),
    preRequisitoId: z.string().uuid().optional().nullable(),
});

// ── Swagger DTOs ──

class HorarioDto {
    @ApiProperty({ example: 'Segunda', description: 'Dia da semana', enum: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] })
    diaSemana!: string;

    @ApiProperty({ example: '08:00', description: 'Horário de início no formato HH:MM' })
    horarioInicio!: string;

    @ApiProperty({ example: '10:00', description: 'Horário de término no formato HH:MM' })
    horarioFim!: string;
}

export class CriarDisciplinaDto {
    @ApiProperty({ example: 'BCC099', description: 'Código único da disciplina (2–5 letras maiúsculas + 3–4 dígitos)' })
    codigo!: string;

    @ApiProperty({ example: 'Introdução à Computação', description: 'Nome completo da disciplina (mín. 3 caracteres)' })
    nome!: string;

    @ApiPropertyOptional({ example: 'Fundamentos de algoritmos e programação', description: 'Descrição / ementa da disciplina' })
    descricao?: string;

    @ApiPropertyOptional({ example: 'Prof. Dr. Fulano', description: 'Nome do professor responsável' })
    professor?: string;

    @ApiProperty({ example: 4, description: 'Quantidade de créditos (mín. 1)' })
    creditos!: number;

    @ApiProperty({ example: 40, description: 'Número total de vagas (mín. 1)' })
    vagas!: number;

    @ApiProperty({ type: [HorarioDto], description: 'Lista de horários da disciplina (mín. 1)' })
    horarios!: HorarioDto[];

    @ApiPropertyOptional({ example: 'DC', description: 'Departamento ao qual a disciplina pertence' })
    departamento?: string;

    @ApiPropertyOptional({ example: 1, description: 'Período ideal recomendado (1–10)' })
    periodoIdeal?: number;

    @ApiPropertyOptional({ example: 'uuid-do-prerequisito', description: 'ID (UUID) da disciplina pré-requisito' })
    preRequisitoId?: string;
}

export class AtualizarDisciplinaDto {
    @ApiPropertyOptional({ example: 'Nome Atualizado', description: 'Novo nome da disciplina' })
    nome?: string;

    @ApiPropertyOptional({ example: 'Nova descrição', description: 'Nova descrição / ementa' })
    descricao?: string;

    @ApiPropertyOptional({ example: 'Prof. Dra. Beltrana', description: 'Novo professor responsável' })
    professor?: string;

    @ApiPropertyOptional({ example: 6, description: 'Nova quantidade de créditos' })
    creditos?: number;

    @ApiPropertyOptional({ example: 50, description: 'Novo número de vagas' })
    vagas?: number;

    @ApiPropertyOptional({ type: [HorarioDto], description: 'Novos horários (substitui os existentes)' })
    horarios?: HorarioDto[];

    @ApiPropertyOptional({ example: 'DM', description: 'Novo departamento' })
    departamento?: string;

    @ApiPropertyOptional({ example: 2, description: 'Novo período ideal (1–10)' })
    periodoIdeal?: number;

    @ApiPropertyOptional({ example: null, description: 'ID do novo pré-requisito (null para remover)' })
    preRequisitoId?: string | null;
}
