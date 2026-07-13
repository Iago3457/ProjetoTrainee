import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    UnauthorizedException,
    UsePipes,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';
import {
    criarDisciplinaSchema,
    atualizarDisciplinaSchema,
    CriarDisciplinaDto,
    AtualizarDisciplinaDto,
} from './dto/admin.schema';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    private assertAdmin(req: any) {
        if (!req.user?.role || req.user.role !== 'admin') {
            throw new UnauthorizedException('Acesso restrito a administradores.');
        }
    }

    // ==================== DISCIPLINAS ====================

    @UseGuards(AuthGuard)
    @Get('disciplinas')
    @ApiOperation({ summary: 'Listar todas as disciplinas com lotação' })
    @ApiResponse({ status: 200, description: 'Lista de disciplinas.' })
    async listarDisciplinas(@Request() req) {
        this.assertAdmin(req);
        return this.adminService.listarDisciplinas();
    }

    @UseGuards(AuthGuard)
    @Post('disciplinas')
    @ApiOperation({ summary: 'Criar uma nova disciplina' })
    @ApiBody({ type: CriarDisciplinaDto })
    @ApiResponse({ status: 201, description: 'Disciplina criada.' })
    @UsePipes(new ZodValidationPipe(criarDisciplinaSchema))
    async criarDisciplina(@Request() req, @Body() body: CriarDisciplinaDto) {
        this.assertAdmin(req);
        return this.adminService.criarDisciplina(body);
    }

    @UseGuards(AuthGuard)
    @Put('disciplinas/:id')
    @ApiOperation({ summary: 'Atualizar uma disciplina existente' })
    @ApiParam({ name: 'id', description: 'ID da disciplina' })
    @ApiBody({ type: AtualizarDisciplinaDto })
    @ApiResponse({ status: 200, description: 'Disciplina atualizada.' })
    async atualizarDisciplina(
        @Request() req,
        @Param('id') id: string,
        @Body(new ZodValidationPipe(atualizarDisciplinaSchema)) body: AtualizarDisciplinaDto,
    ) {
        this.assertAdmin(req);
        return this.adminService.atualizarDisciplina(id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('disciplinas/:id')
    @ApiOperation({ summary: 'Excluir uma disciplina' })
    @ApiParam({ name: 'id', description: 'ID da disciplina' })
    @ApiResponse({ status: 200, description: 'Disciplina excluída.' })
    async excluirDisciplina(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.adminService.excluirDisciplina(id);
    }

    // ==================== MATRÍCULAS (Aprovação) ====================

    @UseGuards(AuthGuard)
    @Get('matriculas/pendentes')
    @ApiOperation({ summary: 'Listar matrículas pendentes de aprovação' })
    @ApiResponse({ status: 200, description: 'Lista de matrículas pendentes.' })
    async listarPendentes(@Request() req) {
        this.assertAdmin(req);
        return this.adminService.listarMatriculasPendentes();
    }

    @UseGuards(AuthGuard)
    @Put('matriculas/:id/aprovar')
    @ApiOperation({ summary: 'Aprovar uma matrícula requisitada' })
    @ApiParam({ name: 'id', description: 'ID da matrícula' })
    @ApiResponse({ status: 200, description: 'Matrícula aprovada.' })
    async aprovarMatricula(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.adminService.aprovarMatricula(id);
    }

    @UseGuards(AuthGuard)
    @Put('matriculas/:id/rejeitar')
    @ApiOperation({ summary: 'Rejeitar uma matrícula requisitada' })
    @ApiParam({ name: 'id', description: 'ID da matrícula' })
    @ApiResponse({ status: 200, description: 'Matrícula rejeitada.' })
    async rejeitarMatricula(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.adminService.rejeitarMatricula(id);
    }
}
