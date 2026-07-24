import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CursosService {
    constructor(private readonly prisma: PrismaService) {}

    async listarCursos() {
        return this.prisma.curso.findMany({
            include: {
                _count: { select: { disciplinas: true, alunos: true } },
            },
            orderBy: { nome: 'asc' },
        });
    }

    async listarCursosPublico() {
        return this.prisma.curso.findMany({
            select: { id: true, nome: true, codigo: true },
            orderBy: { nome: 'asc' },
        });
    }

    async criarCurso(dados: { nome: string; codigo: string }) {
        const existente = await this.prisma.curso.findUnique({
            where: { codigo: dados.codigo },
        });

        if (existente) {
            throw new ConflictException(`Já existe um curso com o código ${dados.codigo}`);
        }

        return this.prisma.curso.create({
            data: {
                nome: dados.nome,
                codigo: dados.codigo,
            },
        });
    }

    async atualizarCurso(id: string, dados: { nome?: string; codigo?: string }) {
        const curso = await this.prisma.curso.findUnique({ where: { id } });
        if (!curso) {
            throw new NotFoundException('Curso não encontrado');
        }

        if (dados.codigo && dados.codigo !== curso.codigo) {
            const existente = await this.prisma.curso.findUnique({
                where: { codigo: dados.codigo },
            });
            if (existente) {
                throw new ConflictException(`Já existe um curso com o código ${dados.codigo}`);
            }
        }

        return this.prisma.curso.update({
            where: { id },
            data: {
                ...(dados.nome && { nome: dados.nome }),
                ...(dados.codigo && { codigo: dados.codigo }),
            },
        });
    }

    async excluirCurso(id: string) {
        const curso = await this.prisma.curso.findUnique({
            where: { id },
            include: { _count: { select: { alunos: true } } },
        });

        if (!curso) {
            throw new NotFoundException('Curso não encontrado');
        }

        if (curso._count.alunos > 0) {
            throw new BadRequestException(
                'Não é possível excluir um curso que possui alunos vinculados.',
            );
        }

        return this.prisma.curso.delete({ where: { id } });
    }
}
