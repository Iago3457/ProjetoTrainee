# MatriculaFácil — Backend

API do sistema de matrícula desenvolvida em **NestJS**, utilizando o **Prisma ORM** e banco de dados **PostgreSQL**.

## Pré-requisitos

- Node.js 20+
- npm 10+
- Um banco de dados PostgreSQL rodando localmente na porta 5432 (pode ser o do Docker) ou em nuvem.

## Como rodar localmente

Na raiz do projeto principal (fora da pasta `/backend`), suba o banco de dados via Docker:
```bash
docker compose up -d
```

Em seguida, dentro da pasta `/backend`, instale as dependências:
```bash
npm install
```

Sincronize as tabelas do banco de dados (isso atualizará seu banco local com base no `schema.prisma`):
```bash
npx prisma db push --accept-data-loss
```

Crie os dados de base no banco executando o script de Seed (Matérias, Cursos, Alunos de teste e Admin):
```bash
npx prisma db seed
```

Finalmente, inicie o servidor:
```bash
# Modo desenvolvimento com hot-reload
npm run start:dev
```

O servidor estará rodando em `http://localhost:3000`.

## Documentação da API

A documentação completa das rotas, parâmetros e formatos de retorno está disponível pelo **Swagger**.
Com o servidor rodando, acesse:

**`http://localhost:3000/api`**

## Scripts Prisma Disponíveis

| Comando | Descrição |
|---|---|
| `npx prisma db push` | Sincroniza o banco de dados com o seu `schema.prisma`. Ideal para ambiente de desenvolvimento ágil. |
| `npx prisma db seed` | Preenche o banco de dados com os registros configurados em `prisma/seed.ts`. |
| `npx prisma studio` | Abre uma interface gráfica web na porta 5555 para você visualizar e editar as tabelas do banco de dados visualmente. |
| `npx prisma generate` | Regenera o Prisma Client após alterações manuais na estrutura do Schema. |

## Estrutura do Backend
O projeto é baseado no sistema modular do NestJS:
- **Auth**: Gestão de JWT, rotas de login e cadastro, `ZodValidationPipes`.
- **Cursos**: CRUD de cursos administráveis e rotas públicas.
- **Disciplinas**: Catálogo, exibição com horários e CRUD do admin.
- **Matrículas**: Vínculo entre alunos e disciplinas (controle N:N).
