-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha CHAR(60) NOT NULL,  -- Recomendado para hashes
    tipo_usuario VARCHAR(50) NOT NULL
);

-- Tabela de perguntas
CREATE TABLE IF NOT EXISTS perguntas (
    id_pergunta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto_enunciado TEXT NOT NULL,
    nivel VARCHAR(20),
    letra_correta CHAR(1) NOT NULL -- (A, B, C, D, E)
);

-- Tabela de alternativas
CREATE TABLE IF NOT EXISTS alternativas (
    id_alternativa INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    letra_alternativa CHAR(1) NOT NULL, -- (A, B, C, D, E)
    texto_alternativa TEXT NOT NULL,
    id_pergunta INTEGER NOT NULL REFERENCES perguntas(id_pergunta)
);

-- Tabela de obras
CREATE TABLE IF NOT EXISTS obras (
    id_obra INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_autor VARCHAR(50) NOT NULL,
    nome_obra VARCHAR(50) NOT NULL,
    texto TEXT NOT NULL
);

-- Tabela de avaliação
CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pontos_experiencia INTEGER NOT NULL,
    comentarios TEXT,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario)
);

-- Relacionamento entre perguntas e usuários
CREATE TABLE IF NOT EXISTS pergunta_usuario (
    id_pergunta INTEGER NOT NULL REFERENCES perguntas(id_pergunta),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    resposta_usuario VARCHAR(1),  -- (A, B, C, D, E) para comparar com a resposta correta
    PRIMARY KEY (id_pergunta, id_usuario)
);

-- Relacionamento entre perguntas e obras
CREATE TABLE IF NOT EXISTS pergunta_obra (
    id_pergunta INTEGER NOT NULL REFERENCES perguntas(id_pergunta),
    id_obra INTEGER NOT NULL REFERENCES obras(id_obra),
    PRIMARY KEY (id_pergunta, id_obra)
);

-- Relacionamento entre usuários e obras
CREATE TABLE IF NOT EXISTS usuario_obra (
    id_obra INTEGER NOT NULL REFERENCES obras(id_obra),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
    PRIMARY KEY (id_obra, id_usuario)
);

-- Observação: abaixo tem um check constraint para garantir que o banco só aceite alunos ou professores 
ALTER TABLE usuarios
ADD CONSTRAINT chk_tipo_usuario
CHECK (tipo_usuario IN ('aluno', 'professor'));

ALTER TABLE perguntas
ADD CONSTRAINT chk_letra_correta
CHECK (letra_correta IN ('A', 'B', 'C', 'D'));

ALTER TABLE alternativas
ADD CONSTRAINT chk_letra_alternativa
CHECK (letra_alternativa IN ('A', 'B', 'C', 'D'));

/*Dados para testes */
/*
select * from alternativas;
select * from perguntas;
select * from avaliacao;
select * from usuarios;

INSERT INTO usuarios (cpf, nome, email, senha, tipo_usuario)
VALUES('12215678901', 'Paulo Oliveira', 'oliveira.8025@email.com', '123456', 'aluno'),
    ('12345678901', 'João Silva', 'joao.silva@email.com', '123456', 'aluno');


insert into avaliacao (pontos_experiencia,comentarios,id_usuario)
values
    (5, 'Gostei muito do app e do quis', 5), --  Tem que verificar o id do seu usuários
    (2,'Não gostei muito do app e do quis', 6); --  Tem que verificar o id do seu usuários

insert into alternativas (letra_alternativa,texto_alternativa,id_pergunta)
values
	('A',' O céu estrelado', 2),
	('B','Sombras de objetos',2),
	('C','Desenhos coloridos',2),
	('D','Pinturas',2);

INSERT INTO pergunta_usuario (id_pergunta, id_usuario, resposta_usuario)
VALUES (1, 4, 'B');

-- Consulta para verificar as respostas dos usuários às perguntas
SELECT 
    u.nome AS nome_usuario,
    pu.id_pergunta,
    p.texto_enunciado,
    pu.resposta_usuario,
    p.letra_correta,
    CASE 
        WHEN pu.resposta_usuario = p.letra_correta THEN 'Correta'
        ELSE 'Incorreta'
    END AS situacao
FROM 
    pergunta_usuario pu
JOIN 
    perguntas p ON pu.id_pergunta = p.id_pergunta
JOIN 
    usuarios u ON pu.id_usuario = u.id_usuario;
*/
