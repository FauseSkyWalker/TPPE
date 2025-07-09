import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env.test
load_dotenv(".env.test")

# Usar banco de dados de teste
TEST_DATABASE_URL = os.getenv("DATABASE_URL")


@pytest.fixture(scope="session")
def engine():
    """Criar engine do SQLAlchemy para os testes."""
    return create_async_engine(TEST_DATABASE_URL)


@pytest.fixture(autouse=True)
async def setup_database(engine):
    """Criar tabelas antes dos testes e remover depois."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def session(engine):
    """Criar sessão do SQLAlchemy para os testes."""
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
        await session.rollback()
