import pytest
from app.models import Usuario, PessoaFisica, Passageiro
from app.enums import TipoPassageiro
from app.services.passageiro_service import calcular_valor_passagem
from datetime import date, timedelta

@pytest.mark.parametrize("nome,email,senha,esperado", [
    ("João Silva", "joao@email.com", "senha123", True),
    ("", "email@test.com", "senha123", False),  # nome vazio
    ("Maria", "", "senha123", False),  # email vazio
    ("José", "email@invalido", "senha123", False),  # email inválido
    ("Ana", "ana@email.com", "", False),  # senha vazia
])
def test_validacao_usuario(nome, email, senha, esperado):
    try:
        usuario = Usuario(nome=nome, email=email, senha=senha)
        assert esperado is True
    except ValueError:
        assert esperado is False

@pytest.mark.parametrize("cpf,data_nascimento,esperado", [
    ("12345678900", date(1990, 1, 1), True),
    ("123456789", date(1990, 1, 1), False),  # CPF curto
    ("1234567890a", date(1990, 1, 1), False),  # CPF com letra
    ("12345678900", date.today() + timedelta(days=1), False),  # Data futura
])
def test_validacao_pessoa_fisica(cpf, data_nascimento, esperado):
    try:
        pessoa = PessoaFisica(
            usuario=Usuario(nome="Test", email="test@test.com", senha="123"),
            cpf=cpf,
            data_nascimento=data_nascimento
        )
        assert esperado is True
    except ValueError:
        assert esperado is False

@pytest.mark.parametrize("tipo_passageiro,valor_esperado", [
    (TipoPassageiro.ADULTO, 1.0),  # Preço normal
    (TipoPassageiro.CRIANCA, 0.5),  # 50% desconto
    (TipoPassageiro.IDOSO, 0.8),    # 20% desconto
])
def test_calculo_valor_passagem(tipo_passageiro, valor_esperado):
    passageiro = Passageiro(
        nome="Test",
        documento="123",
        tipo_passageiro=tipo_passageiro
    )
    valor_base = 100.0
    assert calcular_valor_passagem(passageiro, valor_base) == valor_base * valor_esperado
