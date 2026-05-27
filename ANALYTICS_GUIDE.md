# 📊 Lumora Analytics & Business Intelligence

Novo módulo completo para inteligência financeira acionável com KPIs, previsões com IA e relatórios automáticos.

---

## 🎯 Funcionalidades Adicionadas

### 1. **Dashboard Executivo com KPIs**
- **ROI (Return on Investment)**: Percentual de retorno sobre investimento
- **LTV (Lifetime Value)**: Valor total gerado pelo usuário
- **CAC (Customer Acquisition Cost)**: Custo para adquirir cliente
- **Margem de Lucro**: Percentual de lucro sobre receita

### 2. **Relatórios Automáticos por E-mail**
- Resumo financeiro personalizado
- KPIs e previsões
- Top 5 categorias de receita e despesa
- Agendamento semanal automático

### 3. **Previsões de Crescimento com IA**
- Análise de tendências históricas
- Média móvel de 7 dias
- Cálculo de confiança baseado em volatilidade
- Insights acionáveis gerados automaticamente

### 4. **Visualizações com Gráficos**
- Fluxo de caixa (receitas vs despesas)
- Distribuição de receitas por categoria (Doughnut)
- Distribuição de despesas por categoria (Bar)
- Evolução do ROI ao longo do tempo

### 5. **Recomendações Inteligentes**
- Alertas baseados em KPIs
- Sugestões de otimização
- Análise de saúde financeira

---

## 🚀 Como Usar

### Passo 1: Inicializar o Banco de Dados

```bash
cd python
python init_analytics.py
```

Isso criará as tabelas necessárias e inserirá dados de exemplo.

### Passo 2: Configurar Envio de E-mail

Copie `.env.example` para `.env` e preencha suas credenciais SMTP:

```bash
cp .env.example .env
```

Edite `.env` com suas configurações (Gmail, SendGrid, etc).

### Passo 3: Acessar o Dashboard

Abra seu navegador:
```
http://127.0.0.1:5000/analytics
```

### Passo 4: Registrar Transações

As previsões melhoram com histórico. Certifique-se de que seus dados têm:
- Pelo menos 7 dias de histórico
- Transações regulares de receita e despesa
- Categorias bem classificadas

---

## 📡 Endpoints da API

### GET `/api/analytics/dashboard`
Retorna KPIs e dados do dashboard.

**Parâmetros:**
- `usuario_id` (int): ID do usuário
- `periodo` (int): Período em dias (padrão: 30)

**Resposta:**
```json
{
  "sucesso": true,
  "kpis": {
    "roi": 15.5,
    "ltv": 12500.00,
    "cac": 800.00,
    "receita_total": 15800.00,
    "despesa_total": 4200.00,
    "lucro_liquido": 11600.00,
    "margem_percentual": 73.4
  },
  "previsao": {
    "valor_previsto": 12100.00,
    "crescimento_estimado": 8.5,
    "confianca": 78.5,
    "insight": "Tendência positiva! Continue o padrão atual"
  }
}
```

### GET `/api/analytics/relatorio`
Gera relatório completo com KPIs, previsões e análises.

**Parâmetros:**
- `usuario_id` (int): ID do usuário
- `periodo` (int): Período em dias (padrão: 30)

### POST `/api/analytics/enviar-relatorio`
Envia relatório por e-mail.

**Body:**
```json
{
  "usuario_id": 1,
  "email": "usuario@example.com",
  "periodo": 30,
  "agendar": false
}
```

---

## 💡 Métricas Explicadas

### ROI (Return on Investment)
```
ROI = ((Receita - Despesa) / Despesa) × 100
```
Exemplo: Se você investe R$ 1000 em marketing e gera R$ 3000 em vendas:
- ROI = ((3000 - 1000) / 1000) × 100 = 200%

**Ideal:** > 50%

### LTV (Lifetime Value)
Soma de todas as receitas geradas por um cliente ao longo de seu relacionamento.

**Ideal:** LTV ÷ CAC ≥ 3

### CAC (Customer Acquisition Cost)
Soma de gastos em marketing, publicidade e aquisição dividida pelo número de clientes.

**Ideal:** Menor possível, idealmente < 1/3 do LTV

### Margem de Lucro
```
Margem = ((Receita - Despesa) / Receita) × 100
```

**Ideais:**
- Serviços: 50-70%
- Produtos: 30-50%
- Retail: 15-30%

---

## 🤖 Como Funciona a Previsão de IA

A previsão não usa IA tradicional (como GPT), mas análise estatística inteligente:

1. **Coleta histórico** dos últimos 90 dias
2. **Calcula média móvel** de 7 dias
3. **Analisa trend** linear
4. **Calcula confiança** baseado em volatilidade
5. **Gera insight** com recomendação

**Confiança:**
- < 50%: "Dados muito voláteis"
- 50-70%: "Moderado, acompanhe"
- > 70%: "Confiável, aja conforme insight"

---

## 📧 Configurando Relatórios Automáticos

### Com Gmail

1. Ative 2FA na sua conta Google
2. Gere uma App Password: https://myaccount.google.com/apppasswords
3. Adicione ao `.env`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=seu_email@gmail.com
SENDER_PASSWORD=xxxx xxxx xxxx xxxx
```

### Com SendGrid

1. Crie conta em sendgrid.com
2. Gere API key
3. Adicione ao `.env`:

```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SENDER_EMAIL=apikey
SENDER_PASSWORD=SG.seu_api_key
```

---

## 🎨 Customizações Possíveis

### 1. Adicionar mais KPIs
Edite `analytics.py` método `get_dashboard_kpis()` para incluir:
- Ticket médio
- Taxa de retorno
- Churn rate
- Etc.

### 2. Integrar com IA Real (GPT)
```python
import openai

def gerar_insight_com_ia(dados):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Analise estes dados financeiros: {dados}"
        }]
    )
    return response.choices[0].message.content
```

### 3. Adicionar Exportação em PDF
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def gerar_pdf_relatorio(relatorio):
    c = canvas.Canvas("relatorio.pdf", pagesize=letter)
    # ... adicione conteúdo
    c.save()
```

### 4. Webhook com Slack/Discord
```python
import requests

def enviar_slack(mensagem):
    webhook = os.getenv("SLACK_WEBHOOK")
    requests.post(webhook, json={"text": mensagem})
```

---

## 📊 Estrutura do Banco de Dados

```sql
-- Transações
CREATE TABLE Transacoes (
    IDTransacao INTEGER PRIMARY KEY,
    usuario_id INTEGER,
    tipo TEXT ('receita', 'despesa'),
    valor REAL,
    categoria TEXT,
    descricao TEXT,
    data TEXT
);

-- Relatórios Agendados
CREATE TABLE RelatoriosAgendados (
    IDRelatorio INTEGER PRIMARY KEY,
    usuario_id INTEGER,
    email TEXT,
    periodo_dias INTEGER,
    frequencia TEXT ('semanal', 'mensal'),
    ativo BOOLEAN
);

-- Histórico de Previsões
CREATE TABLE PrevisoesCrescimento (
    IDPrevisao INTEGER PRIMARY KEY,
    usuario_id INTEGER,
    crescimento_estimado REAL,
    confianca REAL,
    valor_real REAL,
    acurado BOOLEAN
);
```

---

## 🐛 Troubleshooting

### "Erro ao enviar e-mail"
- Verifique credenciais SMTP em `.env`
- Teste com Gmail App Password (não senha comum)
- Verifique se a porta está correta (587 para TLS)

### "Dados insuficientes para previsão"
- Mantenha pelo menos 7 dias de histórico
- Registre transações regularmente
- A previsão melhora com mais dados (90+ dias ideal)

### "KPIs mostram 0 ou valores errados"
- Verifique se há transações registradas
- Confirme que `usuario_id` está correto
- Execute `python init_analytics.py` novamente para dados de exemplo

---

## 💰 Monetização

Este módulo agrega **valor premium** que atrai compradores:

- **SaaS traditional**: R$ 49/mês (Premium) com analytics
- **Enterprise**: R$ 149/mês (Business) com API + analytics avançado
- **Consultoria**: Vender insights personalizados
- **Data**: Agregação anônima para vender relatórios de mercado

**Valor estimado para comprador**: +20-30% na avaliação da empresa

---

## 📚 Próximas Evoluções

- [ ] Integração com Open Finance (dados bancários reais)
- [ ] Dashboard em tempo real com WebSockets
- [ ] Análise preditiva com Machine Learning
- [ ] Comparação com benchmarks do mercado
- [ ] Exportação em múltiplos formatos (PDF, Excel, CSV)
- [ ] Mobile app com PWA
- [ ] Alertas em Slack/Discord/WhatsApp

---

**Desenvolvido por:** Lumora Team
**Versão:** 1.0.0
**Licença:** MIT
