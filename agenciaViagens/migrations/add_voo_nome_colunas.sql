-- Adicionar colunas origem_nome e destino_nome
ALTER TABLE voos
ADD COLUMN origem_nome VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN destino_nome VARCHAR(100) NOT NULL DEFAULT '';

-- Tornar origem_id e destino_id opcionais
ALTER TABLE voos
ALTER COLUMN origem_id DROP NOT NULL,
ALTER COLUMN destino_id DROP NOT NULL;
