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
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { AuthGuard } from '../auth/auth.guard';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CriarCursoDto {
    @ApiProperty({ example: 'Bacharelado em Ciência da Computação', description: 'Nome do curso' })
    nome!: string;

    @ApiProperty({ example: 'BCC', description: 'Código único do curso' })
    codigo!: string;
}

class AtualizarCursoDto {
    @ApiPropertyOptional({ example: 'Bacharelado em Sistemas de Informação', description: 'Novo nome do curso' })
    nome?: string;

    @ApiPropertyOptional({ example: 'BSI', description: 'Novo código do curso' })
    codigo?: string;
}

@ApiTags('Cursos')
@Controller()
export class CursosController {
    constructor(private readonly cursosService: CursosService) {}

    private assertAdmin(req: any) {
        if (!req.user?.role || req.user.role !== 'admin') {
            throw new UnauthorizedException('Acesso restrito a administradores.');
        }
    }

    // Endpoint público para listagem de cursos (usado no signup)
    @Get('cursos')
    @ApiOperation({ summary: 'Listar cursos disponíveis (público)' })
    @ApiResponse({ status: 200, description: 'Lista de cursos retornada com sucesso.' })
    async listarCursosPublico() {
        return this.cursosService.listarCursosPublico();
    }

    // Endpoints admin
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
