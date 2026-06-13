import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CadastroDto } from './dto/auth.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async cadastrar(dados: CadastroDto) {
        const alunoExistente = await this.prisma.aluno.findUnique({
            where: { email: dados.email },
        });
        
        if (alunoExistente) {
            throw new ConflictException('Email já cadastrado');
        }

        const salt = 10;
        const senhaHash = await bcrypt.hash(dados.senha, salt);

        const novoAluno = await this.prisma.aluno.create({
            data: {
                nome: dados.nome,
                email: dados.email,
                senha: senhaHash,
            }
        });
        
        const { senha, ...alunoSalvo } = novoAluno;

        return {
            mensagem: 'Cadastro realizado com sucesso',
            aluno: alunoSalvo,
        };

    }
}
