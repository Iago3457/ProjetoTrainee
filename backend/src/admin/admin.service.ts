import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    // ==================== DISCIPLINAS ====================

    async listarDisciplinas() {
        const { semestre: semestreAtual, ano: anoAtual } = await this.prisma.getSemestreAtual();

        const disciplinas = await this.prisma.disciplina.findMany({
            include: {
                preRequisito: { select: { id: true, codigo: true, nome: true } },
                matriculas: {
                    where: { status: 'inscrito', semestre: semestreAtual, ano: anoAtual },
                    include: {
                        aluno: { select: { id: true, nome: true, email: true, ra: true } }
                    }
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
            inscritos: d.matriculas.map(m => m.aluno),
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

    // ==================== GESTÃO DE SEMESTRE ====================

    async obterSemestreAtual() {
        return this.prisma.getSemestreAtual();
    }

    async listarMatriculasSemestre(anoQuery?: number, semestreQuery?: number) {
        const config = await this.prisma.getSemestreAtual();
        const ano = anoQuery || config.ano;
        const semestre = semestreQuery || config.semestre;

        const matriculas = await this.prisma.matricula.findMany({
            where: { ano, semestre, status: { not: 'rejeitada' } }, // não traz as rejeitadas
            include: {
                aluno: { select: { id: true, nome: true, email: true, ra: true } },
                disciplina: { select: { id: true, codigo: true, nome: true } },
            },
            orderBy: { aluno: { nome: 'asc' } },
        });

        // Agrupar por disciplina para facilitar o frontend
        const porDisciplina = new Map<string, any>();

        for (const m of matriculas) {
            if (!porDisciplina.has(m.disciplina.id)) {
                porDisciplina.set(m.disciplina.id, {
                    disciplina: m.disciplina,
                    matriculas: [],
                });
            }
            porDisciplina.get(m.disciplina.id).matriculas.push({
                matriculaId: m.id,
                status: m.status,
                aluno: m.aluno,
            });
        }

        return Array.from(porDisciplina.values());
    }

    async definirStatusMatriculas(matriculas: { matriculaId: string; status: string }[]) {
        // Como o SQLite/Prisma não suporta updateMany com múltiplos valores diferentes fácil, 
        // fazemos um update em loop ou $transaction
        const operations = matriculas.map((m) =>
            this.prisma.matricula.update({
                where: { id: m.matriculaId },
                data: { status: m.status },
            })
        );

        await this.prisma.$transaction(operations);

        return { mensagem: 'Status atualizados com sucesso.' };
    }

    async avancarSemestre() {
        const { ano, semestre } = await this.prisma.getSemestreAtual();

        // 1. Marcar matrículas "inscrito" ou "requisitada" como "reprovado"
        await this.prisma.matricula.updateMany({
            where: {
                ano,
                semestre,
                status: { in: ['inscrito', 'requisitada'] }
            },
            data: {
                status: 'reprovado'
            }
        });

        // 2. Calcular o próximo semestre
        let proxAno = ano;
        let proxSemestre = semestre;

        if (semestre === 1) {
            proxSemestre = 2;
        } else {
            proxSemestre = 1;
            proxAno += 1;
        }

        // Obter todos os alunos para avançar o período (que é String no banco)
        const alunos = await this.prisma.aluno.findMany();
        const updateAlunos = alunos.map(aluno => {
            const currentPeriodo = parseInt(aluno.periodo, 10);
            const nextPeriodo = isNaN(currentPeriodo) ? aluno.periodo : (currentPeriodo + 1).toString();
            return this.prisma.aluno.update({
                where: { id: aluno.id },
                data: { periodo: nextPeriodo }
            });
        });

        // 3. Atualizar configurações no banco
        await this.prisma.$transaction([
            this.prisma.config.update({
                where: { chave: 'anoAtual' },
                data: { valor: proxAno.toString() }
            }),
            this.prisma.config.update({
                where: { chave: 'semestreAtual' },
                data: { valor: proxSemestre.toString() }
            }),
            ...updateAlunos
        ]);

        return {
            mensagem: 'Semestre avançado com sucesso!',
            novoSemestre: { ano: proxAno, semestre: proxSemestre }
        };
    }
}
