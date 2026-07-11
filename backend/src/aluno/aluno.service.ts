import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlunoService {
    constructor(private readonly prisma: PrismaService) {}

    async atualizarAvatar(alunoId: string, avatarUrl: string) {
        const aluno = await this.prisma.aluno.findUnique({
            where: { id: alunoId }
        });

        if (!aluno) {
            throw new NotFoundException('Aluno não encontrado');
        }

        const alunoAtualizado = await this.prisma.aluno.update({
            where: { id: alunoId },
            data: { avatar: avatarUrl }
        });

        return {
            mensagem: 'Avatar atualizado com sucesso',
            avatarUrl: alunoAtualizado.avatar
        };
    }
}
