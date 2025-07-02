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
        SELECT id, letra_alternativa, texto_alternativa 
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
                'id': alt[0],
                'letra': alt[1],
                'texto': alt[2]
            } for alt in alternativas
        ]
    }
    
    return result

def get_perguntas_com_alternativas_por_nivel_e_obra(nivel, id_obra):
    """Retorna todas as perguntas com alternativas, filtradas por nível e obra"""
    conn, cursor = connect_db()

    cursor.execute("""
        SELECT p.id_pergunta, p.texto_enunciado, p.nivel, p.letra_correta,
        a.id, a.letra_alternativa, a.texto_alternativa
        FROM perguntas p
        JOIN pergunta_obra po ON p.id_pergunta = po.id_pergunta
        JOIN alternativas a ON p.id_pergunta = a.id_pergunta
        WHERE p.nivel = %s AND po.id_obra = %s
        ORDER BY p.id_pergunta, a.letra_alternativa
    """, (nivel, id_obra))
    
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    perguntas_dict = {}
    for row in rows:
        id_pergunta = row[0]
        if id_pergunta not in perguntas_dict:
            perguntas_dict[id_pergunta] = {
                "id_pergunta": id_pergunta,
                "texto_enunciado": row[1],
                "nivel": row[2],
                "letra_correta": row[3],
                "alternativas": []
            }
        perguntas_dict[id_pergunta]["alternativas"].append({
            "id": row[4],
            "letra": row[5],
            "texto": row[6]
        })

    return list(perguntas_dict.values())



def create_pergunta_with_alternativas(texto_enunciado, nivel, letra_correta, alternativas):
    """
    Cria uma nova pergunta com suas alternativas
    
    Args:
        texto_enunciado (str): Texto da pergunta
        nivel (str): Nível de dificuldade (facil, medio, dificil)
        letra_correta (str): Letra da alternativa correta (A, B, C, D)
        alternativas (list): Lista de dicionários com as alternativas
            [
                {"letra": "A", "texto": "Texto da alternativa A"},
                {"letra": "B", "texto": "Texto da alternativa B"},
                ...
            ]
    
    Returns:
        int: ID da pergunta criada
    """
    conn, cursor = connect_db()
    try:
        # Inserir a pergunta
        cursor.execute(
            "INSERT INTO perguntas (texto_enunciado, nivel, letra_correta) VALUES (%s, %s, %s) RETURNING id_pergunta",
            (texto_enunciado, nivel, letra_correta)
        )
        pergunta_id = cursor.fetchone()[0]
        
        # Inserir as alternativas
        for alt in alternativas:
            cursor.execute(
                "INSERT INTO alternativas (id_pergunta, letra_alternativa, texto_alternativa) VALUES (%s, %s, %s)",
                (pergunta_id, alt["letra"], alt["texto"])
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
