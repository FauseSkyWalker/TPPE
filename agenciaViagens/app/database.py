from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

from .models import Base

DATABASE_URL = os.getenv("DATABASE_URL")

# Criar engine síncrona para criação de tabelas
engine = create_engine(DATABASE_URL)

# Criar engine assíncrona para operações
async_engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    """Dependency para injetar a sessão do banco nos endpoints."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def create_tables():
    """Criar todas as tabelas no banco de dados."""
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """Remover todas as tabelas do banco de dados."""
    Base.metadata.drop_all(bind=engine)
