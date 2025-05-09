import pytest
from app.services.exemplo_service import ExemploService
from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import Mock

# 1. Teste simples
def test_hello_world():
    service = ExemploService()
    assert service.hello_world() == "Hello, World!"

# 2. Teste com entrada dinâmica
def test_saudacao_com_nome():
    service = ExemploService()
    assert service.saudacao("Fause") == "Olá, Fause!"

# 3. Teste de exceção
def test_saudacao_vazia():
    service = ExemploService()
    with pytest.raises(ValueError):
        service.saudacao("")

# 4. Teste com mock (injeção de dependência simulada)
def test_salvar_mock():
    service = ExemploService()
    repo_mock = Mock()
    repo_mock.salvar.return_value = "salvo"
    resultado = service.salvar_no_banco(repo_mock, "João")
    assert resultado == "salvo"
    repo_mock.salvar.assert_called_once_with("João")

# 5. Teste de integração FastAPI (rota /)
def test_fastapi_hello():
    client = TestClient(app)
    resposta = client.get("/")
    assert resposta.status_code == 200
    assert resposta.json() == {"message": "Hello, World!"}
