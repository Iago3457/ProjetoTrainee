# MatriculaFácil — Frontend

Interface web do sistema de matrícula desenvolvida como projeto de treinamento da **CATI Jr.** (Trainee 2026).

## Sobre o projeto

Aplicação React que simula o fluxo de matrícula de um estudante: login, cadastro e visualização do painel com dados acadêmicos, além de um robusto painel administrativo.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Estilização | Tailwind CSS 3 |
| Ícones | Lucide React / Hericons |

## Como rodar localmente

Certifique-se de que o **Backend** está rodando primeiro na porta `3000`.

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O servidor sobe em `http://localhost:5173`.

## Estrutura do projeto

```
src/
├── assets/         # Ícones SVG e imagens
├── components/     # Componentes reutilizáveis (botões, modais, cards)
├── pages/          # Páginas da aplicação
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   └── AdminDashboardPage.tsx
├── services/       # Integração com a API do Backend (fetch)
├── types.ts        # Tipos e interfaces TypeScript
├── App.tsx         # Componente raiz e roteador
└── main.tsx        # Entry point do React
```

## Páginas Principais

- **Login / Cadastro** — Acesso do estudante à plataforma
- **Painel do Aluno** — Perfil acadêmico, catálogo de disciplinas e seleção de matérias.
- **Painel Administrativo** — Gestão de cursos, criação e alocação de disciplinas, acompanhamento e configuração do semestre.
