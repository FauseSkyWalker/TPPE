from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .base import BaseRepository
from ..models import Usuario, PessoaFisica, PessoaJuridica


class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: AsyncSession):
        super().__init__(Usuario, session)

    async def get_by_email(self, email: str) -> Optional[Usuario]:
        query = select(self.model).where(self.model.email == email)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()


class PessoaFisicaRepository(BaseRepository[PessoaFisica]):
    def __init__(self, session: AsyncSession):
        super().__init__(PessoaFisica, session)

    async def get_by_cpf(self, cpf: str) -> Optional[PessoaFisica]:
        query = select(self.model).where(self.model.cpf == cpf)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()


class PessoaJuridicaRepository(BaseRepository[PessoaJuridica]):
    def __init__(self, session: AsyncSession):
        super().__init__(PessoaJuridica, session)

    async def get_by_cnpj(self, cnpj: str) -> Optional[PessoaJuridica]:
        query = select(self.model).where(self.model.cnpj == cnpj)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
