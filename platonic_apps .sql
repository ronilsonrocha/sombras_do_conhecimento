-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NUlL UNIQUE,
    tipo_usuario VARCHAR(100) NOT NULL -- Diferencia administrador de usuário comum
  );
-- Tabela de perguntas
  CREATE TABLE IF NOT EXISTS perguntas (
    id_perguntas INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    perguntas TEXT,
    dificuldade VARCHAR(100) NOT NULL,
    alternativa_correta VARCHAR NOT NULL -- Armazena a resposta correta para ser compara com a resposta do usuário
  );
-- Tabela de obras/textos
  CREATE TABLE IF NOT EXISTS obras_textos (
    id_texto INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_obra TEXT NOT NULL
  );
-- Tabela de avaliações
  CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pontos_experiencia INT NOT NULL,
    comentarios TEXT 
  );

  CREATE TABLE IF NOT EXISTS pergu_usua (
    id_pergunta INT,
    id_usuario INT,
    resposta_usuario VARCHAR NOT NULL --Armazena a resosta do usuário do frontend
);

CREATE TABLE IF NOT EXISTS pergun_obras (
  id_pergunta INT,
  id_texto INT
);

CREATE TABLE IF NOT EXISTS usua_obra (
  id_usuario INT,
  id_texto INT
);

CREATE TABLE IF NOT EXISTS aval_usua (
  id_avaliacao INT,
  id_usuario INT
);

-- Adicionando as chaves estrangeiras
ALTER TABLE pergu_usua ADD FOREIGN KEY (id_pergunta) REFERENCES perguntas (id_perguntas);
ALTER TABLE pergu_usua ADD FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);
ALTER TABLE pergun_obras ADD FOREIGN KEY (id_pergunta) REFERENCES perguntas (id_perguntas);
ALTER TABLE pergun_obras ADD FOREIGN KEY (id_texto) REFERENCES obras_textos (id_texto);
ALTER TABLE usua_obra ADD FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);
ALTER TABLE usua_obra ADD FOREIGN KEY (id_texto) REFERENCES obras_textos (id_texto);
ALTER TABLE aval_usua ADD FOREIGN KEY (id_avaliacao) REFERENCES avaliacao (id_avaliacao);
ALTER TABLE aval_usua ADD FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario);



