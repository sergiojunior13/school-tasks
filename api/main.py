from fastapi import FastAPI, Depends, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi.responses import FileResponse
from app.validadores.email import validate_email
from app.basemodel.auth import LogoutModel, ImageModel, AssetsModel, DeleteModel
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
@app.post("/login")
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


@app.post("/image")
async def upload_image(image: UploadFile = File(...), data: ImageModel = Depends()):

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


@app.delete("/image")
def delete_image(data: ImageModel = Depends()):
    token = get_data(data)
    position = os.listdir(f"app/userdata/{token[1]}/{data.session}/images")
    position = position[data.position]
    image_path = f"app/userdata/{token[1]}/{data.session}/images/{position}"
    if os.path.exists(image_path):
        os.remove(image_path)
        return {
            "status": "done"
        }

    else:
        return {
            "status": "not found"
        }


@app.get("/image")
def get_image(data: ImageModel = Depends()):
    token = get_data(data)
    position = os.listdir(f"app/userdata/{token[1]}/{data.session}/images")
    position = position[data.position]
    image_path = f"app/userdata/{token[1]}/{data.session}/images/{position}"
    return FileResponse(image_path, media_type="image/png")


@app.post("/app/file")
def post_main_files(data: AssetsModel = Depends(), file: UploadFile = File(...)):
    directory = os.path.join(f"app/assets/{data.session}")
    os.makedirs(directory, exist_ok=True)
    counter = 0

    while True:
        filename = data.filename
        file_path = os.path.join(directory, filename)
        if not os.path.exists(file_path):
            break
        counter += 1

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "done"
    }


@app.delete("/app/file")
def delete_main_files(data: AssetsModel = Depends()):
    path = f"app/assets/{data.session}/{data.filename}"
    if os.path.exists(path):
        os.remove(path)
        return {
            "status": "done"
        }

    else:
        return {
            "status": "not found"
        }


import mimetypes


@app.get("/app/file")
def get_main_files(data: AssetsModel = Depends()):
    path = f"app/assets/{data.session}/{data.filename}"
    mime_type, encoding = mimetypes.guess_type(path)
    return FileResponse(path, media_type=mime_type)


from app.basemodel.auth import TasksModel
from tinydb import TinyDB


@app.post("/task")
def upload_task(data: TasksModel = Depends()):
    token = get_data(data)
    caminho_arquivo = f"app/userdata/{token[0]}/tasks/tasks.json"

    if not os.path.exists(caminho_arquivo):
        diretorio = os.path.dirname(caminho_arquivo)
        os.makedirs(diretorio, exist_ok=True)
        arquivo = open(caminho_arquivo, "x")
        arquivo.close()

    db = TinyDB(caminho_arquivo, indent=4)

    db.insert({
        "owner": token[1],
        "members": data.members,
        "members_id": data.members_id,
        "title": data.title,
        "about": data.about,
        "description": data.description,
        "value": data.value
    })
    return {"status": "done"}


@app.get("/task")
def get_task(data: LogoutModel = Depends()):
    token = get_data(data)
    return FileResponse(f"app/userdata/{token[0]}/tasks/tasks.json",
                        headers={
                            f"Content-Disposition": f"attachment;"
                                                    f" filename=app/userdata/{token[0]}/tasks/tasks.json"})


from app.basemodel.auth import UpdateModel


@app.put("/task")
def update_task(data: UpdateModel = Depends()):
    token = get_data(data)
    caminho_arquivo = f"app/userdata/{token[0]}/tasks/tasks.json"
    db = TinyDB(caminho_arquivo, indent=4)

    db.update(
        {
            "owner": token[1],
            "members": data.members,
            "members_id": data.members_id,
            "title": data.title,
            "about": data.about,
            "description": data.description,
            "value": data.value
        },
        doc_ids=[data.id]
    )
    return FileResponse(f"app/userdata/{token[0]}/tasks/tasks.json",
                        headers={f"Content-Disposition": f"attachment;"
                                                         f" filename=app/userdata/{token[0]}/tasks/tasks.json"})


@app.delete("/task")
def del_task(data: DeleteModel = Depends()):
    token = get_data(data)
    caminho_arquivo = f"app/userdata/{token[0]}/tasks/tasks.json"
    db = TinyDB(caminho_arquivo, indent=4)
    db.remove(doc_ids=[data.id])
    return FileResponse(f"app/userdata/{token[0]}/tasks/tasks.json",
                        headers={f"Content-Disposition": f"attachment; "
                                                         f"filename=app/userdata/{token[0]}/tasks/tasks.json"})
