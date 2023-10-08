from fastapi import FastAPI, Depends, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from app.validadores.email import validate_email
from app.basemodel.auth import LogoutModel, ImageModel
from config import SECRET
import sqlite3

app = FastAPI()

manager = LoginManager(SECRET, token_url='/auth/token')


def get_data(model):
    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM devices WHERE access_token=?", (model.access_token,))
    return cursor.fetchone()


# Função para carregar o usuário do banco de dados
@manager.user_loader()
def load_user(email: str):
    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
    return user


# Rota para authenticate
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
        cursor.execute("INSERT INTO devices (user_id, device_name, access_token) VALUES (?, ?, ?)",
                       (user[0], device_name, access_token))
        conn.commit()

    return {
        'access_token': access_token,
    }


@app.post("/signup")
def signup(data: OAuth2PasswordRequestForm = Depends()):
    try:
        validate_email(data.username)

    except:
        raise InvalidCredentialsException

    email = data.username
    username = data.username
    password = data.password

    user = load_user(email)

    if user:
        return {
            'status': 'username already exist'
        }

    if len(password) < 8:
        return "A senha deve ser maior ou igual a 8 caracteres"
    elif len(password) > 20:
        return "A senha deve ser menor ou igual a 20 caracteres"

    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (username, email, password))
        conn.commit()

    return {
        'status': 'done'
    }


@app.post("/logout")
def logout(data: LogoutModel = Depends()):
    with sqlite3.connect('mydatabase.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM devices WHERE access_token=?", (data.access_token,))
        token = cursor.fetchone()
        if not token:
            return {
                "status": "not found"
            }
        cursor.execute("DELETE FROM devices WHERE access_token=?", (data.access_token,))
        conn.commit()
        cursor.close()
    conn.close()
    return {
        "status": "disconnected"
    }


import shutil
import os


@app.post("/upload/image")
async def image_upload(image: UploadFile = File(...), data: ImageModel = Depends()):

    MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
    if image.file.tell() > MAX_FILE_SIZE_BYTES:
        return "O arquivo é muito grande. Limite de 5 MB."

    token = get_data(data)
    base_directory = "app/userdata"
    user_directory = os.path.join(base_directory, str(token[1]))
    images_directory = os.path.join(user_directory, f"{data.session}/images")
    os.makedirs(images_directory, exist_ok=True)
    base_filename = "IMG"
    counter = 0

    while True:
        filename = f"{base_filename}_{counter}.png"
        file_path = os.path.join(images_directory, filename)
        if not os.path.exists(file_path):
            break
        counter += 1

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {
        "status": "done"
    }


@app.post("/delete/image")
def image_delete(data: ImageModel = Depends()):
    token = get_data(data)
    image_path = f"app/userdata/{token[1]}/{data.session}/images/{data.file_name}"
    print(image_path)
    if os.path.exists(image_path):
        os.remove(image_path)
        return {
            "status": "done"
        }

    else:
        return {
            "status": "not found"
        }


