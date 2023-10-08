import sqlite3

# Conectar-se ao banco de dados SQLite
conn = sqlite3.connect('mydatabase.db')

# Criar uma tabela para armazenar informações do usuário
conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )
''')

# Criar uma tabela para armazenar informações dos dispositivos conectados
conn.execute('''
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY,
        device_name TEXT NOT NULL,
        access_token TEXT NOT NULL
    )
''')

# Exemplo de inserção de dados do usuário
conn.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", ("john_doe", "john@example.com", "hashed_password"))

# Exemplo de inserção de dados de dispositivo
conn.execute("INSERT INTO devices (device_name, access_token) VALUES (?, ?)", ("Device 1", "device_token_1"))

# Confirmar a operação e fechar a conexão
conn.commit()
conn.close()
