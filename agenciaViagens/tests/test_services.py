import pytest
from datetime import date, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.services import UsuarioService, ViagemService, PagamentoService, AluguelService
from app.schemas import (
    UsuarioCreate, PessoaFisicaCreate,
    PassageiroCreate, VooCreate, PassagemCreate,
    BoletoCreate, AluguelCarroCreate
)
from app.enums import TipoPassageiro, TipoPagamento

@pytest.mark.asyncio
async def test_criar_pessoa_fisica(session: AsyncSession):
    service = UsuarioService(session)
    usuario = UsuarioCreate(
        nome="João Silva",
        email="joao@example.com",
        senha="senha123"
    )
    pessoa_fisica = PessoaFisicaCreate(
        usuario=usuario,
        cpf="12345678900",
        data_nascimento=date(1990, 1, 1)
    )
    
    result = await service.criar_pessoa_fisica(pessoa_fisica)
    assert result.cpf == "12345678900"
    assert result.usuario.nome == "João Silva"

@pytest.mark.asyncio
async def test_criar_passageiro(session: AsyncSession):
    service = ViagemService(session)
    passageiro = PassageiroCreate(
        nome="João Silva",
        documento="12345678900",
        tipo_passageiro=TipoPassageiro.ADULTO
    )
    
    result = await service.criar_passageiro(passageiro)
    assert result.nome == "João Silva"
    assert result.tipo_passageiro == TipoPassageiro.ADULTO

@pytest.mark.asyncio
async def test_criar_pagamento_boleto(session: AsyncSession):
    service = PagamentoService(session)
    pagamento = BoletoCreate(
        valor=100.0,
        status="PENDENTE",
        tipo=TipoPagamento.BOLETO,
        codigo_barras="123456789"
    )
    
    result = await service.criar_pagamento_boleto(pagamento)
    assert result.valor == 100.0
    assert result.codigo_barras == "123456789"

@pytest.mark.asyncio
async def test_alugar_carro(session: AsyncSession):
    service = AluguelService(session)
    
    # Primeiro criar um carro
    carro = await service.criar_carro({
        "modelo": "Gol",
        "placa": "ABC1234",
        "valor_diaria": 100.0
    })
    
    aluguel = AluguelCarroCreate(
        data_inicio=date.today(),
        data_fim=date.today() + timedelta(days=5),
        valor=500.0,
        carro_id=carro.id
    )
    
    result = await service.alugar_carro(aluguel)
    assert result.valor == 500.0
    assert result.carro_id == carro.id
