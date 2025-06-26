import pytest
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models import Base
import os

# Usar banco de dados de teste
TEST_DATABASE_URL = "postgresql://postgres:postgres@db:5432/postgres_test"

@pytest.fixture(scope="session")
def engine():
    """Criar engine do SQLAlchemy para os testes."""
    return create_engine(TEST_DATABASE_URL)

@pytest.fixture(scope="session")
def async_engine():
    """Criar engine assíncrona do SQLAlchemy para os testes."""
    return create_async_engine(TEST_DATABASE_URL)

@pytest.fixture(autouse=True)
def setup_database(engine):
    """Criar tabelas antes dos testes e remover depois."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
async def session(async_engine):
    """Criar sessão do SQLAlchemy para os testes."""
    async_session = sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    async with async_session() as session:
        yield session
        await session.rollback()
