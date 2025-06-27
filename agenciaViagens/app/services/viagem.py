from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories import (
    PassageiroRepository, VooRepository,
    AeroportoRepository, PassagemRepository
)
from ..schemas import (
    PassageiroCreate, VooCreate,
    AeroportoCreate, PassagemCreate
)

class ViagemService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.passageiro_repo = PassageiroRepository(session)
        self.voo_repo = VooRepository(session)
        self.aeroporto_repo = AeroportoRepository(session)
        self.passagem_repo = PassagemRepository(session)

    async def criar_passageiro(self, passageiro: PassageiroCreate):
        # Verificar se já existe passageiro com o mesmo documento
        if await self.passageiro_repo.get_by_documento(passageiro.documento):
            raise ValueError("Documento já cadastrado")
        
        return await self.passageiro_repo.create(passageiro.model_dump())

    async def criar_voo(self, voo: VooCreate):
        # Verificar se aeroportos existem
        origem = await self.aeroporto_repo.get(voo.origem_id)
        if not origem:
            raise ValueError("Aeroporto de origem não encontrado")
        
        destino = await self.aeroporto_repo.get(voo.destino_id)
        if not destino:
            raise ValueError("Aeroporto de destino não encontrado")
        
        # Verificar se número do voo já existe
        if await self.voo_repo.get_by_numero(voo.numero):
            raise ValueError("Número de voo já existe")
        
        # Verificar se data de chegada é posterior à data de partida
        if voo.data_chegada <= voo.data_partida:
            raise ValueError("Data de chegada deve ser posterior à data de partida")
        
        return await self.voo_repo.create(voo.model_dump())

    async def criar_passagem(self, passagem: PassagemCreate):
        # Verificar se passageiro existe
        passageiro = await self.passageiro_repo.get(passagem.passageiro_id)
        if not passageiro:
            raise ValueError("Passageiro não encontrado")
        
        # Verificar se voo existe
        voo = await self.voo_repo.get(passagem.voo_id)
        if not voo:
            raise ValueError("Voo não encontrado")
        
        # Verificar se número da passagem já existe
        if await self.passagem_repo.get_by_numero(passagem.numero):
            raise ValueError("Número de passagem já existe")
        
        # Verificar se a data da passagem é compatível com o voo
        if passagem.data.date() != voo.data_partida.date():
            raise ValueError("Data da passagem deve ser igual à data de partida do voo")
        
        return await self.passagem_repo.create(passagem.model_dump())
