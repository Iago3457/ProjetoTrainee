import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    // ==================== DISCIPLINAS ====================

    async listarDisciplinas() {
        const semestreAtual = 1;
        const anoAtual = 2026;

        const disciplinas = await this.prisma.disciplina.findMany({
            include: {
                preRequisito: { select: { id: true, codigo: true, nome: true } },
                matriculas: {
                    where: { status: 'inscrito', semestre: semestreAtual, ano: anoAtual },
                },
                horarios: true,
            },
            orderBy: [{ periodoIdeal: 'asc' }, { codigo: 'asc' }],
        });

        return disciplinas.map((d) => ({
            id: d.id,
            codigo: d.codigo,
            nome: d.nome,
            descricao: d.descricao,
            professor: d.professor,
            creditos: d.creditos,
            vagas: d.vagas,
            horarios: d.horarios,
            departamento: d.departamento,
            periodoIdeal: d.periodoIdeal,
            preRequisito: d.preRequisito
                ? { id: d.preRequisito.id, codigo: d.preRequisito.codigo, nome: d.preRequisito.nome }
                : null,
            vagasOcupadas: d.matriculas.length,
        }));
    }

    async criarDisciplina(dados: {
        codigo: string;
        nome: string;
        descricao?: string;
        professor?: string;
        creditos: number;
        vagas: number;
        horarios: { diaSemana: string; horarioInicio: string; horarioFim: string }[];
        departamento?: string;
        periodoIdeal?: number;
        preRequisitoId?: string;
    }) {
        const existente = await this.prisma.disciplina.findUnique({
            where: { codigo: dados.codigo },
        });

        if (existente) {
            throw new ConflictException(`Já existe uma disciplina com o código ${dados.codigo}`);
        }

        if (dados.preRequisitoId) {
            const preReq = await this.prisma.disciplina.findUnique({
                where: { id: dados.preRequisitoId },
            });
            if (!preReq) {
                throw new BadRequestException('Pré-requisito não encontrado');
            }
        }

        return this.prisma.disciplina.create({
            data: {
                codigo: dados.codigo,
                nome: dados.nome,
                descricao: dados.descricao,
                professor: dados.professor,
                creditos: dados.creditos,
                vagas: dados.vagas,
                departamento: dados.departamento,
                periodoIdeal: dados.periodoIdeal,
                preRequisitoId: dados.preRequisitoId,
                horarios: {
                    create: dados.horarios,
                }
            }
        });
    }

    async atualizarDisciplina(
        id: string,
        dados: {
            nome?: string;
            descricao?: string;
            professor?: string;
            creditos?: number;
            vagas?: number;
            horarios?: { diaSemana: string; horarioInicio: string; horarioFim: string }[];
            departamento?: string;
            periodoIdeal?: number;
            preRequisitoId?: string | null;
        },
    ) {
        const disciplina = await this.prisma.disciplina.findUnique({ where: { id } });
        if (!disciplina) {
            throw new NotFoundException('Disciplina não encontrada');
        }

        if (dados.preRequisitoId) {
            const preReq = await this.prisma.disciplina.findUnique({
                where: { id: dados.preRequisitoId },
            });
            if (!preReq) {
                throw new BadRequestException('Pré-requisito não encontrado');
            }
        }

        return this.prisma.disciplina.update({ 
            where: { id }, 
            data: {
                nome: dados.nome,
                descricao: dados.descricao,
                professor: dados.professor,
                creditos: dados.creditos,
                vagas: dados.vagas,
                departamento: dados.departamento,
                periodoIdeal: dados.periodoIdeal,
                preRequisitoId: dados.preRequisitoId,
                ...(dados.horarios && {
                    horarios: {
                        deleteMany: {},
                        create: dados.horarios,
                    }
                })
            } 
        });
    }

    async excluirDisciplina(id: string) {
        const disciplina = await this.prisma.disciplina.findUnique({
            where: { id },
            include: { matriculas: true, dependentes: true },
        });

        if (!disciplina) {
            throw new NotFoundException('Disciplina não encontrada');
        }

        if (disciplina.matriculas.length > 0) {
            throw new BadRequestException(
                'Não é possível excluir uma disciplina com matrículas ativas.',
            );
        }

        if (disciplina.dependentes.length > 0) {
            throw new BadRequestException(
                'Não é possível excluir uma disciplina que é pré-requisito de outras.',
            );
        }

        return this.prisma.disciplina.delete({ where: { id } });
    }

    // ==================== MATRÍCULAS (Aprovação) ====================

    async listarMatriculasPendentes() {
        return this.prisma.matricula.findMany({
            where: { status: 'requisitada' },
            include: {
                aluno: { select: { id: true, nome: true, email: true, ra: true } },
                disciplina: { select: { id: true, codigo: true, nome: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async aprovarMatricula(matriculaId: string) {
        const matricula = await this.prisma.matricula.findUnique({ where: { id: matriculaId } });
        if (!matricula) throw new NotFoundException('Matrícula não encontrada');
        if (matricula.status !== 'requisitada') {
            throw new BadRequestException('Essa matrícula não está pendente de aprovação');
        }

        return this.prisma.matricula.update({
            where: { id: matriculaId },
            data: { status: 'inscrito' },
        });
    }

    async rejeitarMatricula(matriculaId: string) {
        const matricula = await this.prisma.matricula.findUnique({ where: { id: matriculaId } });
        if (!matricula) throw new NotFoundException('Matrícula não encontrada');
        if (matricula.status !== 'requisitada') {
            throw new BadRequestException('Essa matrícula não está pendente de aprovação');
        }

        return this.prisma.matricula.update({
            where: { id: matriculaId },
            data: { status: 'rejeitada' },
        });
    }
}
