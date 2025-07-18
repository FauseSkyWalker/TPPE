from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.viagem import (
    PassageiroRepository,
    VooRepository,
    PassagemRepository,
)
from ..schemas import PassageiroCreate, VooCreate, PassagemCreate


class ViagemService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.passageiro_repo = PassageiroRepository(session)
        self.voo_repo = VooRepository(session)
        self.passagem_repo = PassagemRepository(session)

    async def criar_passageiro(self, passageiro: PassageiroCreate):
        # Verificar se já existe passageiro com o mesmo documento
        if await self.passageiro_repo.get_by_documento(passageiro.documento):
            raise ValueError("Documento já cadastrado")

        return await self.passageiro_repo.create(passageiro.model_dump())

    async def criar_voo(self, voo: VooCreate):
        # Verificar se data de chegada é posterior à data de partida
        if voo.data_chegada <= voo.data_partida:
            raise ValueError("Data de chegada deve ser posterior à data de partida")

        voo_data = voo.model_dump()
        voo_data["data_partida"] = voo_data["data_partida"].replace(tzinfo=None)
        voo_data["data_chegada"] = voo_data["data_chegada"].replace(tzinfo=None)
        return await self.voo_repo.create(voo_data)

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
        if passagem.data.replace(tzinfo=None).date() != voo.data_partida.date():
            raise ValueError("Data da passagem deve ser igual à data de partida do voo")

        return await self.passagem_repo.create(passagem.model_dump())

    async def excluir_voo(self, voo_id: int):
        voo = await self.voo_repo.get(voo_id)
        if not voo:
            raise ValueError("Voo não encontrado")

        passagens = await self.passagem_repo.get_by_voo(voo_id)
        if passagens:
            raise ValueError("Não é possível excluir um voo que possui passagens")

        await self.voo_repo.delete(voo_id)
