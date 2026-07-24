import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const criarCursoSchema = z.object({
  nome: z.string().min(3, { error: 'O Nome deve ter no mínimo 3 caracteres' }),
  codigo: z.string().min(1, { error: 'O Código é obrigatório' }),
});

export const atualizarCursoSchema = z.object({
  nome: z.string().min(3, { error: 'O Nome deve ter no mínimo 3 caracteres' }).optional(),
  codigo: z.string().min(1, { error: 'O Código é obrigatório' }).optional(),
});

export class CriarCursoDto {
    @ApiProperty({ example: 'Bacharelado em Ciência da Computação', description: 'Nome do curso' })
    nome!: string;

    @ApiProperty({ example: 'BCC', description: 'Código único do curso' })
    codigo!: string;
}

export class AtualizarCursoDto {
    @ApiPropertyOptional({ example: 'Bacharelado em Sistemas de Informação', description: 'Novo nome do curso' })
    nome?: string;

    @ApiPropertyOptional({ example: 'BSI', description: 'Novo código do curso' })
    codigo?: string;
}
