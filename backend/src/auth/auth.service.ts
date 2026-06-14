import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CadastroDto } from './dto/auth.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

    async cadastrar(dados: CadastroDto) {
        const anoAtual = new Date().getFullYear().toString();
        const ultimoAluno = await this.prisma.aluno.findFirst({
            where : {
                ra: { startsWith: anoAtual}
            },
            orderBy: { ra: 'desc' }

        });
        let proximoNumero = 1;
        if (ultimoAluno) {
            const ultimoNumeroSequencial = parseInt(ultimoAluno.ra.substring(4));
            proximoNumero = ultimoNumeroSequencial + 1;
        }
        const raGerado = `${anoAtual}${String(proximoNumero).padStart(6, '0')}`;
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
                ra: raGerado,
                periodo: '1', //atualizar depois para calcular o período com base no semestre de ingresso
                semestre: `${anoAtual}.1`,  //atualizar depois para calcular o semestre de ingresso
            }
        });
        
        const { senha, ...alunoSalvo } = novoAluno;

        return {
            mensagem: 'Cadastro realizado com sucesso',
            aluno: alunoSalvo,
        };

    }
    async login(dados: LoginDto) {
        const aluno = await this.prisma.aluno.findUnique({
            where: { email: dados.email },
        });

        if (!aluno) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }
        
        const senhaValida = await bcrypt.compare(dados.senha, aluno.senha);

        if (!senhaValida) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        const payload = { sub: aluno.id, email: aluno.email };
        
        return {
            mensagem: 'Login realizado com sucesso',
            access_token: this.jwtService.sign(payload),
        }
    }
}
