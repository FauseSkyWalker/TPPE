from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os

from .models import Base

DATABASE_URL = os.getenv("DATABASE_URL")

# Criar engine assíncrona
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(
    bind=engine,
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

async def create_tables():
    """Criar todas as tabelas no banco de dados."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def drop_tables():
    """Remover todas as tabelas do banco de dados."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
