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

def register_user_response(usuario_id, pergunta_id, resposta):
    """Registra a resposta de um usuário a uma pergunta"""
    conn, cursor = connect_db()
    try:
        # Verifica se já existe um registro para esta pergunta e usuário
        cursor.execute(
            "SELECT id_pergunta FROM pergunta_usuario WHERE id_pergunta = %s AND id_usuario = %s",
            (pergunta_id, usuario_id)
        )
        exists = cursor.fetchone()
        
        if exists:
            # Atualiza a resposta existente
            cursor.execute(
                "UPDATE pergunta_usuario SET resposta_usuario = %s WHERE id_pergunta = %s AND id_usuario = %s",
                (resposta, pergunta_id, usuario_id)
            )
        else:
            # Insere uma nova resposta
            cursor.execute(
                "INSERT INTO pergunta_usuario (id_pergunta, id_usuario, resposta_usuario) VALUES (%s, %s, %s)",
                (pergunta_id, usuario_id, resposta)
            )
        
        conn.commit()
        
        # Verifica se a resposta está correta
        cursor.execute(
            "SELECT letra_correta FROM perguntas WHERE id_pergunta = %s",
            (pergunta_id,)
        )
        letra_correta = cursor.fetchone()[0]
        
        return {
            'is_correct': resposta == letra_correta,
            'correct_answer': letra_correta
        }
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def get_user_progress(usuario_id):
    """Retorna o progresso do usuário (perguntas respondidas e acertos)"""
    conn, cursor = connect_db()
    cursor.execute("""
        SELECT 
            p.id_pergunta,
            p.texto_enunciado,
            pu.resposta_usuario,
            p.letra_correta,
            CASE 
                WHEN pu.resposta_usuario = p.letra_correta THEN true
                ELSE false
            END AS esta_correta
        FROM 
            pergunta_usuario pu
        JOIN 
            perguntas p ON pu.id_pergunta = p.id_pergunta
        WHERE 
            pu.id_usuario = %s
    """, (usuario_id,))
    
    respostas = cursor.fetchall()
    
    # Calcula estatísticas
    total_respondidas = len(respostas)
    total_corretas = sum(1 for r in respostas if r[4])  # r[4] é o campo esta_correta
    
    cursor.close()
    conn.close()
    
    return {
        'total_respondidas': total_respondidas,
        'total_corretas': total_corretas,
        'percentual_acerto': (total_corretas / total_respondidas * 100) if total_respondidas > 0 else 0,
        'respostas': [
            {
                'id_pergunta': r[0],
                'texto_enunciado': r[1],
                'resposta_usuario': r[2],
                'resposta_correta': r[3],
                'esta_correta': r[4]
            } for r in respostas
        ]
    }

def get_user_progress_by_obra(usuario_id, obra_id):
    """Retorna o progresso do usuário em uma obra específica"""
    conn, cursor = connect_db()
    cursor.execute("""
        SELECT 
            p.id_pergunta,
            p.texto_enunciado,
            pu.resposta_usuario,
            p.letra_correta,
            CASE 
                WHEN pu.resposta_usuario = p.letra_correta THEN true
                ELSE false
            END AS esta_correta
        FROM 
            pergunta_usuario pu
        JOIN 
            perguntas p ON pu.id_pergunta = p.id_pergunta
        JOIN 
            pergunta_obra po ON p.id_pergunta = po.id_pergunta
        WHERE 
            pu.id_usuario = %s AND po.id_obra = %s
    """, (usuario_id, obra_id))
    
    respostas = cursor.fetchall()
    
    # Calcula estatísticas
    total_respondidas = len(respostas)
    total_corretas = sum(1 for r in respostas if r[4])  # r[4] é o campo esta_correta
    
    cursor.close()
    conn.close()
    
    return {
        'total_respondidas': total_respondidas,
        'total_corretas': total_corretas,
        'percentual_acerto': (total_corretas / total_respondidas * 100) if total_respondidas > 0 else 0,
        'respostas': [
            {
                'id_pergunta': r[0],
                'texto_enunciado': r[1],
                'resposta_usuario': r[2],
                'resposta_correta': r[3],
                'esta_correta': r[4]
            } for r in respostas
        ]
    }