#!/usr/bin/env python3
"""
Script para inicializar banco de dados com tabelas de Analytics
Execute: python init_analytics.py
"""

import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sql" / "LUMORA_APP.db"
SCHEMA_PATH = BASE_DIR / "sql" / "analytics_schema.sql"


def inicializar_banco():
    try:
        print("📊 Inicializando Analytics & Business Intelligence...")
        print(f"   Database: {DB_PATH}")

        conexao = sqlite3.connect(DB_PATH)
        cursor = conexao.cursor()

        # Lê e executa o schema SQL
        with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
            schema = f.read()

        # Executa cada comando SQL
        for comando in schema.split(";"):
            if comando.strip():
                cursor.execute(comando)

        conexao.commit()
        conexao.close()

        print("✅ Database inicializado com sucesso!")
        print("   ✓ Tabelas criadas")
        print("   ✓ Índices criados")
        print("   ✓ Dados de exemplo inseridos")
        print("\n🎯 Próximos passos:")
        print("   1. Acesse http://127.0.0.1:5000/analytics")
        print("   2. Configure variáveis de ambiente para envio de e-mail")
        print("   3. Comece a registrar transações")

    except Exception as e:
        print(f"❌ Erro ao inicializar: {e}")
        exit(1)


if __name__ == "__main__":
    inicializar_banco()
