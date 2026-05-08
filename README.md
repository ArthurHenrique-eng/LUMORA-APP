# LUMORA-APP
Uma plataforma web moderna desenvolvida para oferecer praticidade em seus investimentos, com um bom desempenho e uma experiência intuitiva aos usuários.

# Lumora — Inteligência Financeira com IA

> Plataforma SaaS completa para pequenos negócios: gestão financeira moderna, automações com IA e educação em investimentos.

![Status] (https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Stack] (https://img.shields.io/badge/stack-Node.js%20%7C%20HTML%20%7C%20CSS%20%7C%20JS-blue)
![Licença] (https://img.shields.io/badge/licença-MIT-green)

---

## Visão do Produto

A **Lumora** é uma plataforma SaaS com três módulos integrados:

| Módulo | Descrição |
|---|---|
| **IA para Negócios** | Geração de posts, contratos, chatbot WhatsApp, automação Instagram |
| **Gestão Financeira** | Dashboard moderno, controle de receitas/gastos, metas, relatórios |
| **Educação Financeira** | Cursos, simulados, IA tutora, gamificação com XP |

---

## Diagrama de Fluxo do Sistema

```mermaid
flowchart TD
    U([Usuário]) --> LP[Landing Page\nindex.html]
    LP --> AUTH{Autenticação}

    AUTH -->|Novo usuário| CAD[Cadastro]
    AUTH -->|Usuário existente| LOGIN[Login JWT]
    LOGIN --> DASH[Dashboard Principal]

    DASH --> M1[ Módulo IA]
    DASH --> M2[ Módulo Financeiro]
    DASH --> M3[ Módulo Educação]

    M1 --> IA1[Gerador de Posts]
    M1 --> IA2[Gerador de Contratos]
    M1 --> IA3[Chatbot WhatsApp]
    M1 --> IA4[Automação Instagram]

    M2 --> FIN1[Transações]
    M2 --> FIN2[Metas Financeiras]
    M2 --> FIN3[Relatórios PDF]
    M2 --> FIN4[Gráficos / Dashboard]

    M3 --> EDU1[Cursos]
    M3 --> EDU2[Simulados]
    M3 --> EDU3[IA Tutora]
    M3 --> EDU4[Gamificação XP]

    DASH --> PLANO{Plano do Usuário}
    PLANO -->|Gratuito| FREE[Acesso Básico]
    PLANO -->|Premium R$49| PREM[Acesso Completo]
    PLANO -->|Business R$149| BIZ[Multi-usuário + API]
```

---

## Arquitetura do Sistema

```mermaid
graph TD
    subgraph Frontend
        HTML[HTML5 / CSS3 / JS Vanilla]
        LP2[Landing Page]
        DASH2[Dashboard]
        UI[Componentes UI]
    end

    subgraph API_Gateway
        GW[API Gateway\nRate Limit · Auth · Validação]
    end

    subgraph Backend
        EXPRESS[Express / NestJS]
        CTRL[Controllers]
        SVC[Services]
        MW[Middlewares\nJWT · Joi · bcrypt]
    end

    subgraph Banco_de_Dados
        SQLITE[(SQLite\nDesenvolvimento)]
        PG[(PostgreSQL\nProdução v2)]
    end

    subgraph Servicos_Externos
        OPENAI[OpenAI API\nGPT-4o]
        STRIPE[Stripe\nPagamentos]
        TWILIO[Twilio / Z-API\nWhatsApp]
        CF[Cloudflare\nCDN · DNS · Workers]
    end

    HTML --> GW
    GW --> EXPRESS
    EXPRESS --> CTRL
    CTRL --> SVC
    SVC --> SQLITE
    SQLITE -.->|Migração| PG
    SVC --> OPENAI
    SVC --> STRIPE
    SVC --> TWILIO
    CF --> HTML
```

---

## Diagrama de Classes

```mermaid
classDiagram

    class Usuario {
        +String id
        +String nome
        +String email
        +String senhaHash
        +String plano
        +Integer xp
        +Date criadoEm
        +cadastrar(nome, email, senha) void
        +login(email, senha) String JWT
        +atualizarPlano(plano) void
        +ganharXP(quantidade) void
    }

    class Autenticacao {
        +String jwtToken
        +String refreshToken
        +Date expiresAt
        +gerarToken(usuario) String
        +validarToken(token) Boolean
        +renovarToken(refreshToken) String
        +revogarToken(token) void
    }

    class ModuloFinanceiro {
        +listarTransacoes(usuarioId) List
        +adicionarTransacao(dados) Transacao
        +gerarRelatorio(periodo) PDF
        +calcularSaldo() Float
        +exibirDashboard() void
    }

    class Transacao {
        +String id
        +String usuarioId
        +String tipo
        +Float valor
        +String categoria
        +String descricao
        +Date data
        +criar(dados) void
        +editar(id, dados) void
        +excluir(id) void
        +listarPorCategoria() List
    }

    class Meta {
        +String id
        +String usuarioId
        +String titulo
        +Float valorAlvo
        +Float valorAtual
        +Date prazo
        +criar(dados) void
        +atualizarProgresso(valor) void
        +verificarConclusao() Boolean
    }

    class ModuloIA {
        +String modeloOpenAI
        +gerarPost(tema, plataforma) String
        +gerarContrato(tipo, dados) String
        +analisarFinancas(dados) String
        +responderChatbot(mensagem) String
    }

    class ChatbotWhatsApp {
        +String telefone
        +String provider
        +conectar() void
        +enviarMensagem(numero, texto) void
        +receberMensagem() String
        +processarComIA(msg) String
    }

    class AutomacaoInstagram {
        +String conta
        +agendarPost(conteudo, horario) void
        +gerarLegenda(tema) String
        +publicar(post) void
        +monitorarEngajamento() Map
    }

    class ModuloEducacao {
        +listarCursos() List
        +iniciarCurso(cursoId) void
        +realizarSimulado(simuladoId) Resultado
        +consultarIATutora(duvida) String
        +exibirProgresso(usuarioId) Map
    }

    class Curso {
        +String id
        +String titulo
        +String descricao
        +Integer duracaoMinutos
        +List modulos
        +String nivel
        +iniciar(usuarioId) void
        +concluirModulo(moduloId) void
        +emitirCertificado() void
    }

    class Gamificacao {
        +String usuarioId
        +Integer xpTotal
        +List conquistas
        +Integer nivel
        +adicionarXP(quantidade, motivo) void
        +verificarConquistas() List
        +exibirRanking() List
    }

    class Assinatura {
        +String id
        +String usuarioId
        +String plano
        +Float valor
        +Date inicio
        +Date renovacao
        +Boolean ativa
        +assinar(plano) void
        +cancelar() void
        +renovar() void
        +verificarAcesso(recurso) Boolean
    }

    class Relatorio {
        +String usuarioId
        +String periodo
        +Map dados
        +gerar(filtros) void
        +exportarPDF() Blob
        +enviarPorEmail() void
    }

    Usuario "1" --> "1" Autenticacao : autentica via
    Usuario "1" --> "*" Transacao : registra
    Usuario "1" --> "*" Meta : define
    Usuario "1" --> "1" ModuloFinanceiro : usa
    Usuario "1" --> "1" ModuloIA : usa
    Usuario "1" --> "1" ModuloEducacao : acessa
    Usuario "1" --> "1" Gamificacao : possui
    Usuario "1" --> "1" Assinatura : contrata

    ModuloFinanceiro "1" --> "*" Transacao : gerencia
    ModuloFinanceiro "1" --> "*" Meta : acompanha
    ModuloFinanceiro "1" --> "*" Relatorio : gera

    ModuloIA "1" --> "1" ChatbotWhatsApp : integra
    ModuloIA "1" --> "1" AutomacaoInstagram : controla

    ModuloEducacao "1" --> "*" Curso : oferece
    ModuloEducacao "1" --> "1" Gamificacao : alimenta

    Assinatura --> ModuloIA : libera acesso
    Assinatura --> ModuloFinanceiro : libera acesso
    Assinatura --> ModuloEducacao : libera acesso
```

---

## Funcionalidades por Módulo

### Autenticação
| Funcionalidade | Detalhes |
|---|---|
| Cadastro | Nome, e-mail, senha com hash bcrypt (salt 12) |
| Login | JWT + Refresh Token armazenado em httpOnly cookie |
| Proteção de rotas | Middleware de autenticação em todos os endpoints privados |
| Rate limiting | Limite de requisições por IP e por usuário |
| Recuperação de senha | Envio de token por e-mail |

---

### Módulo Financeiro
| Funcionalidade | Detalhes |
|---|---|
| Dashboard | Visão geral de saldo, receitas e despesas com gráficos |
| Cadastro de transações | Tipo (receita/despesa), valor, categoria, descrição e data |
| Metas financeiras | Definição de valor-alvo, prazo e acompanhamento de progresso |
| Relatórios | Geração e exportação em PDF por período |
| Categorização | Organização automática de gastos por categoria |

---

### Módulo de IA para Negócios
| Funcionalidade | Detalhes |
|---|---|
| Gerador de Posts | Cria conteúdo para redes sociais com base no tema e plataforma |
| Gerador de Contratos | Gera contratos personalizados por tipo (prestação de serviço, etc.) |
| Chatbot WhatsApp | Atendimento automatizado via Twilio / Z-API |
| Automação Instagram | Agendamento e publicação de posts com legenda gerada por IA |
| Análise Financeira | IA interpreta dados financeiros e gera insights |

---

### Módulo de Educação Financeira
| Funcionalidade | Detalhes |
|---|---|
| Cursos | Conteúdo estruturado por módulos e níveis |
| Simulados | Questões com base em dados financeiros reais |
| IA Tutora | Responde dúvidas financeiras em linguagem natural |
| Gamificação | Sistema de XP, níveis e conquistas por progresso |
| Certificados | Emissão ao concluir cursos |

---

### Planos e Monetização
| Plano | Preço | Recursos |
|---|---|---|
| **Gratuito** | R$ 0/mês | Dashboard básico, 10 transações/mês |
| **Premium** | R$ 49/mês | Todos os módulos, relatórios, IA ilimitada |
| **Business** | R$ 149/mês | Multi-usuário, API pública, Open Finance |

**Meta MRR Ano 1:** R$ 15.000/mês (300 assinantes premium)

---

## Roadmap

```mermaid
gantt
    title Lumora — Roadmap de Desenvolvimento
    dateFormat  YYYY-MM-DD
    section Fase 1 — MVP
    Landing Page               :done,    f1a, 2025-01-01, 30d
    Autenticação JWT           :active,  f1b, 2025-01-15, 45d
    Dashboard Financeiro       :         f1c, 2025-02-01, 30d
    Cadastro de Transações     :         f1d, 2025-02-15, 20d
    Deploy Cloudflare          :         f1e, 2025-03-01, 10d

    section Fase 2 — Core
    Módulo IA (posts/contratos):         f2a, 2025-03-15, 40d
    Metas Financeiras          :         f2b, 2025-04-01, 20d
    Relatórios PDF             :         f2c, 2025-04-15, 20d
    Stripe — Plano Premium     :         f2d, 2025-05-01, 30d
    Cursos Estáticos           :         f2e, 2025-05-15, 20d

    section Fase 3 — Escala
    Chatbot WhatsApp           :         f3a, 2025-06-01, 30d
    Automação Instagram        :         f3b, 2025-06-15, 30d
    Gamificação XP             :         f3c, 2025-07-01, 20d
    IA Tutora Personalizada    :         f3d, 2025-07-15, 30d

    section Fase 4 — Avançado
    Open Finance               :         f4a, 2025-09-01, 40d
    Pix API                    :         f4b, 2025-09-15, 20d
    Plano Business             :         f4c, 2025-10-01, 30d
    App Mobile PWA             :         f4d, 2025-11-01, 45d
```

---

## Estrutura de Pastas

```
lumora/
├── frontend/
│   ├── index.html              # Landing page
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── assets/
│       ├── icons/
│       └── images/
│
├── backend/
│   ├── src/
│   │   ├── routes/             # Rotas da API
│   │   ├── controllers/        # Lógica dos endpoints
│   │   ├── middleware/         # Auth, validação, rate limit
│   │   ├── models/             # Modelos do banco de dados
│   │   └── services/           # Regras de negócio, IA
│   └── config/
│       ├── database.js
│       └── env.example
│
├── database/
│   └── migrations/             # Scripts SQL
│
├── docs/
│   ├── api.md                  # Documentação da API
│   ├── database.md             # Schema do banco
│   └── roadmap.md              # Roadmap do produto
│
├── api/
│   └── openapi.yaml            # Spec OpenAPI 3.0
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
└── README.md
```

---

## Segurança

| Camada | Implementação |
|---|---|
| Senhas | bcrypt com salt rounds: 12 |
| Tokens | JWT + httpOnly cookies |
| Endpoints | Rate limiting por IP e por usuário |
| Dados | Criptografia em repouso |
| Conformidade | LGPD compliant desde o início |

---

## Stack Tecnológico

| Camada | Tecnologia |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (vanilla) |
| **Autenticação** | JWT + Refresh Token |
| **Banco v1** | SQLite |
| **Banco v2** | PostgreSQL (escala) |
| **IA** | OpenAI API (GPT-4o) |
| **Pagamentos** | Stripe |
| **WhatsApp** | Twilio / Z-API |
| **Infra** | Cloudflare (DNS, CDN, Workers) |
| **CI/CD** | GitHub Actions |

---
## Licença

Este projeto está sob a licença MIT.  
Sinta-se livre para usar, modificar e distribuir este projeto.

MIT License © 2026 Arthur
---
