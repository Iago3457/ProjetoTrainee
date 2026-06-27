import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
}
