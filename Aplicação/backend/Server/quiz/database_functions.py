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

def get_all_perguntas():
    """Retorna todas as perguntas cadastradas"""
    conn, cursor = connect_db()
    cursor.execute("SELECT id_pergunta, texto_enunciado, nivel, letra_correta FROM perguntas")
    perguntas = cursor.fetchall()
    cursor.close()
    conn.close()
    return perguntas

def get_pergunta_with_alternativas(pergunta_id):
    """Retorna uma pergunta específica com suas alternativas"""
    conn, cursor = connect_db()
    
    # Busca a pergunta
    cursor.execute("""
        SELECT id_pergunta, texto_enunciado, nivel, letra_correta 
        FROM perguntas 
        WHERE id_pergunta = %s
    """, (pergunta_id,))
    pergunta = cursor.fetchone()
    
    if not pergunta:
        cursor.close()
        conn.close()
        return None
    
    # Busca as alternativas da pergunta
    cursor.execute("""
        SELECT id_alternativa, letra_alternativa, texto_alternativa 
        FROM alternativas 
        WHERE id_pergunta = %s
        ORDER BY letra_alternativa
    """, (pergunta_id,))
    alternativas = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    # Formata o resultado
    result = {
        'id_pergunta': pergunta[0],
        'texto_enunciado': pergunta[1],
        'nivel': pergunta[2],
        'letra_correta': pergunta[3],
        'alternativas': [
            {
                'id_alternativa': alt[0],
                'letra': alt[1],
                'texto': alt[2]
            } for alt in alternativas
        ]
    }
    
    return result

def create_pergunta_with_alternativas(texto_enunciado, nivel, letra_correta, alternativas):
    """
    Cria uma nova pergunta com suas alternativas
    
    Args:
        texto_enunciado: Texto da pergunta
        nivel: Nível de dificuldade (facil, medio, dificil)
        letra_correta: Letra da alternativa correta (A, B, C, D)
        alternativas: Lista de dicionários com as alternativas no formato:
                     [{'letra': 'A', 'texto': 'Texto da alternativa A'}, ...]
    """
    conn, cursor = connect_db()
    try:
        # Insere a pergunta
        cursor.execute(
            "INSERT INTO perguntas (texto_enunciado, nivel, letra_correta) VALUES (%s, %s, %s) RETURNING id_pergunta",
            (texto_enunciado, nivel, letra_correta)
        )
        pergunta_id = cursor.fetchone()[0]
        
        # Insere as alternativas
        for alt in alternativas:
            cursor.execute(
                "INSERT INTO alternativas (letra_alternativa, texto_alternativa, id_pergunta) VALUES (%s, %s, %s)",
                (alt['letra'], alt['texto'], pergunta_id)
            )
        
        conn.commit()
        return pergunta_id
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def associate_pergunta_with_obra(pergunta_id, obra_id):
    """Associa uma pergunta a uma obra"""
    conn, cursor = connect_db()
    try:
        cursor.execute(
            "INSERT INTO pergunta_obra (id_pergunta, id_obra) VALUES (%s, %s)",
            (pergunta_id, obra_id)
        )
        conn.commit()
        return True
    except psycopg2.Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def get_perguntas_by_obra(obra_id):
    """Retorna todas as perguntas associadas a uma obra"""
    conn, cursor = connect_db()
    cursor.execute("""
        SELECT p.id_pergunta, p.texto_enunciado, p.nivel, p.letra_correta 
        FROM perguntas p
        JOIN pergunta_obra po ON p.id_pergunta = po.id_pergunta
        WHERE po.id_obra = %s
    """, (obra_id,))
    perguntas = cursor.fetchall()
    cursor.close()
    conn.close()
    return perguntas
