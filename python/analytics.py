import sqlite3
from datetime import datetime, timedelta
from pathlib import Path
import json
from statistics import mean
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "sql" / "LUMORA_APP.db"


class AnalyticsService:
    def __init__(self):
        self.db_path = DB_PATH

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    # ==================== KPI CALCULATIONS ====================

    def calcular_roi(self, usuario_id, periodo_dias=30):
        """Calcula ROI (Return on Investment) em percentual"""
        conexao = self.get_connection()
        cursor = conexao.cursor()

        data_inicio = datetime.now() - timedelta(days=periodo_dias)

        cursor.execute("""
            SELECT
                SUM(CASE WHEN tipo='receita' THEN valor ELSE 0 END) as total_receita,
                SUM(CASE WHEN tipo='despesa' THEN valor ELSE 0 END) as total_despesa
            FROM Transacoes
            WHERE usuario_id=? AND data >= ?
        """, (usuario_id, data_inicio.isoformat()))

        resultado = cursor.fetchone()
        conexao.close()

        if not resultado or not resultado[0]:
            return 0

        receita = resultado[0] or 0
        despesa = resultado[1] or 0

        if despesa == 0:
            return 0

        roi = ((receita - despesa) / despesa) * 100
        return round(roi, 2)

    def calcular_ltv(self, usuario_id):
        """Calcula LTV (Lifetime Value) - valor total gerado pelo usuário"""
        conexao = self.get_connection()
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT SUM(valor)
            FROM Transacoes
            WHERE usuario_id=? AND tipo='receita'
        """, (usuario_id,))

        total = cursor.fetchone()[0] or 0
        conexao.close()

        return round(total, 2)

    def calcular_cac(self, usuario_id):
        """Calcula CAC (Customer Acquisition Cost) - custo para adquirir cliente"""
        conexao = self.get_connection()
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT SUM(valor)
            FROM Transacoes
            WHERE usuario_id=? AND tipo='despesa'
            AND categoria IN ('marketing', 'publicidade', 'aquisicao')
        """, (usuario_id,))

        total = cursor.fetchone()[0] or 0
        conexao.close()

        return round(total, 2)

    def get_dashboard_kpis(self, usuario_id, periodo_dias=30):
        """Retorna todos os KPIs para o dashboard"""
        conexao = self.get_connection()
        cursor = conexao.cursor()

        data_inicio = datetime.now() - timedelta(days=periodo_dias)

        # Total de receitas
        cursor.execute("""
            SELECT COALESCE(SUM(valor), 0)
            FROM Transacoes
            WHERE usuario_id=? AND tipo='receita' AND data >= ?
        """, (usuario_id, data_inicio.isoformat()))
        receita_total = cursor.fetchone()[0]

        # Total de despesas
        cursor.execute("""
            SELECT COALESCE(SUM(valor), 0)
            FROM Transacoes
            WHERE usuario_id=? AND tipo='despesa' AND data >= ?
        """, (usuario_id, data_inicio.isoformat()))
        despesa_total = cursor.fetchone()[0]

        # Lucro líquido
        lucro_liquido = receita_total - despesa_total

        # Margem
        margem = ((receita_total - despesa_total) / receita_total * 100) if receita_total > 0 else 0

        conexao.close()

        return {
            "roi": self.calcular_roi(usuario_id, periodo_dias),
            "ltv": self.calcular_ltv(usuario_id),
            "cac": self.calcular_cac(usuario_id),
            "receita_total": round(receita_total, 2),
            "despesa_total": round(despesa_total, 2),
            "lucro_liquido": round(lucro_liquido, 2),
            "margem_percentual": round(margem, 2),
            "periodo_dias": periodo_dias
        }

    # ==================== PREVISÕES COM IA ====================

    def gerar_previsao_crescimento(self, usuario_id, dias_futuros=30):
        """Gera previsão de crescimento usando histórico de dados"""
        conexao = self.get_connection()
        cursor = conexao.cursor()

        # Pega histórico dos últimos 90 dias
        data_inicio = datetime.now() - timedelta(days=90)

        cursor.execute("""
            SELECT DATE(data), SUM(CASE WHEN tipo='receita' THEN valor ELSE -valor END) as saldo_diario
            FROM Transacoes
            WHERE usuario_id=? AND data >= ?
            GROUP BY DATE(data)
            ORDER BY data ASC
        """, (usuario_id, data_inicio.isoformat()))

        dados = cursor.fetchall()
        conexao.close()

        if len(dados) < 7:
            return {
                "previsao": "Dados insuficientes",
                "confianca": 0,
                "crescimento_estimado": 0,
                "aviso": "Necessário pelo menos 7 dias de histórico"
            }

        # Calcula média móvel (7 dias)
        saldos = [float(d[1]) for d in dados]
        media_movel = self._calcular_media_movel(saldos, 7)

        # Trend linear simples
        if len(media_movel) > 1:
            crescimento = ((media_movel[-1] - media_movel[0]) / abs(media_movel[0]) * 100) if media_movel[0] != 0 else 0
        else:
            crescimento = 0

        # Previsão: mantém a tendência
        ultima_media = media_movel[-1]
        previsao_valor = ultima_media + (ultima_media * (crescimento / 100))

        # Confiança baseada na consistência dos dados
        variancia = self._calcular_variancia(saldos)
        confianca = max(0, min(100, 100 - (variancia / abs(ultima_media) * 100 if ultima_media != 0 else 100)))

        return {
            "valor_previsto": round(previsao_valor, 2),
            "crescimento_estimado": round(crescimento, 2),
            "confianca": round(confianca, 1),
            "dias_futuros": dias_futuros,
            "insight": self._gerar_insight(crescimento, confianca)
        }

    def _calcular_media_movel(self, valores, periodo):
        """Calcula média móvel simples"""
        media_movel = []
        for i in range(len(valores)):
            inicio = max(0, i - periodo + 1)
            media = mean(valores[inicio:i+1])
            media_movel.append(media)
        return media_movel

    def _calcular_variancia(self, valores):
        """Calcula variância dos valores"""
        if not valores or len(valores) < 2:
            return 0
        media = mean(valores)
        variancia = mean([(x - media) ** 2 for x in valores])
        return abs(variancia) ** 0.5

    def _gerar_insight(self, crescimento, confianca):
        """Gera insight em texto sobre a previsão"""
        if confianca < 50:
            return "Dados muito voláteis - acompanhe com atenção"

        if crescimento > 10:
            return "Tendência positiva! Continue o padrão atual"
        elif crescimento > 0:
            return "Crescimento moderado mantendo o padrão"
        elif crescimento > -10:
            return "Leve queda - revise despesas"
        else:
            return "Queda significativa - ação necessária"

    # ==================== RELATÓRIOS ====================

    def gerar_relatorio(self, usuario_id, periodo_dias=30):
        """Gera relatório completo com KPIs e insights"""
        kpis = self.get_dashboard_kpis(usuario_id, periodo_dias)
        previsao = self.gerar_previsao_crescimento(usuario_id)

        conexao = self.get_connection()
        cursor = conexao.cursor()

        # Top categorias de despesa
        cursor.execute("""
            SELECT categoria, SUM(valor) as total
            FROM Transacoes
            WHERE usuario_id=? AND tipo='despesa'
            GROUP BY categoria
            ORDER BY total DESC
            LIMIT 5
        """, (usuario_id,))

        top_despesas = cursor.fetchall()

        # Top categorias de receita
        cursor.execute("""
            SELECT categoria, SUM(valor) as total
            FROM Transacoes
            WHERE usuario_id=? AND tipo='receita'
            GROUP BY categoria
            ORDER BY total DESC
            LIMIT 5
        """, (usuario_id,))

        top_receitas = cursor.fetchall()
        conexao.close()

        return {
            "data_geracao": datetime.now().isoformat(),
            "periodo_dias": periodo_dias,
            "kpis": kpis,
            "previsao": previsao,
            "top_despesas": [{"categoria": d[0], "valor": round(d[1], 2)} for d in top_despesas],
            "top_receitas": [{"categoria": r[0], "valor": round(r[1], 2)} for r in top_receitas]
        }

    # ==================== E-MAIL ====================

    def enviar_relatorio_email(self, usuario_email, usuario_nome, relatorio):
        """Envia relatório por e-mail"""
        try:
            # Configurações do SMTP (Gmail, SendGrid, etc)
            smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
            smtp_port = int(os.getenv("SMTP_PORT", 587))
            sender_email = os.getenv("SENDER_EMAIL", "noreply@lumora.app")
            sender_password = os.getenv("SENDER_PASSWORD", "")

            # Corpo do e-mail em HTML
            corpo_html = self._gerar_html_relatorio(usuario_nome, relatorio)

            # Monta a mensagem
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"Lumora - Relatório Analytics [{relatorio['periodo_dias']}d]"
            msg["From"] = sender_email
            msg["To"] = usuario_email

            msg.attach(MIMEText(corpo_html, "html"))

            # Envia
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, usuario_email, msg.as_string())

            return {"status": "sucesso", "mensagem": "E-mail enviado"}

        except Exception as e:
            return {"status": "erro", "mensagem": str(e)}

    def _gerar_html_relatorio(self, usuario_nome, relatorio):
        """Gera HTML do relatório para e-mail"""
        kpis = relatorio["kpis"]
        previsao = relatorio["previsao"]

        return f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; background: #f5f5f5; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }}
                    .kpi-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }}
                    .kpi-card {{ background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }}
                    .kpi-label {{ font-size: 12px; color: #999; text-transform: uppercase; }}
                    .kpi-value {{ font-size: 24px; font-weight: bold; color: #333; }}
                    .insight {{ background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196F3; }}
                    .insight-title {{ font-weight: bold; color: #1976D2; }}
                    .footer {{ text-align: center; color: #999; font-size: 12px; margin-top: 30px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Lumora Analytics</h1>
                        <p>Relatório de Inteligência Financeira - {relatorio['periodo_dias']} dias</p>
                    </div>

                    <p>Olá {usuario_nome},</p>

                    <h2>Seu Desempenho Financeiro</h2>

                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-label">ROI</div>
                            <div class="kpi-value">{kpis['roi']:.1f}%</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Margem</div>
                            <div class="kpi-value">{kpis['margem_percentual']:.1f}%</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-label">Lucro Líquido</div>
                            <div class="kpi-value">R$ {kpis['lucro_liquido']:,.2f}</div>
                        </div>
                    </div>

                    <div class="insight">
                        <div class="insight-title">📊 Previsão de Crescimento</div>
                        <p><strong>Crescimento Estimado:</strong> {previsao['crescimento_estimado']:.1f}%</p>
                        <p><strong>Confiança:</strong> {previsao['confianca']:.0f}%</p>
                        <p><strong>Insight:</strong> {previsao['insight']}</p>
                    </div>

                    <p><strong>Resumo do Período:</strong></p>
                    <ul>
                        <li>Receita Total: R$ {kpis['receita_total']:,.2f}</li>
                        <li>Despesa Total: R$ {kpis['despesa_total']:,.2f}</li>
                        <li>LTV (Lifetime Value): R$ {kpis['ltv']:,.2f}</li>
                        <li>CAC (Customer Acquisition Cost): R$ {kpis['cac']:,.2f}</li>
                    </ul>

                    <p>Acesse seu dashboard para mais detalhes e visualizações interativas.</p>

                    <div class="footer">
                        <p>© 2026 Lumora - Inteligência Financeira com IA</p>
                    </div>
                </div>
            </body>
        </html>
        """
