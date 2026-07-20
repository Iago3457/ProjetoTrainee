import { Controller, Post, Get, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { AuthGuard } from '../auth/auth.guard';

import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Matrículas')
@ApiBearerAuth()
@Controller('matriculas')
export class MatriculasController {
    constructor(private readonly matriculasService: MatriculasService) {}

    @UseGuards(AuthGuard)
    @Get('minhas')
    @ApiOperation({ summary: 'Listar matérias inscritas do aluno logado' })
    @ApiResponse({ status: 200, description: 'Lista de matrículas retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiQuery({ name: 'ano', required: false, type: Number, description: 'Ano do semestre (ex: 2026)' })
    @ApiQuery({ name: 'semestre', required: false, type: Number, description: 'Semestre (1 ou 2)' })
    async listarMinhas(
        @Request() req,
        @Query('ano') ano?: string,
        @Query('semestre') semestre?: string
    ) {
        const alunoId = req.user.sub;
        return this.matriculasService.listarMinhasMatriculas(
            alunoId,
            ano ? parseInt(ano) : undefined,
            semestre ? parseInt(semestre) : undefined
        );
    }

    @UseGuards(AuthGuard)
    @Post(':disciplinaId/inscrever')
    @ApiOperation({ summary: 'Inscrever-se em uma disciplina' })
    @ApiParam({ name: 'disciplinaId', description: 'ID (UUID) da disciplina' })
    @ApiResponse({ status: 201, description: 'Inscrição realizada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Limite de créditos excedido, pré-requisito não cumprido ou disciplina não encontrada.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 409, description: 'Conflito de horário, já inscrito ou já concluiu a disciplina.' })
    async inscrever(
        @Request() req,
        @Param('disciplinaId') disciplinaId: string
    ) {
        const alunoId = req.user.sub;
        
        return this.matriculasService.inscrever(alunoId, disciplinaId);
    }

    @UseGuards(AuthGuard)
    @Delete(':matriculaId/cancelar')
    @ApiOperation({ summary: 'Cancelar uma inscrição do semestre atual' })
    @ApiParam({ name: 'matriculaId', description: 'ID (UUID) da matrícula' })
    @ApiResponse({ status: 200, description: 'Inscrição cancelada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Matrícula não encontrada, não pertence ao aluno, status inválido ou fora do semestre atual.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async cancelar(
        @Request() req,
        @Param('matriculaId') matriculaId: string
    ) {
        const alunoId = req.user.sub;
        return this.matriculasService.cancelarInscricao(alunoId, matriculaId);
    }
}
