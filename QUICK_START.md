# 🚀 Quick Start: Analytics Dashboard

## Em 5 Minutos

### 1️⃣ Preparar
```bash
# Instalar dependências
pip install -r requirements.txt

# Inicializar banco
cd python
python init_analytics.py
```

### 2️⃣ Configurar (Opcional)
```bash
# Editar arquivo de configuração
cp .env.example .env

# Adicionar credenciais SMTP (Gmail, SendGrid, etc)
nano .env
```

### 3️⃣ Rodar
```bash
cd python
python app.py
```

### 4️⃣ Acessar
```
http://127.0.0.1:5000/analytics
```

---

## 📊 O Que Você Verá

### Dashboard Principal
```
┌─────────────────────────────────────────────────────────┐
│  📊 Analytics & Business Intelligence                   │
│  Inteligência acionável para seu negócio                │
├─────────────────────────────────────────────────────────┤
│  [ Últimos 30 dias ▼ ]  [ 🔄 Atualizar ]  [ 📧 E-mail]  │
├─────────────────────────────────────────────────────────┤
│                     KPIs PRINCIPAIS                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │    ROI       │ │    LTV       │ │    CAC       │   │
│  │   15.5%      │ │ R$ 12.500    │ │   R$ 800     │   │
│  │   ↑ Positivo │ │              │ │              │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Margem de Lucro: 73.4%              │  │
│  │                   Excelente                      │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                  RESUMO FINANCEIRO                      │
│  Receita Total: R$ 15.800,00                           │
│  Despesa Total: R$ 4.200,00                            │
│  Lucro Líquido: R$ 11.600,00 ✓                         │
├─────────────────────────────────────────────────────────┤
│                    GRÁFICOS (4)                         │
│  [Fluxo de Caixa] [Receitas] [Despesas] [ROI]         │
├─────────────────────────────────────────────────────────┤
│                 PREVISÕES COM IA                        │
│  📈 Crescimento Estimado: 8.5%                         │
│  ⭐ Confiança: 78.5% ████████░░                         │
│  💡 Insight: "Tendência positiva! Continue o padrão"   │
├─────────────────────────────────────────────────────────┤
│               RECOMENDAÇÕES INTELIGENTES                │
│  ✅ Saúde Financeira: Números estão bons              │
│  🚀 Crescimento Forte: Mantenha o padrão!             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 KPIs Explicados (Simples)

| KPI | O Que É | Exemplo | Ideal |
|-----|---------|---------|-------|
| **ROI** | Ganho por real investido | Investi R$ 1k, ganhei R$ 3k = 200% ROI | > 50% |
| **LTV** | Quanto um cliente gera | Cliente A gerou R$ 50k em 2 anos | Alto |
| **CAC** | Custa pra trazer cliente | Gastei R$ 100 pra conseguir 1 cliente | Baixo |
| **Margem** | % de lucro das vendas | Vendi R$ 100, lucrei R$ 73 = 73% | 50-70% |

---

## 💌 Enviando Relatórios

### Via Dashboard
1. Clique em **📧 Enviar Relatório**
2. Digite seu e-mail
3. Escolha período (7/30/90 dias)
4. Clique em **Enviar**

### Você receberá um e-mail com:
```
═══════════════════════════════════════════════════════════
                   Lumora Analytics
             Relatório de Inteligência Financeira
───────────────────────────────────────────────────────────

Olá Usuário,

   Seu Desempenho Financeiro (30 dias)

   ROI: 15.5%          Margem: 73.4%
   Lucro Líquido: R$ 11.600,00

   📊 Previsão de Crescimento
   Crescimento Estimado: 8.5%
   Confiança: 78.5%
   Insight: Tendência positiva! Continue...

   📈 Resumo do Período
   • Receita Total: R$ 15.800,00
   • Despesa Total: R$ 4.200,00
   • LTV: R$ 12.500,00
   • CAC: R$ 800,00

═══════════════════════════════════════════════════════════
```

---

## 🔌 Integrando com Sua API

```javascript
// Seu aplicativo pode chamar estes endpoints:

// 1. Buscar KPIs
fetch('/api/analytics/dashboard?usuario_id=1&periodo=30')
  .then(r => r.json())
  .then(data => {
    console.log('ROI:', data.kpis.roi);
    console.log('Crescimento:', data.previsao.crescimento_estimado);
  });

// 2. Gerar relatório completo
fetch('/api/analytics/relatorio?usuario_id=1&periodo=30')
  .then(r => r.json())
  .then(data => console.log(data.relatorio));

// 3. Enviar por e-mail
fetch('/api/analytics/enviar-relatorio', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usuario_id: 1,
    email: 'user@example.com',
    periodo: 30,
    agendar: false
  })
});
```

---

## 📈 Registrar Transações

Para que o dashboard funcione bem, você precisa de dados. Aqui estão exemplos de transações:

### Receitas
```json
{
  "tipo": "receita",
  "valor": 5000.00,
  "categoria": "serviços",
  "descricao": "Projeto completo de design",
  "data": "2026-05-27"
}
```

### Despesas
```json
{
  "tipo": "despesa",
  "valor": 1500.00,
  "categoria": "operacional",
  "descricao": "Aluguel do escritório",
  "data": "2026-05-27"
}
```

**Dados de exemplo já estão no banco!** Execute `python init_analytics.py` para carregá-los.

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` com:

```env
# SMTP para e-mail
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=seu_email@gmail.com
SENDER_PASSWORD=sua_app_password

# Ou use SendGrid
# SMTP_SERVER=smtp.sendgrid.net
# SENDER_PASSWORD=SG.sua_api_key

# Banco de dados
DATABASE_URL=sqlite:///sql/LUMORA_APP.db

# App
FLASK_ENV=development
DEBUG=True
```

---

## 🐛 Problemas Comuns

### ❌ "Erro ao enviar e-mail"
```
✓ Verifique .env com credenciais corretas
✓ Use App Password do Gmail (não senha comum)
✓ Confirme porta 587 para TLS
✓ Teste com: python -m smtplib ...
```

### ❌ "KPIs mostram zero"
```
✓ Execute: python init_analytics.py
✓ Insira dados de teste
✓ Verifique usuario_id
```

### ❌ "Previsão diz 'Dados insuficientes'"
```
✓ Mantenha 7+ dias de histórico
✓ Registre transações regularmente
✓ Previsão melhora com 90+ dias
```

---

## 📊 Dados Inclusos

Ao executar `python init_analytics.py`, você terá:

```
10 transações de exemplo:
├─ Receitas: R$ 17.300,00
│  ├─ Serviços: 5 transações
│  └─ Vendas: 2 transações
│
└─ Despesas: R$ 5.400,00
   ├─ Operacional: 2 transações
   ├─ Marketing: 2 transações
   └─ Pessoal: 1 transação

Período: Últimos 30 dias
ROI resultante: ~220%
Margem: ~69%
```

---

## 🎓 Formulas dos KPIs

Se quiser entender as fórmulas:

```python
# ROI (Return on Investment)
roi = ((receita - despesa) / despesa) * 100

# LTV (Lifetime Value)
ltv = sum(todas_as_receitas)

# CAC (Customer Acquisition Cost)
cac = sum(despesas_marketing_aquisicao)

# Margem
margem = ((receita - despesa) / receita) * 100

# Previsão
media_movel_7d = média_últimos_7_dias(saldos)
crescimento = ((atual - inicial) / inicial) * 100
confiança = 100 - (variância / média)
```

---

## 💰 Impacto para Seu Negócio

Este módulo adiciona:

```
ROI: 200%+ → Você ganha mais que investe
LTV > CAC: Seus clientes valem a pena
Margem 69%: Lucro muito bom!
Previsão IA: Toma decisões com inteligência
```

**Resultado**: Empresas querem comprar sua plataforma! 🎉

---

## 📚 Documentação Completa

Para mais detalhes, leia:
- **ANALYTICS_GUIDE.md** - Guia técnico completo
- **ARCHITECTURE.md** - Fluxos e diagrama
- **IMPLEMENTATION_SUMMARY.md** - Resumo de implementação

---

## ✨ Status

✅ Dashboard com KPIs  
✅ Gráficos interativos  
✅ Previsões com IA  
✅ Relatórios por e-mail  
✅ Recomendações inteligentes  
✅ API RESTful completa  
✅ Banco de dados otimizado  
✅ Documentação completa  

---

## 🎯 Próximos Passos

1. ✅ Executar `python init_analytics.py`
2. ✅ Acessar `/analytics`
3. ✅ Explorar o dashboard
4. ✅ Configurar SMTP (`.env`)
5. ✅ Enviar um relatório por e-mail
6. ✅ Registrar suas transações reais
7. ✅ Monitorar KPIs diariamente
8. ✅ Otimizar baseado em recomendações

---

**🚀 Seu site agora tem Analytics Enterprise-Grade!**

Qualquer dúvida, veja os arquivos `.md` ou explore o código comentado.

Sucesso! 🎉
