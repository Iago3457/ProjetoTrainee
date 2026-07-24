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
import { CursosService } from './cursos.service';
import { AuthGuard } from '../auth/auth.guard';
import { ZodValidationPipe } from '../auth/zod-validation.pipe';
import { CriarCursoDto, AtualizarCursoDto, criarCursoSchema, atualizarCursoSchema } from './dto/cursos.schema';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ApiTags('Cursos')
@Controller()
export class CursosController {
    constructor(private readonly cursosService: CursosService) {}

    private assertAdmin(req: any) {
        if (!req.user?.role || req.user.role !== 'admin') {
            throw new UnauthorizedException('Acesso restrito a administradores.');
        }
    }

    @Get('cursos')
    @ApiOperation({ summary: 'Listar cursos disponíveis (público)' })
    @ApiResponse({ status: 200, description: 'Lista de cursos retornada com sucesso.' })
    async listarCursosPublico() {
        return this.cursosService.listarCursosPublico();
    }

    @UseGuards(AuthGuard)
    @Get('admin/cursos')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todos os cursos com contadores (admin)' })
    @ApiResponse({ status: 200, description: 'Lista de cursos retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async listarCursos(@Request() req) {
        this.assertAdmin(req);
        return this.cursosService.listarCursos();
    }

    @UseGuards(AuthGuard)
    @Post('admin/cursos')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar um novo curso' })
    @ApiBody({ type: CriarCursoDto })
    @ApiResponse({ status: 201, description: 'Curso criado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 409, description: 'Código de curso já existe.' })
    @UsePipes(new ZodValidationPipe(criarCursoSchema))
    async criarCurso(@Request() req, @Body() body: CriarCursoDto) {
        this.assertAdmin(req);
        return this.cursosService.criarCurso(body);
    }

    @UseGuards(AuthGuard)
    @Put('admin/cursos/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar um curso existente' })
    @ApiParam({ name: 'id', description: 'ID (UUID) do curso' })
    @ApiBody({ type: AtualizarCursoDto })
    @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
    @UsePipes(new ZodValidationPipe(atualizarCursoSchema))
    async atualizarCurso(@Request() req, @Param('id') id: string, @Body() body: AtualizarCursoDto) {
        this.assertAdmin(req);
        return this.cursosService.atualizarCurso(id, body);
    }

    @UseGuards(AuthGuard)
    @Delete('admin/cursos/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir um curso' })
    @ApiParam({ name: 'id', description: 'ID (UUID) do curso' })
    @ApiResponse({ status: 200, description: 'Curso excluído com sucesso.' })
    @ApiResponse({ status: 400, description: 'Curso possui alunos vinculados.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
    async excluirCurso(@Request() req, @Param('id') id: string) {
        this.assertAdmin(req);
        return this.cursosService.excluirCurso(id);
    }
}
