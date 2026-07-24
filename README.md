# Projeto Trainee CATI 2026 - Matrícula Fácil

Sistema de matrícula acadêmica desenvolvido como projeto de capacitação para trainees da **CATI Jr**. 
O sistema abrange o processo completo de gestão acadêmica: alunos podem se cadastrar, visualizar suas matrículas, catálogo de disciplinas e progresso no curso. Administradores podem gerenciar cursos, matérias, requisitos e horários.

O site pode ser acessado [aqui](https://matriculafacil.onrender.com)
## Arquitetura do Projeto

O repositório está dividido em dois serviços principais:

- **Frontend (`/frontend`)**: Interface web SPA construída com React, TypeScript e Tailwind CSS.
- **Backend (`/backend`)**: API RESTful construída com NestJS, TypeScript, Prisma ORM e PostgreSQL.

## Tecnologias Utilizadas

- **Frontend**: React 18, Vite, Tailwind CSS, TypeScript.
- **Backend**: Node.js, NestJS, Prisma ORM, Zod, Swagger.
- **Infraestrutura**: Docker & Docker Compose (para banco de dados local PostgreSQL).

## Como rodar o projeto localmente

Para rodar todo o ecossistema na sua máquina, siga os passos abaixo.

### 1. Requisitos
- Node.js (v20+)
- npm (v10+)
- Docker e Docker Compose (para subir o banco de dados)

### 2. Subindo o Banco de Dados (Docker)
Na raiz do projeto, execute o comando do Docker para levantar o contêiner do PostgreSQL:
```bash
docker compose up -d
```
*Isso deixará o banco de dados rodando em background na porta 5432.*

### 3. Rodando o Backend
O backend requer que o banco esteja online para rodar as migrações e o seed de dados.
```bash
cd backend
npm install
npm run start:dev
```
*O backend estará rodando em `http://localhost:3000`. A documentação da API via Swagger pode ser acessada em `http://localhost:3000/api`.*
> **Nota:** Se for a primeira vez rodando, o banco será preenchido automaticamente com o seed configurado, garantindo credenciais padrão de teste (`admin@ufscar.br / 123456`). Para mais detalhes veja o `README.md` da pasta `/backend`.

### 4. Rodando o Frontend
Em outro terminal (mantenha o backend rodando):
```bash
cd frontend
npm install
npm run dev
```
*Acesse a aplicação no navegador em `http://localhost:5173`.*

## Credenciais de Teste

Após o *seed* (povoamento automático do banco), você pode acessar o sistema com as seguintes credenciais:
- **Admin**: `admin@ufscar.br` / `123456`
- **Aluno**: `semestre1@estudante.ufscar.br` / `123456`

## Scripts Úteis na Raiz
*(Opcional: você pode configurar no `package.json` raiz para executar ambos com bibliotecas como `concurrently`)*
