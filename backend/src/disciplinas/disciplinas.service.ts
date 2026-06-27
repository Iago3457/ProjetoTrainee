import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisciplinasService {
    constructor(private readonly prisma: PrismaService) {}

    async listarCatalogo(alunoId: string) {
        const semestreAtual = 1;
        const anoAtual = 2026;

        const disciplinas = await this.prisma.disciplina.findMany({
            include: {
                preRequisito: true,
                matriculas: {
                    where: { status: 'inscrito', semestre: semestreAtual, ano: anoAtual }
                }
            }
        });

        const historicoAluno = await this.prisma.matricula.findMany({
            where: { alunoId: alunoId }
        });

        // Calcula quantos créditos já foram utilizados neste semestre
        const matriculasAtuais = historicoAluno.filter(
            (m) => m.status === 'inscrito' && m.semestre === semestreAtual && m.ano === anoAtual
        );

        let creditosAtuais = 0;

        for (const mat of matriculasAtuais) {
            const disc = disciplinas.find(d => d.id === mat.disciplinaID);
            if (disc) {
                creditosAtuais += disc.creditos;
            }
        }

        const limiteCreditosAtingido = creditosAtuais >= 24;

        const catalogoFormatado = disciplinas.map((disciplina) => {
            const jaInscrito = matriculasAtuais.some((m) => m.disciplinaID === disciplina.id);

            let infoPreRequisito: { atendido: boolean; mensagem: string } | null = null;

            if (disciplina.preRequisitoId) {
                const passouNoRequisito = historicoAluno.some(
                    (m) => m.disciplinaID === disciplina.preRequisitoId && m.status === 'aprovado'
                );

                infoPreRequisito = {
                    atendido: passouNoRequisito,
                    mensagem: passouNoRequisito
                        ? `Pré-requisito: ${disciplina.preRequisito!.codigo} (Aprovado)`
                        : `Falta: ${disciplina.preRequisito!.codigo}`
                };
            }

            const vagasOcupadas = disciplina.matriculas.length;

            let statusInscricao = 'disponivel';

            if (jaInscrito) {
                statusInscricao = 'inscrito';
            } else if (infoPreRequisito && !infoPreRequisito.atendido) {
                statusInscricao = 'indisponivel';
            }

            return {
                id: disciplina.id,
                codigo: disciplina.codigo,
                nome: disciplina.nome,
                creditos: disciplina.creditos,
                vagasTotais: disciplina.vagas,
                horario: disciplina.horario,
                vagasOcupadas: vagasOcupadas,
                limiteCreditosAtingido: limiteCreditosAtingido,
                infoPreRequisito: infoPreRequisito,
                statusInscricao: statusInscricao,
            };
        });

        return {
            creditosAtuais,
            limiteCreditosAtingido,
            disciplinas: catalogoFormatado,
        };
    }
}
