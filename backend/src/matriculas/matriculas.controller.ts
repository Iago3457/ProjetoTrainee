import { Controller, Post, Get, Delete, Param, UseGuards, Request} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { AuthGuard } from '../auth/auth.guard';

import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

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
    async listarMinhas(@Request() req) {
        const alunoId = req.user.sub;
        return this.matriculasService.listarMinhasMatriculas(alunoId);
    }

    @UseGuards(AuthGuard)
    @Post(':disciplinaId/inscrever')
    @ApiOperation({ summary: 'Inscrever-se em uma disciplina' })
    @ApiParam({ name: 'disciplinaId', description: 'ID da disciplina' })
    @ApiResponse({ status: 201, description: 'Inscrição realizada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Limite de créditos excedido ou pré-requisito não cumprido.' })
    @ApiResponse({ status: 409, description: 'Conflito de horário ou já inscrito.' })
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
    @ApiParam({ name: 'matriculaId', description: 'ID da matrícula' })
    @ApiResponse({ status: 200, description: 'Inscrição cancelada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Matrícula não pertence ao semestre atual ou não encontrada.' })
    async cancelar(
        @Request() req,
        @Param('matriculaId') matriculaId: string
    ) {
        const alunoId = req.user.sub;
        return this.matriculasService.cancelarInscricao(alunoId, matriculaId);
    }
}
