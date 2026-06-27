import { Controller, Get, Query } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';

@Controller('disciplinas')
export class DisciplinasController {
    constructor(private readonly disciplinasService: DisciplinasService) {}

    @Get()
    async getDisciplinas(@Query('alunoId') alunoIdQuery: string) {
        if (!alunoIdQuery) {
            return { error: 'Forneça o alunoId na URL (?alunoId=...) para calcularmos o catálogo.'};
        }

        return this.disciplinasService.listarCatalogo(alunoIdQuery);
    }
}
