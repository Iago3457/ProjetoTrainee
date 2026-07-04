import { Controller, Post, Get, Delete, Param, UseGuards, Request} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('matriculas')
export class MatriculasController {
    constructor(private readonly matriculasService: MatriculasService) {}

    @UseGuards(AuthGuard)
    @Get('minhas')
    async listarMinhas(@Request() req) {
        const alunoId = req.user.sub;
        return this.matriculasService.listarMinhasMatriculas(alunoId);
    }

    @UseGuards(AuthGuard)
    @Post(':disciplinaId/inscrever')
    async inscrever(
        @Request() req,
        @Param('disciplinaId') disciplinaId: string
    ) {
        const alunoId = req.user.sub;
        
        return this.matriculasService.inscrever(alunoId, disciplinaId);
    }

    @UseGuards(AuthGuard)
    @Delete(':matriculaId/cancelar')
    async cancelar(
        @Request() req,
        @Param('matriculaId') matriculaId: string
    ) {
        const alunoId = req.user.sub;
        return this.matriculasService.cancelarInscricao(alunoId, matriculaId);
    }
}
