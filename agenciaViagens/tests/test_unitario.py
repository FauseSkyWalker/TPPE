import pytest
from datetime import date, datetime, timedelta
from app.models import (
    Usuario, PessoaFisica, PessoaJuridica,
    Passageiro, Voo, Aeroporto, Passagem,
    Pagamento, Boleto, Cartao, Pix,
    Carro, Hotel, AluguelCarro, AluguelHotel
)
from app.enums import TipoPassageiro, TipoPagamento

def test_criar_usuario():
    usuario = Usuario(
        nome="João Silva",
        email="joao@test.com",
        senha="senha123"
    )
    assert usuario.nome == "João Silva"
    assert usuario.email == "joao@test.com"
    assert usuario.senha == "senha123"

def test_criar_pessoa_fisica():
    usuario = Usuario(
        nome="João Silva",
        email="joao@test.com",
        senha="senha123"
    )
    pessoa = PessoaFisica(
        usuario=usuario,
        cpf="12345678900",
        data_nascimento=date(1990, 1, 1)
    )
    assert pessoa.cpf == "12345678900"
    assert pessoa.data_nascimento == date(1990, 1, 1)
    assert pessoa.usuario == usuario

def test_criar_voo():
    origem = Aeroporto(
        codigo="GRU",
        nome="Guarulhos",
        cidade="São Paulo"
    )
    destino = Aeroporto(
        codigo="CGH",
        nome="Congonhas",
        cidade="São Paulo"
    )
    data_partida = datetime.now() + timedelta(days=1)
    data_chegada = data_partida + timedelta(hours=2)
    
    voo = Voo(
        numero="AA123",
        data_partida=data_partida,
        data_chegada=data_chegada,
        origem=origem,
        destino=destino
    )
    assert voo.numero == "AA123"
    assert voo.origem == origem
    assert voo.destino == destino
    assert voo.data_chegada > voo.data_partida

def test_criar_passagem():
    passageiro = Passageiro(
        nome="João Silva",
        documento="12345678900",
        tipo_passageiro=TipoPassageiro.ADULTO
    )
    voo = Voo(
        numero="AA123",
        data_partida=datetime.now(),
        data_chegada=datetime.now() + timedelta(hours=2)
    )
    passagem = Passagem(
        numero="PASS123",
        valor=500.0,
        data=date.today(),
        passageiro=passageiro,
        voo=voo
    )
    assert passagem.numero == "PASS123"
    assert passagem.valor == 500.0
    assert passagem.passageiro == passageiro
    assert passagem.voo == voo

def test_criar_pagamento_boleto():
    boleto = Boleto(
        valor=100.0,
        status="PENDENTE",
        tipo=TipoPagamento.BOLETO,
        codigo_barras="123456789"
    )
    assert boleto.valor == 100.0
    assert boleto.status == "PENDENTE"
    assert boleto.tipo == TipoPagamento.BOLETO
    assert boleto.codigo_barras == "123456789"

def test_criar_aluguel_carro():
    carro = Carro(
        modelo="Gol",
        placa="ABC1234",
        valor_diaria=100.0
    )
    aluguel = AluguelCarro(
        data_inicio=date.today(),
        data_fim=date.today() + timedelta(days=5),
        valor=500.0,
        carro=carro
    )
    assert aluguel.carro == carro
    assert aluguel.valor == 500.0
    assert aluguel.data_fim > aluguel.data_inicio

def test_validacoes():
    # Teste de email inválido
    with pytest.raises(ValueError):
        Usuario(nome="Test", email="invalido", senha="123")

    # Teste de nome vazio
    with pytest.raises(ValueError):
        Usuario(nome="", email="test@test.com", senha="123")

    # Teste de senha vazia
    with pytest.raises(ValueError):
        Usuario(nome="Test", email="test@test.com", senha="")

    # Teste de CPF inválido
    with pytest.raises(ValueError):
        PessoaFisica(
            usuario=Usuario(nome="Test", email="test@test.com", senha="123"),
            cpf="123",
            data_nascimento=date(1990, 1, 1)
        )

    # Teste de data futura
    with pytest.raises(ValueError):
        PessoaFisica(
            usuario=Usuario(nome="Test", email="test@test.com", senha="123"),
            cpf="12345678900",
            data_nascimento=date(2025, 1, 1)
        )
