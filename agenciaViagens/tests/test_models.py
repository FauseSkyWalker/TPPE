from datetime import date, datetime, timedelta
from app.models import (
    Usuario,
    PessoaFisica,
    Voo,
    Passageiro,
    Boleto,
    Carro,
    AluguelCarro,
)
from app.enums import TipoPassageiro, TipoPagamento


def test_usuario_model():
    usuario = Usuario(nome="João Silva", email="joao@example.com", senha="senha123")
    assert usuario.nome == "João Silva"
    assert usuario.email == "joao@example.com"
    assert usuario.senha == "senha123"


def test_pessoa_fisica_model():
    usuario = Usuario(nome="João Silva", email="joao@example.com", senha="senha123")
    pessoa_fisica = PessoaFisica(
        usuario=usuario, cpf="12345678900", data_nascimento=date(1990, 1, 1)
    )
    assert pessoa_fisica.cpf == "12345678900"
    assert pessoa_fisica.data_nascimento == date(1990, 1, 1)
    assert pessoa_fisica.usuario == usuario


def test_passageiro_model():
    passageiro = Passageiro(
        nome="João Silva",
        documento="12345678900",
        tipo_passageiro=TipoPassageiro.ADULTO,
    )
    assert passageiro.nome == "João Silva"
    assert passageiro.documento == "12345678900"
    assert passageiro.tipo_passageiro == TipoPassageiro.ADULTO


def test_voo_model():
    now = datetime.now()
    voo = Voo(nome="AA123", data_partida=now, data_chegada=now + timedelta(hours=2))
    assert voo.nome == "AA123"
    assert voo.data_partida == now
    assert voo.data_chegada == now + timedelta(hours=2)


def test_pagamento_boleto_model():
    boleto = Boleto(
        valor=100.0,
        status="PENDENTE",
        tipo=TipoPagamento.BOLETO,
        codigo_barras="123456789",
    )
    assert boleto.valor == 100.0
    assert boleto.status == "PENDENTE"
    assert boleto.tipo == TipoPagamento.BOLETO
    assert boleto.codigo_barras == "123456789"


def test_aluguel_carro_model():
    carro = Carro(modelo="Gol", placa="ABC1234", valor_diaria=100.0)
    aluguel = AluguelCarro(
        data_inicio=date.today(),
        data_fim=date.today() + timedelta(days=5),
        valor=500.0,
        carro=carro,
    )
    assert aluguel.carro == carro
    assert aluguel.valor == 500.0
