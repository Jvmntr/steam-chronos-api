# 📊 Steam Project API

## 🧩 Visão Geral  
API de back-end desenvolvida em **Nest.js** para rastrear e analisar automaticamente o tempo de jogo de um usuário na **Steam**. O serviço coleta dados periodicamente, armazena-os em um banco de dados e os expõe através de endpoints **RESTful** para serem consumidos por um futuro dashboard de visualização.

---

## ✨ Funcionalidades

### 📥 Coleta e Armazenamento de Dados
- **Integração com a Steam**: Utiliza a API Web oficial da Steam para buscar a lista completa de jogos e o tempo jogado de um usuário específico.
- **Persistência de Dados**: Armazena todas as informações em um banco de dados **PostgreSQL**, permitindo análises históricas complexas.
- **Snapshots de Tempo**: Cria "snapshots" periódicos do tempo total jogado, permitindo o cálculo de tempo jogado em intervalos específicos (semanal, mensal, etc.).
- **Automação Agendada**: Usa **Cron Jobs** para executar a coleta automaticamente (ex: todos os dias às 3 da manhã), garantindo dados sempre atualizados.

### 🔗 Endpoints da API
- `GET /api/dashboard/summary`: Resumo geral — número total de jogos, jogo mais jogado na última semana.
- `GET /api/dashboard/weekly-report`: Relatório semanal — tempo jogado por jogo nos últimos 7 dias.

### 🧱 Estrutura Escalável
- Arquitetura baseada em **Módulos** e **Serviços**, pronta para novos endpoints (mensal, histórico detalhado etc.).

### 🧼 Qualidade e Estrutura de Código
- **Nest.js** com boas práticas: Injeção de Dependência, Controllers, Services e Repositories.
- **Código limpo e organizado**: Separação clara entre camadas.
- **Padrão de código garantido** com **ESLint** e **Prettier**.

---

## 🚀 A Ser Implementado (Roadmap Futuro)

- [ ] `GET /api/games/:appId/history`  
  **Histórico por Jogo**: Série temporal de snapshots de um jogo específico.

- [ ] `GET /api/dashboard/report`  
  **Relatórios Generalizados**: Aceitar períodos como `monthly` ou `yearly`.

- [ ] `GET /api/dashboard/activity-by-day`  
  **Análise de Padrões**: Quais dias da semana o usuário mais joga.

- [ ] `POST /api/sync/run`  
  **Sincronização Manual**: Disparar sincronização sob demanda.

- [ ] `GET /api/sync/status`  
  **Status da Sincronização**: Informar última coleta e sucesso da operação.

---

## 💼 Tecnologias Utilizadas

### 🔧 Back-end
- **Node.js** – Ambiente de execução
- **Nest.js** – Framework principal
- **TypeScript** – Tipagem estática e segura

### 🗄️ Banco de Dados
- **PostgreSQL** – Banco relacional robusto
- **Prisma** – ORM moderno com tipagem

### ⚙️ Automação e APIs
- **Nest.js Schedule** – Cron Jobs agendados
- **Axios** – Requisições à API da Steam

### 🧹 Qualidade de Código
- **ESLint**
- **Prettier**

---

## ✒️ Feito por

<img align="left" height="94px" width="94px" alt="Foto de perfil" src="./profile_git.jpg">

**João 'Jvmntr' Monteiro**  