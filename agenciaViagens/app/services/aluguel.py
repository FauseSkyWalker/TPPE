from datetime import date
import re
from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories import (
    CarroRepository, HotelRepository,
    AluguelCarroRepository, AluguelHotelRepository
)
from ..schemas import (
    CarroCreate, HotelCreate,
    AluguelCarroCreate, AluguelHotelCreate
)

class AluguelService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.carro_repo = CarroRepository(session)
        self.hotel_repo = HotelRepository(session)
        self.aluguel_carro_repo = AluguelCarroRepository(session)
        self.aluguel_hotel_repo = AluguelHotelRepository(session)

    async def criar_carro(self, carro: CarroCreate):
        # Validar formato da placa
        placa = carro.placa.upper()
        if not re.match(r'^[A-Z0-9]{7}$', placa):
            raise ValueError("Placa deve ter exatamente 7 caracteres (letras maiúsculas e números)")

        # Verificar se placa já existe
        if await self.carro_repo.get_by_placa(placa):
            raise ValueError("Placa já cadastrada")
        
        # Converter placa para maiúsculo
        carro_dict = carro.model_dump()
        carro_dict['placa'] = placa
        return await self.carro_repo.create(carro_dict)

    async def criar_hotel(self, hotel: HotelCreate):
        return await self.hotel_repo.create(hotel.model_dump())

    async def deletar_carro(self, id: int):
        # Verificar se carro existe
        carro = await self.carro_repo.get(id)
        if not carro:
            raise ValueError("Carro não encontrado")

        # Verificar se carro tem aluguéis
        alugueis = await self.aluguel_carro_repo.get_by_carro(id)
        if alugueis:
            raise ValueError("Não é possível deletar um carro que possui aluguéis")

        # Deletar carro
        await self.carro_repo.delete(id)

    async def deletar_hotel(self, id: int):
        # Verificar se hotel existe
        hotel = await self.hotel_repo.get(id)
        if not hotel:
            raise ValueError("Hotel não encontrado")

        # Verificar se hotel tem aluguéis
        alugueis = await self.aluguel_hotel_repo.get_by_hotel(id)
        if alugueis:
            raise ValueError("Não é possível deletar um hotel que possui aluguéis")

        # Deletar hotel
        await self.hotel_repo.delete(id)

    async def alugar_carro(self, aluguel: AluguelCarroCreate):
        # Verificar se carro existe
        carro = await self.carro_repo.get(aluguel.carro_id)
        if not carro:
            raise ValueError("Carro não encontrado")
        
        # Verificar se datas são válidas
        if aluguel.data_fim <= aluguel.data_inicio:
            raise ValueError("Data de fim deve ser posterior à data de início")
        
        # Verificar disponibilidade do carro
        alugueis = await self.aluguel_carro_repo.get_by_carro(aluguel.carro_id)
        for aluguel_existente in alugueis:
            if (aluguel.data_inicio <= aluguel_existente.data_fim and
                aluguel.data_fim >= aluguel_existente.data_inicio):
                raise ValueError("Carro não disponível neste período")
        
        return await self.aluguel_carro_repo.create(aluguel.model_dump())

    async def alugar_hotel(self, aluguel: AluguelHotelCreate):
        # Verificar se hotel existe
        hotel = await self.hotel_repo.get(aluguel.hotel_id)
        if not hotel:
            raise ValueError("Hotel não encontrado")
        
        # Verificar se datas são válidas
        if aluguel.data_checkout <= aluguel.data_checkin:
            raise ValueError("Data de checkout deve ser posterior à data de checkin")
        
        return await self.aluguel_hotel_repo.create(aluguel.model_dump())
