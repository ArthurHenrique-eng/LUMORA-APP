# Arquitetura: Analytics & Business Intelligence

## Fluxo Geral

```
┌─────────────────────────────────────────────────────────────┐
│                      USUÁRIO FINAL                          │
│              (Plataforma Lumora - Dashboard)                │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  FRONTEND (HTML/CSS)  │
        │  /templates/          │
        │  analytics.html       │
        │  analytics.css        │
        │  analytics.js         │
        │                       │
        │  ├─ Dashboard         │
        │  ├─ KPIs              │
        │  ├─ Gráficos          │
        │  └─ Modal E-mail      │
        └───────────┬───────────┘
                    │
            HTTP (Fetch API)
                    │
                    ▼
        ┌───────────────────────────────────┐
        │      FLASK BACKEND (Python)       │
        │      /python/app.py               │
        │                                   │
        │  ├─ GET /analytics                │
        │  ├─ GET /api/analytics/dashboard  │
        │  ├─ GET /api/analytics/relatorio  │
        │  └─ POST /api/analytics/enviar... │
        └───────────┬───────────────────────┘
                    │
                    ▼
        ┌───────────────────────────────────┐
        │   ANALYTICS SERVICE (Python)      │
        │   /python/analytics.py            │
        │                                   │
        │  ├─ AnalyticsService              │
        │  │  ├─ calcular_roi()             │
        │  │  ├─ calcular_ltv()             │
        │  │  ├─ calcular_cac()             │
        │  │  ├─ get_dashboard_kpis()       │
        │  │  ├─ gerar_previsao_crescimento│
        │  │  ├─ gerar_relatorio()          │
        │  │  └─ enviar_relatorio_email()   │
        │  └─ Utilitários                   │
        │     ├─ _calcular_media_movel()    │
        │     ├─ _calcular_variancia()      │
        │     ├─ _gerar_insight()           │
        │     └─ _gerar_html_relatorio()    │
        └───────────┬───────────────────────┘
                    │
                    ├──────────────────────┐
                    ▼                      ▼
        ┌──────────────────────┐ ┌──────────────────┐
        │  BANCO DE DADOS      │ │  SMTP SERVER     │
        │  /sql/LUMORA_APP.db  │ │  (Gmail, etc)    │
        │                      │ │                  │
        │  ├─ Transacoes       │ │  ├─ SMTP_SERVER  │
        │  ├─ Relatorios       │ │  ├─ SMTP_PORT    │
        │  │  Agendados        │ │  ├─ SENDER_EMAIL │
        │  └─ Previsoes        │ │  └─ PASSWORD     │
        │    Crescimento       │ │                  │
        └──────────────────────┘ └──────────────────┘
```

---

## Estrutura de Arquivos

```
LUMORA-APP/
│
├── 📁 python/
│   ├── app.py                    # Flask app principal (MODIFICADO)
│   ├── analytics.py              # ✨ NOVO - Serviço de Analytics
│   ├── init_analytics.py         # ✨ NOVO - Inicializar DB
│   └── db.py
│
├── 📁 templates/
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── home.html                 # MODIFICADO - Link para analytics
│   └── analytics.html            # ✨ NOVO - Dashboard
│
├── 📁 css/
│   ├── styles.css
│   ├── home.css
│   └── analytics.css             # ✨ NOVO - Estilos
│
├── 📁 js/
│   ├── script.js
│   ├── login.js
│   ├── home.js
│   ├── cadastro.js
│   └── analytics.js              # ✨ NOVO - Interações
│
├── 📁 sql/
│   ├── LUMORA_APP.db
│   └── analytics_schema.sql      # ✨ NOVO - Schema SQL
│
├── 📄 .env.example               # ✨ NOVO - Config de variáveis
├── 📄 requirements.txt           # ✨ NOVO - Dependências Python
├── 📄 README.md
├── 📄 ANALYTICS_GUIDE.md         # ✨ NOVO - Guia completo
└── 📄 IMPLEMENTATION_SUMMARY.md  # ✨ NOVO - Este arquivo
```

---

## Fluxo de Dados: Dashboard

```
┌──────────────────┐
│  Usuário abre    │
│  /analytics      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│ HTML carrega                      │
│ - analytics.html                 │
│ - analytics.css                  │
│ - Chart.js library               │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ JavaScript executa:               │
│ inicializarDashboard()            │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Fetch GET /api/analytics/        │
│  dashboard?usuario_id=1&periodo=30
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Flask recebe requisição           │
│ app_analytics_dashboard()         │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ AnalyticsService.                │
│ get_dashboard_kpis(usuario_id)   │
│                                  │
│ Consulta BD:                     │
│ SELECT * FROM Transacoes         │
│  WHERE usuario_id = ?            │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Calcula KPIs:                    │
│ - ROI = (receita-despesa)/despesa│
│ - LTV = SUM(receita)             │
│ - CAC = SUM(despesa marketing)   │
│ - Margem = (R-D)/R * 100         │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Gera Previsão:                   │
│ - Média móvel 7 dias             │
│ - Trend linear                   │
│ - Cálculo confiança              │
│ - Insight automático             │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Retorna JSON:                    │
│ {                                │
│   kpis: {...},                   │
│   previsao: {...},               │
│   top_receitas: [...],           │
│   top_despesas: [...]            │
│ }                                │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ JavaScript atualiza:              │
│ - atualizarKPIs()                │
│ - atualizarGraficos()            │
│ - atualizarPrevisoes()           │
│ - gerarRecomendacoes()           │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ DOM renderizado com dados reais   │
│ + Gráficos Chart.js              │
│ + Recomendações inteligentes     │
└──────────────────────────────────┘
```

---

## Fluxo de Dados: Envio de Relatório

```
┌─────────────────────────┐
│ Usuário clica            │
│ "Enviar Relatório"      │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Modal aparece com form:           │
│ - Email                          │
│ - Período (7/30/90 dias)         │
│ - Checkbox agendar?              │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Usuário preenche e clica ENVIAR   │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ POST /api/analytics/             │
│      enviar-relatorio             │
│ Body: {                          │
│   usuario_id, email,             │
│   periodo, agendar               │
│ }                                │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Flask recebe:                    │
│ api_analytics_enviar_relatorio() │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ AnalyticsService.                │
│ gerar_relatorio(usuario_id, 30)  │
│                                  │
│ Obtém:                           │
│ - KPIs completos                 │
│ - Previsões                      │
│ - Top receitas/despesas          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Gera HTML do relatório:          │
│ _gerar_html_relatorio()          │
│                                  │
│ Template com:                    │
│ - Header gradient                │
│ - Cards com KPIs                 │
│ - Insight de previsão            │
│ - Resumo financeiro              │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Envia por SMTP:                  │
│ enviar_relatorio_email()         │
│                                  │
│ - Conecta ao servidor SMTP       │
│ - Autentica                      │
│ - Envia MIMEMultipart HTML       │
│ - Fecha conexão                  │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Usuário recebe e-mail com:       │
│ ✓ Relatório formatado            │
│ ✓ KPIs principais                │
│ ✓ Previsões                      │
│ ✓ Resumo do período              │
└──────────────────────────────────┘
```

---

## Tabelas do Banco de Dados

```sql
-- Transações (principal)
┌─────────────────────────────────────┐
│ Transacoes                          │
├─────────────────────────────────────┤
│ IDTransacao (PK)                   │
│ usuario_id (FK)                    │
│ tipo (receita/despesa)             │
│ valor (REAL)                       │
│ categoria (TEXT)                   │
│ descricao (TEXT)                   │
│ data (TEXT - ISO8601)              │
└─────────────────────────────────────┘

-- Relatórios Agendados
┌─────────────────────────────────────┐
│ RelatoriosAgendados                 │
├─────────────────────────────────────┤
│ IDRelatorio (PK)                   │
│ usuario_id (FK)                    │
│ email (TEXT)                       │
│ periodo_dias (INT)                 │
│ frequencia (semanal/mensal)        │
│ proximo_envio (TEXT - ISO8601)     │
│ ativo (BOOLEAN)                    │
└─────────────────────────────────────┘

-- Previsões Crescimento
┌─────────────────────────────────────┐
│ PrevisoesCrescimento                │
├─────────────────────────────────────┤
│ IDPrevisao (PK)                    │
│ usuario_id (FK)                    │
│ data_previsao (TEXT - ISO8601)     │
│ crescimento_estimado (REAL)        │
│ confianca (REAL - 0-100)           │
│ valor_real (REAL)                  │
│ acurado (BOOLEAN)                  │
└─────────────────────────────────────┘
```

---

## Endpoints da API

```
┌─────────────────────────────────────────┐
│  GET /api/analytics/dashboard           │
├─────────────────────────────────────────┤
│ Parâmetros:                            │
│ - usuario_id (int)                    │
│ - periodo (int, dias)                 │
│                                        │
│ Resposta: {                            │
│   kpis: { roi, ltv, cac, ... },      │
│   previsao: { crescimento, ... },    │
│   top_receitas: [],                   │
│   top_despesas: []                    │
│ }                                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  GET /api/analytics/relatorio           │
├─────────────────────────────────────────┤
│ Parâmetros:                            │
│ - usuario_id (int)                    │
│ - periodo (int, dias)                 │
│                                        │
│ Resposta: {                            │
│   relatorio: {                         │
│     data_geracao,                     │
│     kpis, previsao,                   │
│     top_despesas, top_receitas        │
│   }                                    │
│ }                                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  POST /api/analytics/enviar-relatorio   │
├─────────────────────────────────────────┤
│ Body: {                                │
│   usuario_id: int,                    │
│   email: string,                      │
│   periodo: int,                       │
│   agendar: boolean                    │
│ }                                      │
│                                        │
│ Resposta: {                            │
│   sucesso: boolean,                   │
│   mensagem: string                    │
│ }                                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  GET /analytics                         │
├─────────────────────────────────────────┤
│ Renderiza analytics.html               │
│ Requisição inicial do dashboard        │
└─────────────────────────────────────────┘
```

---

## Stack Tecnológico

```
┌────────────────────────────────────────────┐
│             CLIENTE (Browser)              │
├────────────────────────────────────────────┤
│ • HTML5 / CSS3 / JavaScript (Vanilla)     │
│ • Chart.js (gráficos)                     │
│ • Fetch API (requisições)                 │
│ • LocalStorage (cache simples)            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│            SERVIDOR (Backend)              │
├────────────────────────────────────────────┤
│ • Python 3.8+                             │
│ • Flask (HTTP framework)                  │
│ • SQLite 3 (banco local/dev)              │
│ • smtplib (envio de e-mail)              │
│ • statistics (análise estatística)        │
│ • datetime (manipulação de datas)         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│         INFRAESTRUTURA (Opcional)          │
├────────────────────────────────────────────┤
│ • PostgreSQL (produção)                   │
│ • APScheduler (agendamento)               │
│ • ReportLab (PDF)                         │
│ • OpenAI API (IA avançada)                │
│ • SendGrid / Gmail (SMTP)                 │
└────────────────────────────────────────────┘
```

---

## Métricas Calculadas

```
ROI (Return on Investment)
├─ Fórmula: ((Receita - Despesa) / Despesa) × 100
├─ Período: Configurável (7/30/90/180 dias)
├─ Uso: Medir eficiência de investimento
└─ Ideal: > 50%

LTV (Lifetime Value)
├─ Cálculo: SUM(Receitas por usuário)
├─ Período: Total histórico
├─ Uso: Valor que cliente gera
└─ Ideal: LTV ÷ CAC ≥ 3

CAC (Customer Acquisition Cost)
├─ Cálculo: SUM(Despesas com marketing/aquisição)
├─ Período: Total histórico
├─ Uso: Custo para trazer novo cliente
└─ Ideal: Mínimo possível, < LTV/3

Margem de Lucro
├─ Fórmula: ((Receita - Despesa) / Receita) × 100
├─ Período: Configurável
├─ Uso: % de lucro sobre vendas
└─ Ideais: Serviços 50-70%, Produtos 30-50%

Previsão de Crescimento
├─ Método: Análise estatística + média móvel
├─ Período: 90 dias histórico → 30 dias futura
├─ Saída: % crescimento + confiança + insight
└─ Ideal: > 0% com confiança > 70%
```

---

## Fluxo de Segurança

```
┌──────────────────────────────┐
│  Entrada do Usuário          │
│  (Email, Período, etc)       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Validação:                  │
│  ✓ Email válido              │
│  ✓ Período válido (int)      │
│  ✓ Usuario_id existe         │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Prepared Statements:        │
│  ✓ Queries com ? (SQL inject)│
│  ✓ Parâmetros vinculados     │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Processamento Seguro:       │
│  ✓ Sem exposição de senha    │
│  ✓ HTML escapado em e-mail   │
│  ✓ Sem dados sensíveis logs  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Envio SMTP Seguro:          │
│  ✓ Conexão TLS/SSL           │
│  ✓ Senha em variáveis env    │
│  ✓ Timeout de conexão        │
└──────────────────────────────┘
```

---

## Performance

```
Dashboard Load Time
├─ HTML: ~100ms
├─ CSS: ~50ms
├─ JS + Chart.js: ~200ms
├─ API call: ~300-500ms
└─ Total: ~650-850ms (bom)

Database Queries
├─ KPIs: 1 query (indexed)
├─ Previsão: 1 query (indexed)
├─ Top categorias: 2 queries
└─ Total: ~50-100ms (muito bom)

E-mail
├─ Geração HTML: ~100ms
├─ SMTP connection: ~500ms
├─ Envio: ~1-2s
└─ Total: ~2-3s (aceitável)
```

---

## Exemplo de Saída JSON

```json
{
  "sucesso": true,
  "kpis": {
    "roi": 15.5,
    "ltv": 12500.50,
    "cac": 800.00,
    "receita_total": 15800.00,
    "despesa_total": 4200.00,
    "lucro_liquido": 11600.00,
    "margem_percentual": 73.42,
    "periodo_dias": 30
  },
  "previsao": {
    "valor_previsto": 12100.00,
    "crescimento_estimado": 8.5,
    "confianca": 78.5,
    "dias_futuros": 30,
    "insight": "Tendência positiva! Continue o padrão atual"
  },
  "top_receitas": [
    { "categoria": "serviços", "valor": 8200.00 },
    { "categoria": "vendas", "valor": 5100.00 },
    { "categoria": "consultoria", "valor": 2500.00 }
  ],
  "top_despesas": [
    { "categoria": "operacional", "valor": 2000.00 },
    { "categoria": "marketing", "valor": 1300.00 },
    { "categoria": "pessoal", "valor": 900.00 }
  ]
}
```

---

**Fim da Documentação de Arquitetura**
