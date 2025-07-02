import psycopg2
from django.conf import settings

def connect_db():
    """Estabelece conexão com o banco de dados PostgreSQL"""
    conn = psycopg2.connect(
        dbname=settings.DATABASES['default']['NAME'],
        user=settings.DATABASES['default']['USER'],
        password=settings.DATABASES['default']['PASSWORD'],
        host=settings.DATABASES['default']['HOST'],
        port=settings.DATABASES['default']['PORT']
    )
    return conn, conn.cursor()

def get_all_users():
    """Retorna todos os usuários cadastrados"""
    conn, cursor = connect_db()
    cursor.execute("SELECT id_usuario, nome, email, tipo_usuario FROM usuarios")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users

def get_user_by_id(user_id):
    """Retorna um usuário específico pelo ID"""
    conn, cursor = connect_db()
    cursor.execute("SELECT id_usuario, nome, email, tipo_usuario FROM usuarios WHERE id_usuario = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def create_user(nome, email, senha, tipo_usuario):
    """Cria um novo usuário"""
    conn, cursor = connect_db()
    try:
        cursor.execute(
            "INSERT INTO usuarios (nome, email, password, tipo_usuario) VALUES (%s, %s, %s, %s) RETURNING id",
            (nome, email, senha, tipo_usuario)
        )
        user_id = cursor.fetchone()[0]
        conn.commit()
        return user_id
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def update_user(user_id, nome=None, email=None, tipo_usuario=None):
    """Atualiza dados de um usuário existente"""
    conn, cursor = connect_db()
    try:
        updates = []
        params = []
        
        if nome:
            updates.append("nome = %s")
            params.append(nome)
        
        if email:
            updates.append("email = %s")
            params.append(email)
        
        if tipo_usuario:
            updates.append("tipo_usuario = %s")
            params.append(tipo_usuario)
        
        if updates:
            query = f"UPDATE usuarios SET {', '.join(updates)} WHERE id_usuario = %s"
            params.append(user_id)
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount > 0
        return False
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def authenticate_user(email, senha):
    """Autentica um usuário pelo email e senha"""
    conn, cursor = connect_db()
    cursor.execute("SELECT id_usuario, nome, tipo_usuario FROM usuarios WHERE email = %s AND senha = %s", (email, senha))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def reset_password(email, nova_senha):
    conn, cursor = connect_db()
    try:
        # Verificar se o usuário existe
        cursor.execute(
            "SELECT id_usuario FROM usuarios WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()
        
        if not user:
            return False
            
        # Atualizar a senha
        cursor.execute(
            "UPDATE usuarios SET senha = %s WHERE email = %s",
            (nova_senha, email)
        )
        
        rows_affected = cursor.rowcount
        conn.commit()
        
        return rows_affected > 0
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()