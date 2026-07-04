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
}
