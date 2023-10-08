import sqlite3

# Conectar-se ao banco de dados SQLite
conn = sqlite3.connect('mydatabase.db')

# Criar uma tabela para armazenar informações do usuário
conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
''')

# Criar uma tabela para armazenar informações dos dispositivos conectados
conn.execute('''
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        device_name TEXT NOT NULL,
        access_token TEXT NOT NULL
    )
''')

conn.commit()
conn.close()
