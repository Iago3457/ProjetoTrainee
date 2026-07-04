import { Controller, Post, Param, UseGuards, Request} from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('matriculas')
export class MatriculasController {
    constructor(private readonly matriculasService: MatriculasService) {}

    @UseGuards(AuthGuard)
    @Post(':disciplinaId/inscrever')
    async inscrever(
        @Request() req,
        @Param('disciplinaId') disciplinaId: string
    ) {
        const alunoId = req.user.sub;
        
        return this.matriculasService.inscrever(alunoId, disciplinaId);
    }
}
