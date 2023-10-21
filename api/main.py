from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from app.validadores.email import validate_email
from app.basemodel.auth import LogoutModel, DeleteModel, ReplaceTasksModel
from config import SECRET, DB_ADDRESS
import psycopg2

app = FastAPI()

manager = LoginManager(SECRET, token_url='/auth/token')


def get_data(model):
    with psycopg2.connect(DB_ADDRESS) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM devices WHERE access_token=%s", (model.access_token,))
        conn.commit()
    
    lines = cursor.fetchone()
    cursor.close()
    
    return lines


# Função para carregar o usuário do banco de dados
@manager.user_loader()
def load_user(email: str):
    with psycopg2.connect(DB_ADDRESS) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        
    conn.commit()
    cursor.close()
    
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

    with psycopg2.connect(DB_ADDRESS) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO devices (user_id, device_name, access_token) VALUES (%s, %s, %s)",
                       (user[0], device_name, access_token))
        conn.commit()

    cursor.close()
    return {
        'access_token': access_token,
    }


@app.post("/signup")
def signup(data: OAuth2PasswordRequestForm = Depends()):
    try:
        validate_email(data.username)

    except:
        raise HTTPException(status_code=401, detail="Invalid email")

    email = data.username
    username = data.username
    password = data.password

    user = load_user(email)

    if user:
        raise HTTPException(status_code=444, detail="Username already exists")

    if len(password) < 8:
        raise HTTPException(status_code=408, detail="Password must be longer than 8 characters")
    elif len(password) > 20:
        raise HTTPException(status_code=420, detail="Password must be no longer than 20 characters")

    with psycopg2.connect(DB_ADDRESS) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
        conn.commit()

    cursor.close()


@app.post("/logout")
def logout(data: LogoutModel = Depends()):
    with psycopg2.connect(DB_ADDRESS) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM devices WHERE access_token=%s", (data.access_token,))
        token = cursor.fetchone()
        if not token:
            return {
                "status": "not found"
            }
        cursor.execute("DELETE FROM devices WHERE access_token=%s", (data.access_token,))
        conn.commit()
        cursor.close()
        
    return {
        "status": "disconnected"
    }


from app.basemodel.auth import TasksModel


@app.post("/task")
def upload_task(data: TasksModel = Depends()):
    token = get_data(data)
    token = token[1]
    with psycopg2.connect(DB_ADDRESS) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tasks (user_id, title, about, description, value, members, date, status) VALUES ("
                       "%s, %s, %s, %s, %s, %s, %s, %s)",
                       (int(token), data.title, data.about, data.description,
                        int(data.value), data.members, data.date, data.status))
        conn.commit()
    
    cursor.execute('''
            SELECT * FROM tasks WHERE user_id=%s
        ''',
        (token,)
    )
    
    id = len(cursor.fetchall())
    
    conn.commit()
    cursor.close()
    
    return {
        'id' : id
    }

@app.get("/task")
def get_task(data: LogoutModel = Depends()):
    token = get_data(data)
    token = token[1]
    conn = psycopg2.connect(DB_ADDRESS)
    cursor = conn.cursor()

    cursor.execute('''SELECT * FROM tasks WHERE user_id=%s''', (token,))
    data = cursor.fetchall()
    resultado = {'_default': {}}

    for item in data:
        task_id = item[0]
        resultado['_default'][task_id] = {
            'owner': item[1],
            'title': item[2],
            'about': item[3],
            'description': item[4],
            'value': item[5],
            'members': item[6],
            'date': item[7],
            'status': item[8]
        }
    
    conn.commit()
    cursor.close()
    
    return resultado


from app.basemodel.auth import UpdateModel


@app.put("/task")
def update_task(data: UpdateModel = Depends()):
    conn = psycopg2.connect(DB_ADDRESS)
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE tasks 
        SET title=%s,
            about=%s,
            description=%s,
            value=%s,
            members=%s,
            date=%s,
            status=%s
        WHERE task_id=%s
    ''',
                   (
                       data.title,
                       data.about,
                       data.description,
                       data.value,
                       data.members,
                       data.date,
                       data.status,
                       data.id
                   )
                   )
    conn.commit()
    cursor.close()


@app.delete("/task")
def del_task(data: DeleteModel = Depends()):
    token = get_data(data)
    token = token[1]
    conn = psycopg2.connect(DB_ADDRESS)
    cursor = conn.cursor()
    
    cursor.execute(
        '''
            DELETE FROM tasks WHERE task_id=%s
        ''', (data.id,)
    )
    conn.commit()
    cursor.close()


import json


@app.post("/tasks")
def replace_tasks(data: ReplaceTasksModel = Depends()):
    token = get_data(data)
    token = token[1]
    new_tasks_to_replace = json.loads(data.new_tasks_to_replace)

    conn = psycopg2.connect(DB_ADDRESS)
    cursor = conn.cursor()

    cursor.execute('''
            DELETE FROM tasks WHERE user_id=%s
        ''', (token,)
    )

    conn.commit()

    for task in new_tasks_to_replace:
        try:
            if task['status']:
                pass
        except:
            task['status'] = ''
            print("DEU ERRO E FOI SOLUCIONADO")
        cursor.execute("INSERT INTO tasks (user_id, title, about, description, value, members, date, status) VALUES ("
                       "%s, %s, %s, %s, %s, %s, %s, %s)",
                       (token, task['title'], task['about'], task['description'],
                        task['value'], task['members'], task['date'], task['status']))
        conn.commit()
        
    cursor.close()
