// ANALYTICS DASHBOARD - JavaScript

let chartInstances = {};

// Inicializa dashboard
async function inicializarDashboard() {
  try {
    await atualizarDashboard();
    console.log("Dashboard Analytics inicializado");
  } catch (error) {
    console.error("Erro ao inicializar dashboard:", error);
  }
}

// Atualiza todo dashboard
async function atualizarDashboard() {
  const periodo = document.getElementById("periodoSelect").value || 30;

  try {
    // Busca dados da API
    const response = await fetch(
      `/api/analytics/dashboard?usuario_id=1&periodo=${periodo}`
    );

    if (!response.ok) throw new Error("Erro ao buscar dados");

    const dados = await response.json();

    // Atualiza KPIs
    atualizarKPIs(dados.kpis);

    // Atualiza Resumo Financeiro
    atualizarResumoFinanceiro(dados.kpis);

    // Atualiza Previsões
    atualizarPrevisoes(dados.previsao);

    // Atualiza Gráficos
    await atualizarGraficos(dados);

    // Gera Recomendações
    gerarRecomendacoes(dados);

    mostrarNotificacao("Dashboard atualizado com sucesso", "sucesso");
  } catch (error) {
    console.error("Erro ao atualizar dashboard:", error);
    mostrarNotificacao("Erro ao atualizar dados", "erro");
  }
}

// Atualiza KPIs principais
function atualizarKPIs(kpis) {
  // ROI
  const roi = kpis.roi || 0;
  document.getElementById("roi-value").textContent = roi.toFixed(1) + "%";
  document.getElementById("roi-change").textContent =
    roi > 0 ? "↑ Positivo" : roi < 0 ? "↓ Negativo" : "Neutro";
  document.getElementById("roi-change").className =
    roi > 0 ? "kpi-change" : "kpi-change negative";

  // LTV
  const ltv = kpis.ltv || 0;
  document.getElementById("ltv-value").textContent =
    "R$ " + ltv.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  // CAC
  const cac = kpis.cac || 0;
  document.getElementById("cac-value").textContent =
    "R$ " + cac.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  // Margem
  const margem = kpis.margem_percentual || 0;
  document.getElementById("margem-value").textContent = margem.toFixed(1) + "%";
  document.getElementById("margem-change").textContent =
    margem > 30 ? "Excelente" : margem > 10 ? "Bom" : "Precisa melhorar";
}

// Atualiza Resumo Financeiro
function atualizarResumoFinanceiro(kpis) {
  const formatarMoeda = (valor) =>
    "R$ " + valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  document.getElementById("receita-value").textContent = formatarMoeda(
    kpis.receita_total
  );
  document.getElementById("despesa-value").textContent = formatarMoeda(
    kpis.despesa_total
  );
  document.getElementById("lucro-value").textContent = formatarMoeda(
    kpis.lucro_liquido
  );
}

// Atualiza Previsões
function atualizarPrevisoes(previsao) {
  if (previsao.confianca < 1) {
    document.getElementById("crescimento-value").textContent =
      previsao.previsao || "Dados insuficientes";
    document.getElementById("insight-text").textContent =
      previsao.aviso || "Necessário mais histórico";
    return;
  }

  const crescimento = previsao.crescimento_estimado || 0;
  document.getElementById("crescimento-value").textContent =
    crescimento.toFixed(1) + "%";

  const confianca = previsao.confianca || 0;
  document.getElementById("confianca-bar").style.width = confianca + "%";
  document.getElementById("confianca-value").textContent =
    confianca.toFixed(0) + "%";

  document.getElementById("insight-text").textContent =
    previsao.insight || "Analisando tendências...";
}

// Atualiza Gráficos
async function atualizarGraficos(dados) {
  // Gráfico 1: Fluxo de Caixa (placeholder - em app real seria dinâmico)
  await criarGraficoFluxoCaixa(dados);

  // Gráfico 2: Top Receitas
  criarGraficoReceitas(dados.top_receitas || []);

  // Gráfico 3: Top Despesas
  criarGraficoDespesas(dados.top_despesas || []);

  // Gráfico 4: ROI Evolution (placeholder)
  criarGraficoROI();
}

function criarGraficoFluxoCaixa(dados) {
  const ctx = document.getElementById("fluxoCaixaChart");
  if (!ctx) return;

  // Dados simulados (em app real, viriam da API)
  const labels = [
    "Dia 1",
    "Dia 5",
    "Dia 10",
    "Dia 15",
    "Dia 20",
    "Dia 25",
    "Dia 30",
  ];
  const receitas = [
    1200, 1500, 1800, 2100, 2500, 2800, 3200,
  ];
  const despesas = [800, 900, 950, 1100, 1200, 1300, 1400];

  if (chartInstances.fluxoCaixa) chartInstances.fluxoCaixa.destroy();

  chartInstances.fluxoCaixa = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Receitas",
          data: receitas,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Despesas",
          data: despesas,
          borderColor: "#f44336",
          backgroundColor: "rgba(244, 67, 54, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Valor (R$)" },
        },
      },
    },
  });
}

function criarGraficoReceitas(top_receitas) {
  const ctx = document.getElementById("receitaChart");
  if (!ctx) return;

  const labels = top_receitas.map((r) => r.categoria) || [
    "Serviços",
    "Vendas",
    "Outros",
  ];
  const dados = top_receitas.map((r) => r.valor) || [2500, 1800, 900];

  const cores = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#4facfe",
    "#00f2fe",
  ];

  if (chartInstances.receita) chartInstances.receita.destroy();

  chartInstances.receita = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: dados,
          backgroundColor: cores.slice(0, labels.length),
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

function criarGraficoDespesas(top_despesas) {
  const ctx = document.getElementById("despesaChart");
  if (!ctx) return;

  const labels = top_despesas.map((d) => d.categoria) || [
    "Operacional",
    "Marketing",
    "Pessoal",
  ];
  const dados = top_despesas.map((d) => d.valor) || [1500, 800, 600];

  const cores = ["#ff6b6b", "#ee5a6f", "#f44336", "#ff7043", "#ffb74d"];

  if (chartInstances.despesa) chartInstances.despesa.destroy();

  chartInstances.despesa = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Valor (R$)",
          data: dados,
          backgroundColor: cores.slice(0, labels.length),
          borderRadius: 8,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { beginAtZero: true },
      },
    },
  });
}

function criarGraficoROI() {
  const ctx = document.getElementById("roiChart");
  if (!ctx) return;

  const labels = [
    "Sem 1",
    "Sem 2",
    "Sem 3",
    "Sem 4",
    "Sem 5",
  ];
  const roiData = [5.2, 7.8, 6.5, 8.3, 9.1];

  if (chartInstances.roi) chartInstances.roi.destroy();

  chartInstances.roi = new Chart(ctx, {
    type: "area",
    data: {
      labels,
      datasets: [
        {
          label: "ROI (%)",
          data: roiData,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Gera Recomendações Inteligentes
function gerarRecomendacoes(dados) {
  const recomendacoes = [];
  const kpis = dados.kpis;
  const previsao = dados.previsao;

  // Recomendação 1: ROI
  if (kpis.roi > 0 && kpis.roi < 10) {
    recomendacoes.push({
      titulo: "📈 ROI Baixo",
      texto:
        "Seu ROI é positivo mas está baixo. Considere aumentar receitas ou reduzir custos operacionais.",
    });
  }

  // Recomendação 2: Margem
  if (kpis.margem_percentual < 20) {
    recomendacoes.push({
      titulo: "💰 Melhorar Margem",
      texto:
        "Sua margem de lucro está abaixo de 20%. Analise e otimize seus custos variáveis.",
    });
  }

  // Recomendação 3: LTV vs CAC
  const ratio = kpis.ltv / (kpis.cac || 1);
  if (ratio < 3) {
    recomendacoes.push({
      titulo: "🎯 LTV/CAC Ratio",
      texto:
        "Seu LTV está próximo do CAC. Idealmente, LTV deve ser 3x o CAC para saúde financeira.",
    });
  }

  // Recomendação 4: Previsão
  if (
    previsao.crescimento_estimado < 0 &&
    previsao.confianca > 70
  ) {
    recomendacoes.push({
      titulo: "⚠️ Atenção - Queda Prevista",
      texto:
        "A tendência indica queda de " +
        Math.abs(previsao.crescimento_estimado).toFixed(1) +
        "%. Revise sua estratégia.",
    });
  } else if (
    previsao.crescimento_estimado > 10 &&
    previsao.confianca > 70
  ) {
    recomendacoes.push({
      titulo: "🚀 Crescimento Forte",
      texto:
        "Previsão indica crescimento de " +
        previsao.crescimento_estimado.toFixed(1) +
        ". Mantenha o padrão!",
    });
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push({
      titulo: "✅ Saúde Financeira",
      texto:
        "Seus números estão bons. Continue monitorando e otimizando conforme necessário.",
    });
  }

  // Renderiza recomendações
  const container = document.getElementById("recomendacoes");
  container.innerHTML = recomendacoes
    .map(
      (rec) => `
    <div class="recomendacao-item">
      <div class="recomendacao-titulo">${rec.titulo}</div>
      <div class="recomendacao-texto">${rec.texto}</div>
    </div>
  `
    )
    .join("");
}

// MODAL FUNCTIONS
function mostrarModalRelatorio() {
  document.getElementById("modalRelatorio").classList.add("active");
}

function fecharModalRelatorio() {
  document.getElementById("modalRelatorio").classList.remove("active");
}

// Enviar Relatório por E-mail
async function enviarRelatorioEmail(event) {
  event.preventDefault();

  const email = document.getElementById("emailRelatorio").value;
  const periodo = document.getElementById("periodoRelatorio").value;
  const agendar = document.getElementById("agendarRelatorio").checked;

  try {
    const response = await fetch("/api/analytics/enviar-relatorio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: 1,
        email,
        periodo: parseInt(periodo),
        agendar,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      mostrarNotificacao(
        "Relatório enviado com sucesso!",
        "sucesso"
      );
      fecharModalRelatorio();
      document.querySelector("form").reset();
    } else {
      mostrarNotificacao(
        result.mensagem || "Erro ao enviar relatório",
        "erro"
      );
    }
  } catch (error) {
    console.error("Erro ao enviar relatório:", error);
    mostrarNotificacao("Erro ao enviar relatório", "erro");
  }
}

// Notificações
function mostrarNotificacao(mensagem, tipo = "info") {
  // Cria elemento de notificação
  const notif = document.createElement("div");
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${tipo === "sucesso" ? "#4caf50" : tipo === "erro" ? "#f44336" : "#2196F3"};
    color: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;
  notif.textContent = mensagem;

  document.body.appendChild(notif);

  // Remove após 4 segundos
  setTimeout(() => notif.remove(), 4000);
}

// Inicializa ao carregar página
document.addEventListener("DOMContentLoaded", inicializarDashboard);

// Atualiza a cada 5 minutos
setInterval(atualizarDashboard, 5 * 60 * 1000);
