import { PrismaClient, Aluno } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
async function main() {

    console.log('Limpando o banco de dados...');
    await prisma.matricula.deleteMany();
    await prisma.disciplina.deleteMany();
    await prisma.aluno.deleteMany();

    console.log('Semeando alunos falsos...');

    const senhaPadraoHash = await bcrypt.hash('123456', 10);
    const alunosCriados: Aluno[] = [];
    for (let i = 0; i < 15; i ++) {
        const alunos = await prisma.aluno.create({
            data: {
                nome: faker.person.fullName(),
                email: faker.internet.email({ provider: 'estudante.ufscar.br'}),
                senha: senhaPadraoHash,
                ra: `2026${faker.string.numeric(6)}`,
                periodo: `${faker.number.int({ min: 1, max: 8 })}º`,
                semestre: '2026.1',
            },
        });
        alunosCriados.push(alunos);
    }

    console.log('Seed concluído!');

    console.log('Semeando disciplinas...');

    const calc1 = await prisma.disciplina.create({
        data: {
            codigo: 'MAT101', nome: 'Cálculo Diferencial e Integral I', creditos: 6, vagas: 40, horario: 'Segunda, Quarta e Sexta. 08h-10h'
        },
    });
    const cap = await prisma.disciplina.create({
        data: { 
            codigo: 'BCC101', nome: 'Construção de Algoritmos e Programação', creditos: 8, vagas: 40, horario: 'Segunda e Quarta. 14h-18h'
        },
    });

    const calc2 = await prisma.disciplina.create({
        data: {
            codigo: 'MAT102', nome: 'Cálculo Diferencial e Séries', creditos: 6, vagas: 40, horario: 'Segunda, Quarta e Sexta. 08h-10h'
        },
    });

    const aed = await prisma.disciplina.create({
        data: {
            codigo: 'BCC102', nome: 'Algoritmos e Estruturas de Dados', creditos: 8, vagas: 40, horario: 'Terça e Quinta. 14h-18h'
        },
    });
        
    console.log('Seed concluído!');

    console.log('Semeando matrículas...');
    
    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: calc1.id,
            status: 'inscrito',
            ano: 2025,
            semestre: 2,
        },
    });

    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: cap.id,
            status: 'inscrito',
            ano: 2025,
            semestre: 2,
        },
    });

    console.log('Tudo Pronto! Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });