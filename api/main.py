from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from config import SECRET
import sqlite3

app = FastAPI()

manager = LoginManager(SECRET, token_url='/auth/token')

# Função para carregar o usuário do banco de dados
@manager.user_loader()
def load_user(email: str):
    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
    return user

# Rota para autenticação
@app.post("/auth/token/{device_name}")
def login(device_name: str, data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    password = data.password
    
    user = load_user(email)

    if not user:
        raise InvalidCredentialsException
    elif password != user[3]:
        raise InvalidCredentialsException
    
    access_token = manager.create_access_token(data=dict(sub=email))
    
    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO devices (device_name, access_token) VALUES (?, ?)", (device_name, access_token))
        conn.commit()
    
    return {
        'access_token': access_token,
        'token_type': 'bearer'
    }

@app.post("/signup")
def signup(data: OAuth2PasswordRequestForm = Depends()):
    email = data.username
    username = data.username
    password = data.password
    
    user = load_user(email)

    if user:
        return {
            'status' : 'username alredy exist'
        }

    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, password))
        conn.commit()
    
    return {
        'status' : 'sucess!'
    }
    

    