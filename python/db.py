import sqlite3

conexao = sqlite3.connect("sql/LUMORA_APP.db")

cursor = conexao.cursor()

cursor.execute(
"""
SELECT name

FROM sqlite_master

WHERE type='table'
"""
)

print(cursor.fetchall())

conexao.close()
