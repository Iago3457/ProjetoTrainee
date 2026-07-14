import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const criarDisciplinaSchema = z.object({
    codigo: z.string().min(1, { error: 'Código é obrigatório' }),
    nome: z.string().min(3, { error: 'Nome deve ter no mínimo 3 caracteres' }),
    descricao: z.string().optional(),
    professor: z.string().optional(),
    creditos: z.number().int().min(1, { error: 'Créditos deve ser pelo menos 1' }),
    vagas: z.number().int().min(1, { error: 'Vagas deve ser pelo menos 1' }),
    horarios: z.array(z.object({
        diaSemana: z.string(),
        horarioInicio: z.string(),
        horarioFim: z.string()
    })).min(1, { error: 'Ao menos um horário é obrigatório' }),
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
    horarios: z.array(z.object({
        diaSemana: z.string(),
        horarioInicio: z.string(),
        horarioFim: z.string()
    })).min(1).optional(),
    departamento: z.string().optional().nullable(),
    periodoIdeal: z.number().int().min(1).max(10).optional().nullable(),
    preRequisitoId: z.string().uuid().optional().nullable(),
});

export class CriarDisciplinaDto {
    @ApiProperty({ example: 'BCC099' }) codigo!: string;
    @ApiProperty({ example: 'Nova Disciplina' }) nome!: string;
    @ApiPropertyOptional({ example: 'Descrição da disciplina' }) descricao?: string;
    @ApiPropertyOptional({ example: 'Prof. Dr. Fulano' }) professor?: string;
    @ApiProperty({ example: 4 }) creditos!: number;
    @ApiProperty({ example: 40 }) vagas!: number;
    @ApiProperty({ example: [{ diaSemana: 'Segunda', horarioInicio: '08:00', horarioFim: '10:00' }] }) horarios!: any[];
    @ApiPropertyOptional({ example: 'DC' }) departamento?: string;
    @ApiPropertyOptional({ example: 1 }) periodoIdeal?: number;
    @ApiPropertyOptional({ example: 'uuid-do-prerequisito' }) preRequisitoId?: string;
}

export class AtualizarDisciplinaDto {
    @ApiPropertyOptional({ example: 'Nome Atualizado' }) nome?: string;
    @ApiPropertyOptional({ example: 'Nova descrição' }) descricao?: string;
    @ApiPropertyOptional({ example: 'Prof. Dra. Beltrana' }) professor?: string;
    @ApiPropertyOptional({ example: 6 }) creditos?: number;
    @ApiPropertyOptional({ example: 50 }) vagas?: number;
    @ApiPropertyOptional({ example: [{ diaSemana: 'Terça', horarioInicio: '14:00', horarioFim: '16:00' }] }) horarios?: any[];
    @ApiPropertyOptional({ example: 'DM' }) departamento?: string;
    @ApiPropertyOptional({ example: 2 }) periodoIdeal?: number;
    @ApiPropertyOptional({ example: null }) preRequisitoId?: string | null;
}
