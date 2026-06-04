import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "sql" / "LUMORA_APP.db"

def init_database():
    # Cria a pasta sql se não existir
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    conexao = sqlite3.connect(DB_PATH)
    cursor = conexao.cursor()

    # Cria a tabela se não existir
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS UsuariosLumoraAPP (
            IDUsuariosLumora INTEGER PRIMARY KEY AUTOINCREMENT,
            Email TEXT NOT NULL UNIQUE,
            Senha TEXT NOT NULL,
            DataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    conexao.commit()
    conexao.close()

if __name__ == "__main__":
    init_database()
    print(f"Banco de dados inicializado com sucesso!")

