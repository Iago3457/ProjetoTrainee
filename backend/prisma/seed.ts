import { PrismaClient, Aluno, Disciplina } from '@prisma/client';
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
    console.log('🧹 Limpando o banco de dados...');
    await prisma.matricula.deleteMany();
    await prisma.disciplina.deleteMany();
    await prisma.aluno.deleteMany();
    await prisma.admin.deleteMany();

    const senhaPadraoHash = await bcrypt.hash('123456', 10);

    // ============================================================
    // 1º SEMESTRE — Disciplinas (sem pré-requisitos)
    // ============================================================
    console.log('📚 Criando disciplinas do 1º semestre...');

    const calc1 = await prisma.disciplina.create({
        data: {
            codigo: 'MAT001',
            nome: 'Cálculo Diferencial e Integral 1',
            descricao: 'Introdução ao cálculo diferencial e integral de funções de uma variável real. Limites, continuidade, derivadas e integrais com aplicações.',
            professor: 'Prof. Dr. Ricardo Almeida',
            creditos: 6,
            vagas: 40,
            horario: 'Segunda, Quarta e Sexta. 08h-10h',
            departamento: 'DM',
            periodoIdeal: 1,
        },
    });

    const matDiscreta = await prisma.disciplina.create({
        data: {
            codigo: 'BCC001',
            nome: 'Matemática Discreta',
            descricao: 'Fundamentos de lógica proposicional, teoria dos conjuntos, relações, funções, indução matemática, combinatória e grafos.',
            professor: 'Prof. Dr. Carlos Eduardo Lima',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 08h-10h',
            departamento: 'DC',
            periodoIdeal: 1,
        },
    });

    const ipa = await prisma.disciplina.create({
        data: {
            codigo: 'BCC002',
            nome: 'Introdução ao Pensamento Algorítmico',
            descricao: 'Desenvolvimento do raciocínio lógico e computacional por meio de técnicas de resolução de problemas e criação de algoritmos.',
            professor: 'Profa. Dra. Fernanda Oliveira',
            creditos: 2,
            vagas: 40,
            horario: 'Sexta. 10h-12h',
            departamento: 'DC',
            periodoIdeal: 1,
        },
    });

    const cap = await prisma.disciplina.create({
        data: {
            codigo: 'BCC003',
            nome: 'Construção de Algoritmos e Programação',
            descricao: 'Fundamentos de lógica de programação e resolução de problemas computacionais. Introdução à linguagem C, estruturas de controle, funções, vetores e matrizes.',
            professor: 'Profa. Dra. Ana Paula Ferreira',
            creditos: 8,
            vagas: 40,
            horario: 'Segunda e Quarta. 14h-18h',
            departamento: 'DC',
            periodoIdeal: 1,
        },
    });

    const logDigital = await prisma.disciplina.create({
        data: {
            codigo: 'BCC004',
            nome: 'Lógica Digital',
            descricao: 'Sistemas de numeração, álgebra booleana, portas lógicas, circuitos combinacionais e sequenciais, flip-flops e registradores.',
            professor: 'Prof. Dr. João Henrique Souza',
            creditos: 6,
            vagas: 40,
            horario: 'Terça e Quinta. 14h-17h',
            departamento: 'DC',
            periodoIdeal: 1,
        },
    });

    // ============================================================
    // 2º SEMESTRE — Disciplinas
    // ============================================================
    console.log('📚 Criando disciplinas do 2º semestre...');

    const geomAnalitica = await prisma.disciplina.create({
        data: {
            codigo: 'MAT002',
            nome: 'Geometria Analítica',
            descricao: 'Estudo de vetores, retas e planos no espaço. Coordenadas cartesianas, cônicas e quádricas.',
            professor: 'Prof. Dr. Marcos Vinícius Costa',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 08h-10h',
            departamento: 'DM',
            periodoIdeal: 2,
        },
    });

    const estatBasica = await prisma.disciplina.create({
        data: {
            codigo: 'DEs001',
            nome: 'Estatística Básica',
            descricao: 'Conceitos fundamentais de estatística descritiva e inferencial. Distribuições de probabilidade, estimação e testes de hipóteses.',
            professor: 'Profa. Dra. Luciana Mendes',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 08h-10h',
            departamento: 'DEs',
            periodoIdeal: 2,
        },
    });

    const logMatematica = await prisma.disciplina.create({
        data: {
            codigo: 'BCC005',
            nome: 'Lógica Matemática',
            descricao: 'Lógica proposicional e de predicados, métodos de demonstração, sistemas formais e introdução à teoria da computabilidade.',
            professor: 'Prof. Dr. Paulo Roberto Santos',
            creditos: 4,
            vagas: 40,
            horario: 'Sexta. 08h-12h',
            departamento: 'DC',
            periodoIdeal: 2,
        },
    });

    const aed1 = await prisma.disciplina.create({
        data: {
            codigo: 'BCC006',
            nome: 'Algoritmos e Estruturas de Dados 1',
            descricao: 'Estudo de estruturas de dados fundamentais (listas, pilhas, filas) e algoritmos de ordenação e busca. Análise de complexidade.',
            professor: 'Prof. Dr. André Luís Pereira',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 14h-16h',
            preRequisitoId: cap.id,
            departamento: 'DC',
            periodoIdeal: 2,
        },
    });

    const poo = await prisma.disciplina.create({
        data: {
            codigo: 'BCC007',
            nome: 'Programação Orientada a Objetos',
            descricao: 'Conceitos de orientação a objetos: classes, objetos, herança, polimorfismo, encapsulamento e interfaces. Prática em Java.',
            professor: 'Profa. Dra. Camila Rodrigues',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 14h-16h',
            preRequisitoId: cap.id,
            departamento: 'DC',
            periodoIdeal: 2,
        },
    });

    const arqOrg1 = await prisma.disciplina.create({
        data: {
            codigo: 'BCC008',
            nome: 'Arquitetura e Organização de Computadores 1',
            descricao: 'Organização e funcionamento de processadores, hierarquia de memória, entrada/saída e barramentos. Assembly básico.',
            professor: 'Prof. Dr. João Henrique Souza',
            creditos: 6,
            vagas: 40,
            horario: 'Terça e Quinta. 16h-19h',
            preRequisitoId: logDigital.id,
            departamento: 'DC',
            periodoIdeal: 2,
        },
    });

    // ============================================================
    // 3º SEMESTRE — Disciplinas
    // ============================================================
    console.log('📚 Criando disciplinas do 3º semestre...');

    const calc2 = await prisma.disciplina.create({
        data: {
            codigo: 'MAT003',
            nome: 'Cálculo Diferencial e Séries',
            descricao: 'Séries numéricas, sequências, séries de potências e séries de Taylor. Técnicas de integração avançadas e aplicações.',
            professor: 'Prof. Dr. Ricardo Almeida',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 08h-10h',
            preRequisitoId: calc1.id,
            departamento: 'DM',
            periodoIdeal: 3,
        },
    });

    const aed2 = await prisma.disciplina.create({
        data: {
            codigo: 'BCC009',
            nome: 'Algoritmos e Estruturas de Dados 2',
            descricao: 'Árvores balanceadas, tabelas hash, grafos, algoritmos de caminho mínimo e árvore geradora mínima.',
            professor: 'Prof. Dr. André Luís Pereira',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 08h-10h',
            preRequisitoId: aed1.id,
            departamento: 'DC',
            periodoIdeal: 3,
        },
    });

    const ori = await prisma.disciplina.create({
        data: {
            codigo: 'BCC010',
            nome: 'Organização e Recuperação da Informação',
            descricao: 'Técnicas de indexação, recuperação de informação, modelos de busca e processamento de texto.',
            professor: 'Profa. Dra. Mariana Tavares',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 14h-16h',
            preRequisitoId: aed1.id,
            departamento: 'DC',
            periodoIdeal: 3,
        },
    });

    const so = await prisma.disciplina.create({
        data: {
            codigo: 'BCC011',
            nome: 'Sistemas Operacionais',
            descricao: 'Processos, threads, escalonamento, gerência de memória, sistemas de arquivos e mecanismos de sincronização.',
            professor: 'Prof. Dr. Fábio Augusto Silva',
            creditos: 6,
            vagas: 40,
            horario: 'Terça e Quinta. 14h-17h',
            preRequisitoId: arqOrg1.id,
            departamento: 'DC',
            periodoIdeal: 3,
        },
    });

    const compSociedade = await prisma.disciplina.create({
        data: {
            codigo: 'BCC012',
            nome: 'Computação e Sociedade',
            descricao: 'Aspectos éticos, sociais e legais da computação. Impacto da tecnologia na sociedade, acessibilidade e inclusão digital.',
            professor: 'Profa. Dra. Helena Castro',
            creditos: 4,
            vagas: 40,
            horario: 'Sexta. 08h-12h',
            departamento: 'DC',
            periodoIdeal: 3,
        },
    });

    const metCientifica = await prisma.disciplina.create({
        data: {
            codigo: 'BCC013',
            nome: 'Metodologia Científica',
            descricao: 'Métodos de pesquisa científica, elaboração de projetos, redação acadêmica e técnicas de apresentação.',
            professor: 'Prof. Dr. Roberto Nascimento',
            creditos: 4,
            vagas: 40,
            horario: 'Sexta. 14h-18h',
            departamento: 'DC',
            periodoIdeal: 3,
        },
    });

    // ============================================================
    // 4º SEMESTRE — Disciplinas
    // ============================================================
    console.log('📚 Criando disciplinas do 4º semestre...');

    const algLinear = await prisma.disciplina.create({
        data: {
            codigo: 'MAT004',
            nome: 'Álgebra Linear 1',
            descricao: 'Espaços vetoriais, transformações lineares, autovalores e autovetores, diagonalização e aplicações.',
            professor: 'Prof. Dr. Marcos Vinícius Costa',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 08h-10h',
            preRequisitoId: geomAnalitica.id,
            departamento: 'DM',
            periodoIdeal: 4,
        },
    });

    const paa = await prisma.disciplina.create({
        data: {
            codigo: 'BCC014',
            nome: 'Projeto e Análise de Algoritmos',
            descricao: 'Técnicas de projeto de algoritmos: divisão e conquista, programação dinâmica, algoritmos gulosos. Análise de complexidade avançada.',
            professor: 'Prof. Dr. André Luís Pereira',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 08h-10h',
            preRequisitoId: aed2.id,
            departamento: 'DC',
            periodoIdeal: 4,
        },
    });

    const ihc = await prisma.disciplina.create({
        data: {
            codigo: 'BCC015',
            nome: 'Interação Humano-Computador',
            descricao: 'Princípios de usabilidade, design de interfaces, avaliação heurística, prototipação e testes com usuários.',
            professor: 'Profa. Dra. Camila Rodrigues',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 10h-12h',
            preRequisitoId: cap.id,
            departamento: 'DC',
            periodoIdeal: 4,
        },
    });

    const engSoft1 = await prisma.disciplina.create({
        data: {
            codigo: 'BCC016',
            nome: 'Engenharia de Software 1',
            descricao: 'Processos de desenvolvimento de software, requisitos, modelagem UML, padrões de projeto e testes de software.',
            professor: 'Prof. Dr. Thiago Mendonça',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 14h-16h',
            preRequisitoId: poo.id,
            departamento: 'DC',
            periodoIdeal: 4,
        },
    });

    const bd = await prisma.disciplina.create({
        data: {
            codigo: 'BCC017',
            nome: 'Banco de Dados',
            descricao: 'Modelo relacional, álgebra relacional, SQL, normalização, projeto de banco de dados e transações.',
            professor: 'Profa. Dra. Mariana Tavares',
            creditos: 4,
            vagas: 40,
            horario: 'Segunda e Quarta. 14h-16h',
            preRequisitoId: aed1.id,
            departamento: 'DC',
            periodoIdeal: 4,
        },
    });

    const ia = await prisma.disciplina.create({
        data: {
            codigo: 'BCC018',
            nome: 'Inteligência Artificial',
            descricao: 'Agentes inteligentes, busca, representação de conhecimento, aprendizado de máquina e redes neurais.',
            professor: 'Prof. Dr. Paulo Roberto Santos',
            creditos: 4,
            vagas: 40,
            horario: 'Terça e Quinta. 16h-18h',
            preRequisitoId: aed1.id,
            departamento: 'DC',
            periodoIdeal: 4,
        },
    });

    // ============================================================
    // Organização das disciplinas por semestre para criar matrículas
    // ============================================================
    const disciplinasPorSemestre: Disciplina[][] = [
        [calc1, matDiscreta, ipa, cap, logDigital],                         // 1º semestre
        [geomAnalitica, estatBasica, logMatematica, aed1, poo, arqOrg1],    // 2º semestre
        [calc2, aed2, ori, so, compSociedade, metCientifica],               // 3º semestre
        [algLinear, paa, ihc, engSoft1, bd, ia],                            // 4º semestre
    ];

    // ============================================================
    // ALUNOS — Um por semestre ideal (1º ao 4º)
    // ============================================================
    console.log('👤 Criando alunos por semestre...');

    const alunos: Aluno[] = [];
    for (let sem = 1; sem <= 4; sem++) {
        const aluno = await prisma.aluno.create({
            data: {
                nome: `Aluno do ${sem}º Semestre`,
                email: `semestre${sem}@estudante.ufscar.br`,
                senha: senhaPadraoHash,
                ra: `2026${String(sem).padStart(6, '0')}`,
                periodo: `${sem}º`,
                semestre: '2026.1',
                curso: 'Bacharelado em Ciência da Computação',
            },
        });
        alunos.push(aluno);
    }

    // ============================================================
    // MATRÍCULAS — Disciplinas concluídas em semestres anteriores
    // ============================================================
    console.log('📝 Criando matrículas concluídas...');

    // Distribuição temporal:
    // Semestre acadêmico 1 → 2025.1 (ano=2025, semestre=1)
    // Semestre acadêmico 2 → 2025.2 (ano=2025, semestre=2)
    // Semestre acadêmico 3 → 2026.1 (ano=2026, semestre=1)  ← porém as matérias do 3º já estão concluídas para alunos do 4º
    // Semestre acadêmico 4 → 2026.1 (atual, inscrito)

    const semestreMap = [
        { ano: 2025, semestre: 1 }, // 1º semestre acadêmico
        { ano: 2025, semestre: 2 }, // 2º semestre acadêmico
        { ano: 2026, semestre: 1 }, // 3º semestre acadêmico (concluído para quem está no 4º)
    ];

    for (let alunoIdx = 0; alunoIdx < alunos.length; alunoIdx++) {
        const aluno = alunos[alunoIdx];
        const semestreAtual = alunoIdx + 1; // 1-indexed

        // Marcar disciplinas de semestres anteriores como "aprovado"
        for (let semPast = 0; semPast < semestreAtual - 1; semPast++) {
            const disciplinas = disciplinasPorSemestre[semPast];
            const { ano, semestre } = semestreMap[semPast];

            for (const disc of disciplinas) {
                await prisma.matricula.create({
                    data: {
                        alunoId: aluno.id,
                        disciplinaID: disc.id,
                        status: 'aprovado',
                        ano,
                        semestre,
                    },
                });
            }
        }

        // Inscrever nas disciplinas do semestre atual
        const disciplinasAtuais = disciplinasPorSemestre[semestreAtual - 1];
        for (const disc of disciplinasAtuais) {
            await prisma.matricula.create({
                data: {
                    alunoId: aluno.id,
                    disciplinaID: disc.id,
                    status: 'inscrito',
                    ano: 2026,
                    semestre: 1,
                },
            });
        }

        console.log(`  ✅ ${aluno.nome}: ${semestreAtual - 1} semestre(s) concluído(s), inscrito em ${disciplinasAtuais.length} matérias`);
    }

    console.log('\n🔐 Criando administrador padrão...');
    await prisma.admin.create({
        data: {
            nome: 'Administrador',
            email: 'admin@ufscar.br',
            senha: senhaPadraoHash,
        },
    });

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('Credenciais de acesso:');
    console.log('  semestre1@estudante.ufscar.br / 123456');
    console.log('  semestre2@estudante.ufscar.br / 123456');
    console.log('  semestre3@estudante.ufscar.br / 123456');
    console.log('  semestre4@estudante.ufscar.br / 123456');
    console.log('  admin@ufscar.br / 123456 (Admin)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });