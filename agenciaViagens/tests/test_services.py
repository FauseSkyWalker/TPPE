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
