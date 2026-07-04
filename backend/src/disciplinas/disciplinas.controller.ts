import { Controller, Get, Query, UseGuards, Param, Request } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { AuthGuard } from '../auth/auth.guard';

import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Disciplinas')
@ApiBearerAuth()
@Controller('disciplinas')
export class DisciplinasController {
    constructor(private readonly disciplinasService: DisciplinasService) {}

    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({ summary: 'Listar o catálogo de disciplinas disponíveis' })
    @ApiQuery({ name: 'alunoId', required: true, description: 'ID do aluno logado' })
    @ApiResponse({ status: 200, description: 'Catálogo retornado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async getDisciplinas(@Query('alunoId') alunoIdQuery: string) {
        if (!alunoIdQuery) {
            return { error: 'Forneça o alunoId na URL (?alunoId=...) para calcularmos o catálogo.'};
        }

        return this.disciplinasService.listarCatalogo(alunoIdQuery);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Buscar detalhes de uma disciplina' })
    @ApiParam({ name: 'id', description: 'ID da disciplina' })
    @ApiResponse({ status: 200, description: 'Detalhes retornados com sucesso.' })
    @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
    async getDetalhes(@Param('id') id: string, @Request() req) {
        const alunoId = req.user.sub;
        return this.disciplinasService.buscarDetalhes(id, alunoId);
    }
}
