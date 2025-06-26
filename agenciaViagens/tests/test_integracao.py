import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, datetime, timedelta
from app.main import app
from app.models import (
    Usuario, PessoaFisica, Voo, Aeroporto,
    Passageiro, Passagem, Pagamento, Boleto
)
from app.enums import TipoPassageiro, TipoPagamento

client = TestClient(app)

@pytest.mark.asyncio
async def test_fluxo_compra_passagem(session: AsyncSession):
    # 1. Criar usuário e pessoa física
    response = client.post("/api/usuarios/pessoa-fisica", json={
        "usuario": {
            "nome": "João Silva",
            "email": "joao@test.com",
            "senha": "senha123"
        },
        "cpf": "12345678900",
        "data_nascimento": "1990-01-01"
    })
    assert response.status_code == 200
    pessoa_id = response.json()["id"]

    # 2. Criar aeroportos
    origem = Aeroporto(codigo="GRU", nome="Guarulhos", cidade="São Paulo")
    destino = Aeroporto(codigo="CGH", nome="Congonhas", cidade="São Paulo")
    session.add_all([origem, destino])
    await session.commit()

    # 3. Criar voo
    voo = Voo(
        numero="AA123",
        data_partida=datetime.now() + timedelta(days=1),
        data_chegada=datetime.now() + timedelta(days=1, hours=2),
        origem_id=origem.id,
        destino_id=destino.id
    )
    session.add(voo)
    await session.commit()

    # 4. Criar passageiro
    response = client.post("/api/viagens/passageiros", json={
        "nome": "João Silva",
        "documento": "12345678900",
        "tipo_passageiro": "ADULTO"
    })
    assert response.status_code == 200
    passageiro_id = response.json()["id"]

    # 5. Criar passagem
    response = client.post("/api/viagens/passagens", json={
        "numero": "PASS123",
        "valor": 500.0,
        "data": str(date.today()),
        "passageiro_id": passageiro_id,
        "voo_id": voo.id
    })
    assert response.status_code == 200
    passagem_id = response.json()["id"]

    # 6. Criar pagamento
    response = client.post("/api/pagamentos/boleto", json={
        "valor": 500.0,
        "status": "PENDENTE",
        "tipo": "BOLETO",
        "codigo_barras": "123456789"
    })
    assert response.status_code == 200
    
    # Verificar estado final
    passagem = await session.get(Passagem, passagem_id)
    assert passagem is not None
    assert passagem.valor == 500.0
    assert passagem.passageiro_id == passageiro_id
    assert passagem.voo_id == voo.id

@pytest.mark.asyncio
async def test_integracao_pagamento(session: AsyncSession):
    # 1. Criar pagamento
    pagamento = Pagamento(
        valor=100.0,
        status="PENDENTE",
        tipo=TipoPagamento.BOLETO
    )
    session.add(pagamento)
    await session.commit()

    # 2. Criar boleto
    boleto = Boleto(
        pagamento_id=pagamento.id,
        codigo_barras="123456789"
    )
    session.add(boleto)
    await session.commit()

    # 3. Processar pagamento
    response = client.post(f"/api/pagamentos/{pagamento.id}/processar")
    assert response.status_code == 200

    # 4. Verificar status
    pagamento = await session.get(Pagamento, pagamento.id)
    assert pagamento.status == "PAGO"
