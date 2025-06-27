from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base import BaseRepository
from ..models import Passageiro, Voo, Aeroporto, Passagem

class PassageiroRepository(BaseRepository[Passageiro]):
    def __init__(self, session: AsyncSession):
        super().__init__(Passageiro, session)

    async def get_by_documento(self, documento: str) -> Optional[Passageiro]:
        query = select(self.model).where(self.model.documento == documento)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class VooRepository(BaseRepository[Voo]):
    def __init__(self, session: AsyncSession):
        super().__init__(Voo, session)

    async def get_by_numero(self, numero: str) -> Optional[Voo]:
        query = select(self.model).where(self.model.numero == numero)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class AeroportoRepository(BaseRepository[Aeroporto]):
    def __init__(self, session: AsyncSession):
        super().__init__(Aeroporto, session)

    async def get_by_codigo(self, codigo: str) -> Optional[Aeroporto]:
        query = select(self.model).where(self.model.codigo == codigo)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class PassagemRepository(BaseRepository[Passagem]):
    def __init__(self, session: AsyncSession):
        super().__init__(Passagem, session)

    async def get_by_numero(self, numero: str) -> Optional[Passagem]:
        query = select(self.model).where(self.model.numero == numero)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_passageiro(self, passageiro_id: int) -> List[Passagem]:
        query = select(self.model).where(self.model.passageiro_id == passageiro_id)
        result = await self.session.execute(query)
        return result.scalars().all()
