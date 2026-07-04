import { Controller, Get, Query, UseGuards, Param, Request } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('disciplinas')
export class DisciplinasController {
    constructor(private readonly disciplinasService: DisciplinasService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getDisciplinas(@Query('alunoId') alunoIdQuery: string) {
        if (!alunoIdQuery) {
            return { error: 'Forneça o alunoId na URL (?alunoId=...) para calcularmos o catálogo.'};
        }

        return this.disciplinasService.listarCatalogo(alunoIdQuery);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getDetalhes(@Param('id') id: string, @Request() req) {
        const alunoId = req.user.sub;
        return this.disciplinasService.buscarDetalhes(id, alunoId);
    }
}
