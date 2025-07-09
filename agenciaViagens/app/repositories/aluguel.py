from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base import BaseRepository
from ..models import Carro, Hotel, AluguelCarro, AluguelHotel


class CarroRepository(BaseRepository[Carro]):
    def __init__(self, session: AsyncSession):
        super().__init__(Carro, session)

    async def get_by_placa(self, placa: str) -> Optional[Carro]:
        query = select(self.model).where(self.model.placa == placa)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()


class HotelRepository(BaseRepository[Hotel]):
    def __init__(self, session: AsyncSession):
        super().__init__(Hotel, session)


class AluguelCarroRepository(BaseRepository[AluguelCarro]):
    def __init__(self, session: AsyncSession):
        super().__init__(AluguelCarro, session)

    async def get_by_carro(self, carro_id: int) -> List[AluguelCarro]:
        query = select(self.model).where(self.model.carro_id == carro_id)
        result = await self.session.execute(query)
        return result.scalars().all()


class AluguelHotelRepository(BaseRepository[AluguelHotel]):
    def __init__(self, session: AsyncSession):
        super().__init__(AluguelHotel, session)

    async def get_by_hotel(self, hotel_id: int) -> List[AluguelHotel]:
        query = select(self.model).where(self.model.hotel_id == hotel_id)
        result = await self.session.execute(query)
        return result.scalars().all()
