from sqlalchemy.ext.asyncio import AsyncSession
from ..models.aluguel import Carro, Hotel, AluguelCarro, AluguelHotel
from ..repositories.base_repository import BaseRepository
from ..schemas.aluguel import (
    CarroCreate,
    HotelCreate,
    AluguelCarroCreate,
    AluguelHotelCreate,
)


class AluguelService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.carro_repo = BaseRepository(db, Carro)
        self.hotel_repo = BaseRepository(db, Hotel)
        self.aluguel_carro_repo = BaseRepository(db, AluguelCarro)
        self.aluguel_hotel_repo = BaseRepository(db, AluguelHotel)

    async def criar_carro(self, carro: CarroCreate):
        """Criar um novo carro."""
        db_carro = Carro(**carro.model_dump())
        await self.carro_repo.add(db_carro)
        return db_carro

    async def criar_hotel(self, hotel: HotelCreate):
        """Criar um novo hotel."""
        db_hotel = Hotel(**hotel.model_dump())
        await self.hotel_repo.add(db_hotel)
        return db_hotel

    async def deletar_carro(self, id: int):
        """Deletar um carro."""
        carro = await self.carro_repo.get(id)
        if not carro:
            raise ValueError("Carro não encontrado")
        await self.carro_repo.delete(id)

    async def deletar_hotel(self, id: int):
        """Deletar um hotel."""
        hotel = await self.hotel_repo.get(id)
        if not hotel:
            raise ValueError("Hotel não encontrado")
        await self.hotel_repo.delete(id)

    async def alugar_carro(self, aluguel: AluguelCarroCreate):
        """Criar um novo aluguel de carro."""
        # Verificar se o carro existe
        carro = await self.carro_repo.get(aluguel.carro_id)
        if not carro:
            raise ValueError("Carro não encontrado")

        # Criar o aluguel
        db_aluguel = AluguelCarro(**aluguel.model_dump())
        await self.aluguel_carro_repo.add(db_aluguel)
        return db_aluguel

    async def alugar_hotel(self, aluguel: AluguelHotelCreate):
        """Criar um novo aluguel de hotel."""
        # Verificar se o hotel existe
        hotel = await self.hotel_repo.get(aluguel.hotel_id)
        if not hotel:
            raise ValueError("Hotel não encontrado")

        # Criar o aluguel
        db_aluguel = AluguelHotel(**aluguel.model_dump())
        await self.aluguel_hotel_repo.add(db_aluguel)
        return db_aluguel
