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
            codigo: 'MAT101',
            nome: 'Cálculo Diferencial e Integral I',
            descricao: 'Introdução ao cálculo diferencial e integral de funções de uma variável real. Aborda limites, continuidade, derivadas e integrais, com aplicações em problemas de otimização e áreas.',
            professor: 'Prof. Dr. Ricardo Almeida',
            creditos: 6,
            vagas: 40,
            horario: 'Segunda, Quarta e Sexta. 08h-10h'
        },
    });
    const cap = await prisma.disciplina.create({
        data: { 
            codigo: 'BCC101',
            nome: 'Construção de Algoritmos e Programação',
            descricao: 'Fundamentos de lógica de programação e resolução de problemas computacionais. Introdução à linguagem C, estruturas de controle, funções, vetores e matrizes.',
            professor: 'Profa. Dra. Ana Paula Ferreira',
            creditos: 8,
            vagas: 40,
            horario: 'Segunda e Quarta. 14h-18h'
        },
    });

    const calc2 = await prisma.disciplina.create({
        data: {
            codigo: 'MAT102',
            nome: 'Cálculo Diferencial e Séries',
            descricao: 'Continuação do estudo de cálculo com foco em séries numéricas, sequências, séries de potências e séries de Taylor. Inclui técnicas de integração avançadas e aplicações.',
            professor: 'Prof. Dr. Ricardo Almeida',
            creditos: 6,
            vagas: 40,
            horario: 'Segunda, Quarta e Sexta. 08h-10h',
            preRequisitoId: calc1.id
        },
    });

    const aed = await prisma.disciplina.create({
        data: {
            codigo: 'BCC102',
            nome: 'Algoritmos e Estruturas de Dados',
            descricao: 'Estudo de estruturas de dados fundamentais (listas, pilhas, filas, árvores, grafos) e seus algoritmos associados. Análise de complexidade e técnicas de ordenação e busca.',
            professor: 'Prof. Dr. Marcos Vinícius Costa',
            creditos: 8,
            vagas: 40,
            horario: 'Terça e Quinta. 14h-18h',
            preRequisitoId: cap.id
        },
    });
    const calc3 = await prisma.disciplina.create({
        data: {
            codigo: 'MAT103',
            nome: 'Cálculo Vetorial e Geometria Analítica',
            descricao: 'Estudo de vetores, retas e planos no espaço. Funções de várias variáveis, derivadas parciais e integrais múltiplas.',
            professor: 'Prof. Dr. Ricardo Almeida',
            creditos: 6,
            vagas: 40,
            horario: 'Terça e Quinta. 08h-10h',
            preRequisitoId: calc2.id
        },
    });
        
    console.log('Seed concluído!');

    console.log('Semeando matrículas...');
    
    // Matérias concluídas (Aprovadas em semestres anteriores)
    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: calc1.id,
            status: 'aprovado',
            ano: 2025,
            semestre: 1,
        },
    });

    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: calc2.id,
            status: 'aprovado',
            ano: 2025,
            semestre: 2,
        },
    });

    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: cap.id,
            status: 'aprovado',
            ano: 2025,
            semestre: 2,
        },
    });

    // Matérias atuais (Inscrito no semestre atual 2026.1 para aparecer no Minhas Matérias)
    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: aed.id,
            status: 'inscrito',
            ano: 2026,
            semestre: 1,
        },
    });

    await prisma.matricula.create({
        data: {
            alunoId: alunosCriados[0].id,
            disciplinaID: calc3.id,
            status: 'inscrito',
            ano: 2026,
            semestre: 1,
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