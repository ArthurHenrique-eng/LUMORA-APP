-- Schema para Módulo Analytics & Business Intelligence
-- Execute este script para criar/atualizar as tabelas necessárias

-- Tabela de Transações (se não existir)
CREATE TABLE IF NOT EXISTS Transacoes (
    IDTransacao INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('receita', 'despesa')),
    valor REAL NOT NULL,
    categoria TEXT,
    descricao TEXT,
    data TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES UsuariosLumoraAPP(IDUsuariosLumora)
);

-- Tabela de Relatórios Agendados
CREATE TABLE IF NOT EXISTS RelatoriosAgendados (
    IDRelatorio INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    periodo_dias INTEGER DEFAULT 30,
    ativo BOOLEAN DEFAULT 1,
    frequencia TEXT DEFAULT 'semanal',
    proximo_envio TEXT,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES UsuariosLumoraAPP(IDUsuariosLumora)
);

-- Tabela de Histórico de Previsões (para rastrear acurácia)
CREATE TABLE IF NOT EXISTS PrevisoesCrescimento (
    IDPrevisao INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    data_previsao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    crescimento_estimado REAL,
    confianca REAL,
    valor_real REAL,
    acurado BOOLEAN,
    FOREIGN KEY (usuario_id) REFERENCES UsuariosLumoraAPP(IDUsuariosLumora)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_transacoes_usuario ON Transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON Transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON Transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_relatorios_usuario ON RelatoriosAgendados(usuario_id);
CREATE INDEX IF NOT EXISTS idx_previsoes_usuario ON PrevisoesCrescimento(usuario_id);

-- Dados de exemplo para testes
INSERT OR IGNORE INTO Transacoes (usuario_id, tipo, valor, categoria, descricao, data) VALUES
(1, 'receita', 5000.00, 'serviços', 'Consultoria completa', date('now', '-30 days')),
(1, 'receita', 3200.00, 'vendas', 'Venda de produto X', date('now', '-28 days')),
(1, 'despesa', 1500.00, 'operacional', 'Aluguel do escritório', date('now', '-29 days')),
(1, 'despesa', 800.00, 'marketing', 'Publicidade digital', date('now', '-27 days')),
(1, 'receita', 2800.00, 'serviços', 'Treinamento corporativo', date('now', '-25 days')),
(1, 'despesa', 600.00, 'pessoal', 'Ferramentas de desenvolvimento', date('now', '-24 days')),
(1, 'receita', 4500.00, 'vendas', 'Projeto grande', date('now', '-20 days')),
(1, 'despesa', 2000.00, 'operacional', 'Serviços de infraestrutura', date('now', '-19 days')),
(1, 'receita', 1800.00, 'serviços', 'Consultoria rápida', date('now', '-15 days')),
(1, 'despesa', 500.00, 'marketing', 'Conteúdo e copywriting', date('now', '-14 days'));
