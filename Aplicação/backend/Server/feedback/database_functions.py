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

def submit_feedback(usuario_id, comentarios):
    """Registra uma avaliação/feedback de um usuário"""
    conn, cursor = connect_db()
    try:
        cursor.execute(
            "INSERT INTO avaliacao (comentarios, id_usuario) VALUES (%s, %s) RETURNING id",
            (comentarios, usuario_id)
        )
        avaliacao_id = cursor.fetchone()[0]
        conn.commit()
        return avaliacao_id
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def get_all_feedbacks():
    """Retorna todas as avaliações/feedbacks"""
    conn, cursor = connect_db()
    cursor.execute("""
        SELECT a.id, a.pontos_experiencia, a.comentarios, a.id_usuario, u.nome
        FROM avaliacao a
        JOIN usuarios u ON a.id_usuario = u.id_usuario
        ORDER BY a.id DESC
    """)
    avaliacoes = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [
        {
            'id': a[0],
            'pontos_experiencia': a[1],
            'comentarios': a[2],
            'id_usuario': a[3],
            'nome_usuario': a[4]
        } for a in avaliacoes
    ]

def get_user_feedbacks(usuario_id):
    """Retorna todas as avaliações/feedbacks de um usuário específico"""
    conn, cursor = connect_db()
    cursor.execute("""
        SELECT id, pontos_experiencia, comentarios
        FROM avaliacao
        WHERE id_usuario = %s
        ORDER BY id DESC
    """, (usuario_id,))
    avaliacoes = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [
        {
            'id': a[0],
            'pontos_experiencia': a[1],
            'comentarios': a[2]
        } for a in avaliacoes
    ]

def get_average_rating():
    """Retorna a média de pontos de experiência de todas as avaliações"""
    conn, cursor = connect_db()
    cursor.execute("SELECT AVG(pontos_experiencia) FROM avaliacao")
    avg = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return avg
