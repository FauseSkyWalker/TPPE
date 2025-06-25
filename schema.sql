-- Criação das tabelas
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pessoas_fisicas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    cpf VARCHAR(11) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pessoas_juridicas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passageiros (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    tipo_passageiro VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aeroportos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(3) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voos (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    data_partida TIMESTAMP NOT NULL,
    data_chegada TIMESTAMP NOT NULL,
    origem_id INTEGER NOT NULL REFERENCES aeroportos(id),
    destino_id INTEGER NOT NULL REFERENCES aeroportos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (data_chegada > data_partida)
);

CREATE TABLE pagamentos (
    id SERIAL PRIMARY KEY,
    valor DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passagens (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(20) UNIQUE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    passageiro_id INTEGER NOT NULL REFERENCES passageiros(id),
    voo_id INTEGER NOT NULL REFERENCES voos(id),
    pagamento_id INTEGER REFERENCES pagamentos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE boletos (
    id SERIAL PRIMARY KEY,
    pagamento_id INTEGER NOT NULL REFERENCES pagamentos(id),
    codigo_barras VARCHAR(48) UNIQUE NOT NULL
);

CREATE TABLE cartoes (
    id SERIAL PRIMARY KEY,
    pagamento_id INTEGER NOT NULL REFERENCES pagamentos(id),
    numero VARCHAR(16) NOT NULL,
    validade VARCHAR(7) NOT NULL,
    cvv VARCHAR(3) NOT NULL
);

CREATE TABLE pix (
    id SERIAL PRIMARY KEY,
    pagamento_id INTEGER NOT NULL REFERENCES pagamentos(id),
    chave VARCHAR(100) NOT NULL
);

CREATE TABLE carros (
    id SERIAL PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    placa VARCHAR(7) UNIQUE NOT NULL,
    valor_diaria DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hoteis (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    valor_diaria DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alugueis_carros (
    id SERIAL PRIMARY KEY,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    carro_id INTEGER NOT NULL REFERENCES carros(id),
    pagamento_id INTEGER REFERENCES pagamentos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (data_fim >= data_inicio)
);

CREATE TABLE alugueis_hoteis (
    id SERIAL PRIMARY KEY,
    data_checkin DATE NOT NULL,
    data_checkout DATE NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    hotel_id INTEGER NOT NULL REFERENCES hoteis(id),
    pagamento_id INTEGER REFERENCES pagamentos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (data_checkout >= data_checkin)
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_pessoas_fisicas_cpf ON pessoas_fisicas(cpf);
CREATE INDEX idx_pessoas_juridicas_cnpj ON pessoas_juridicas(cnpj);
CREATE INDEX idx_voos_datas ON voos(data_partida, data_chegada);
CREATE INDEX idx_passagens_numero ON passagens(numero);
CREATE INDEX idx_carros_placa ON carros(placa);

-- Triggers para atualização do updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pessoas_fisicas_updated_at
    BEFORE UPDATE ON pessoas_fisicas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ... (triggers similares para as outras tabelas)
