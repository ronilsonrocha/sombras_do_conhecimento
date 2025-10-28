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

def get_all_obras():
    """Retorna todas as obras cadastradas"""
    conn, cursor = connect_db()
    cursor.execute("SELECT id, nome_autor, nome_obra, texto FROM obras")
    obras = cursor.fetchall()
    cursor.close()
    conn.close()
    return obras

def get_obra_by_id(obra_id):
    """Retorna uma obra específica pelo ID"""
    conn, cursor = connect_db()
    cursor.execute("SELECT id, nome_autor, nome_obra, texto FROM obras WHERE id = %s", (obra_id,))
    obra = cursor.fetchone()
    cursor.close()
    conn.close()
    return obra

def create_obra(nome_autor, nome_obra, texto):
    """Cria uma nova obra"""
    conn, cursor = connect_db()
    try:
        cursor.execute(
            "INSERT INTO obras (nome_autor, nome_obra, texto) VALUES (%s, %s, %s) RETURNING id",
            (nome_autor, nome_obra, texto)
        )
        obra_id = cursor.fetchone()[0]
        conn.commit()
        return obra_id
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def associate_user_with_obra(usuario_id, obra_id):
    """Associa um usuário a uma obra"""
    conn, cursor = connect_db()
    try:
        cursor.execute(
            "INSERT INTO usuario_obra (id_usuario, id) VALUES (%s, %s)",
            (usuario_id, obra_id)
        )
        conn.commit()
        return True
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def get_obras_by_user(usuario_id):
    """Retorna todas as obras associadas a um usuário"""
    conn, cursor = connect_db()
    cursor.execute("""
        SELECT o.id, o.nome_autor, o.nome_obra, o.texto 
        FROM obras o
        JOIN usuario_obra uo ON o.id = uo.id
        WHERE uo.id_usuario = %s
    """, (usuario_id,))
    obras = cursor.fetchall()
    cursor.close()
    conn.close()
    return obras

def update_obra(id, nome_obra, nome_autor, novo_texto):
    conn, cursor = connect_db()
    try:
        cursor.execute("UPDATE obras set texto = %s, nome_obra = %s, nome_autor = %s where id = %s", (novo_texto, nome_obra, nome_autor, id))
        rows_affected = cursor.rowcount
        conn.commit()
        
        return rows_affected > 0
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()