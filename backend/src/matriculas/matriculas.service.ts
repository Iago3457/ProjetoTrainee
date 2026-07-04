import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatriculasService {
    constructor(private readonly prisma: PrismaService) {}

    async inscrever(alunoId: string, disciplinaId: string) {
        const anoAtual = new Date().getFullYear();
        const semestreAtual = 1;

        const disciplinaAlvo = await this.prisma.disciplina.findUnique({
            where: { id: disciplinaId },
            include: { preRequisito: true }
        });

        if (!disciplinaAlvo) {
            throw new BadRequestException('Disciplina não encontrada');
        }

        const historicoAluno = await this.prisma.matricula.findMany({
            where: { alunoId: alunoId },
            include: { disciplina: true },
        });

        const matriculasAtuais = historicoAluno.filter(
            (m) => m.status === 'inscrito' && m.ano === anoAtual && m.semestre === semestreAtual
        );

        const jaInscrito = matriculasAtuais.some(m => m.disciplinaID === disciplinaId);
        if (jaInscrito) {
            throw new ConflictException('Você já está inscrito nesta disciplina');
        }

        const conflitoHorario = matriculasAtuais.find(
            m => m.disciplina.horario === disciplinaAlvo.horario
        );
        if (conflitoHorario) {
            throw new ConflictException(`Conflito de horário com a disciplina: ${conflitoHorario.disciplina.nome}`);
        }

        const creditosAtuais = matriculasAtuais.reduce((total, m) => total + m.disciplina.creditos, 0);
        if (creditosAtuais + disciplinaAlvo.creditos > 24) {
            throw new BadRequestException('Limite de créditos atingido');
        }

        if (disciplinaAlvo.preRequisitoId) {
            const cumpriuRequisito = historicoAluno.some(
                m => m.disciplinaID === disciplinaAlvo.preRequisitoId && (m.status === 'aprovado' || m.status === 'concluida')
            );
            if (!cumpriuRequisito) {
                throw new BadRequestException(`Pré-requisito ${disciplinaAlvo.preRequisito?.codigo} não cumprido`)
            }
        }

        const novaMatricula = await this.prisma.matricula.create({
            data: {
                alunoId: alunoId,
                disciplinaID: disciplinaId,
                ano: anoAtual,
                semestre: semestreAtual,
                status: 'inscrito'
            }
        })

        return {
            mensagem: 'Inscrição realizada com sucesso!',
            matricula: novaMatricula,
        };
    }

    async listarMinhasMatriculas(alunoId: string) {
        const anoAtual = new Date().getFullYear();
        const semestreAtual = 1;

        const matriculas = await this.prisma.matricula.findMany({
            where: {
                alunoId,
                ano: anoAtual,
                semestre: semestreAtual,
            },
            include: {
                disciplina: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const creditosAtuais = matriculas
            .filter(m => m.status === 'inscrito' || m.status === 'confirmada')
            .reduce((total, m) => total + m.disciplina.creditos, 0);

        const materiasFormatadas = matriculas.map((m) => ({
            matriculaId: m.id,
            disciplinaId: m.disciplina.id,
            codigo: m.disciplina.codigo,
            nome: m.disciplina.nome,
            creditos: m.disciplina.creditos,
            horario: m.disciplina.horario,
            status: m.status,
            semestre: `${anoAtual}.${semestreAtual}`,
        }));

        return {
            creditosAtuais,
            materias: materiasFormatadas,
        };
    }

    async cancelarInscricao(alunoId: string, matriculaId: string) {
        const matricula = await this.prisma.matricula.findUnique({
            where: { id: matriculaId },
            include: { disciplina: true },
        });

        if (!matricula) {
            throw new BadRequestException('Matrícula não encontrada');
        }

        if (matricula.alunoId !== alunoId) {
            throw new BadRequestException('Matrícula não pertence a este aluno');
        }

        if (matricula.status !== 'inscrito') {
            throw new BadRequestException('Somente matrículas com status "inscrito" podem ser canceladas');
        }
        const anoAtual = new Date().getFullYear();
        const semestreAtual = 1;

        if (matricula.ano !== anoAtual || matricula.semestre !== semestreAtual) {
            throw new BadRequestException('Somente matrículas do semestre atual podem ser canceladas');
        }
        
        await this.prisma.matricula.delete({
            where: { id: matriculaId },
        });

        return {
            mensagem: `Inscrição em ${matricula.disciplina.nome} cancelada com sucesso.`,
        };
    }
}
