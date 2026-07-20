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
    @ApiResponse({ status: 200, description: 'Lista de disciplinas retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado — token ausente, inválido ou usuário não é admin.' })
    async listarDisciplinas(@Request() req) {
        this.assertAdmin(req);
        return this.adminService.listarDisciplinas();
    }

    @UseGuards(AuthGuard)
    @Post('disciplinas')
    @ApiOperation({ summary: 'Criar uma nova disciplina' })
    @ApiBody({ type: CriarDisciplinaDto })
    @ApiResponse({ status: 201, description: 'Disciplina criada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos — falha na validação Zod (código, horários, créditos, etc.).' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 409, description: 'Conflito — já existe uma disciplina com este código.' })
    @UsePipes(new ZodValidationPipe(criarDisciplinaSchema))
    async criarDisciplina(@Request() req, @Body() body: CriarDisciplinaDto) {
        this.assertAdmin(req);
        return this.adminService.criarDisciplina(body);
    }

    @UseGuards(AuthGuard)
    @Put('disciplinas/:id')
    @ApiOperation({ summary: 'Atualizar uma disciplina existente' })
    @ApiParam({ name: 'id', description: 'ID (UUID) da disciplina' })
    @ApiBody({ type: AtualizarDisciplinaDto })
    @ApiResponse({ status: 200, description: 'Disciplina atualizada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos — falha na validação Zod ou pré-requisito inexistente.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
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
    @ApiParam({ name: 'id', description: 'ID (UUID) da disciplina' })
    @ApiResponse({ status: 200, description: 'Disciplina excluída com sucesso.' })
    @ApiResponse({ status: 400, description: 'Não é possível excluir — possui matrículas ativas ou é pré-requisito de outras.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Disciplina não encontrada.' })
    async excluirDisciplina(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.adminService.excluirDisciplina(id);
    }

    // ==================== MATRÍCULAS (Aprovação) ====================

    @UseGuards(AuthGuard)
    @Get('matriculas/pendentes')
    @ApiOperation({ summary: 'Listar matrículas pendentes de aprovação' })
    @ApiResponse({ status: 200, description: 'Lista de matrículas pendentes retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async listarPendentes(@Request() req) {
        this.assertAdmin(req);
        return this.adminService.listarMatriculasPendentes();
    }

    @UseGuards(AuthGuard)
    @Put('matriculas/:id/aprovar')
    @ApiOperation({ summary: 'Aprovar uma matrícula requisitada' })
    @ApiParam({ name: 'id', description: 'ID (UUID) da matrícula' })
    @ApiResponse({ status: 200, description: 'Matrícula aprovada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Matrícula não está pendente de aprovação.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Matrícula não encontrada.' })
    async aprovarMatricula(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.adminService.aprovarMatricula(id);
    }

    @UseGuards(AuthGuard)
    @Put('matriculas/:id/rejeitar')
    @ApiOperation({ summary: 'Rejeitar uma matrícula requisitada' })
    @ApiParam({ name: 'id', description: 'ID (UUID) da matrícula' })
    @ApiResponse({ status: 200, description: 'Matrícula rejeitada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Matrícula não está pendente de aprovação.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Matrícula não encontrada.' })
    async rejeitarMatricula(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.adminService.rejeitarMatricula(id);
    }
}
