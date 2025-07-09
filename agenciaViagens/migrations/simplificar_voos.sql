-- Remover tabela de aeroportos
DROP TABLE IF EXISTS aeroportos CASCADE;

-- Remover colunas antigas e adicionar nova coluna
ALTER TABLE voos
DROP COLUMN IF EXISTS origem_id CASCADE,
DROP COLUMN IF EXISTS destino_id CASCADE,
DROP COLUMN IF EXISTS origem_nome CASCADE,
DROP COLUMN IF EXISTS destino_nome CASCADE,
DROP COLUMN IF EXISTS numero CASCADE;

-- Adicionar nova coluna
ALTER TABLE voos
ADD COLUMN IF NOT EXISTS nome VARCHAR(100) NOT NULL DEFAULT '';
