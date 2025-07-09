from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from passlib.context import CryptContext
from app.models.usuario import Usuario
from app.models.pessoa import PessoaFisica, PessoaJuridica
from app.schemas.usuario import (
    UsuarioCreate,
    UsuarioUpdate,
    PessoaFisicaCreate,
    PessoaFisicaUpdate,
    PessoaJuridicaCreate,
    PessoaJuridicaUpdate,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UsuarioService:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def create_pessoa_fisica(
        self, pessoa_data: PessoaFisicaCreate
    ) -> PessoaFisica:
        usuario = Usuario(
            nome=pessoa_data.usuario.nome,
            email=pessoa_data.usuario.email,
            senha=self._hash_password(pessoa_data.usuario.senha),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        self.session.add(usuario)
        await self.session.flush()

        pessoa = PessoaFisica(
            cpf=pessoa_data.cpf,
            data_nascimento=pessoa_data.data_nascimento,
            usuario_id=usuario.id,
        )
        self.session.add(pessoa)
        await self.session.commit()

        # Recarrega a pessoa com o relacionamento do usuário
        result = await self.session.execute(
            select(PessoaFisica)
            .options(selectinload(PessoaFisica.usuario))
            .where(PessoaFisica.id == pessoa.id)
        )
        return result.scalar_one()

    async def create_pessoa_juridica(
        self, pessoa_data: PessoaJuridicaCreate
    ) -> PessoaJuridica:
        usuario = Usuario(
            nome=pessoa_data.usuario.nome,
            email=pessoa_data.usuario.email,
            senha=self._hash_password(pessoa_data.usuario.senha),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        self.session.add(usuario)
        await self.session.flush()

        pessoa = PessoaJuridica(
            cnpj=pessoa_data.cnpj,
            razao_social=pessoa_data.razao_social,
            usuario_id=usuario.id,
        )
        self.session.add(pessoa)
        await self.session.commit()

        # Recarrega a pessoa com o relacionamento do usuário
        result = await self.session.execute(
            select(PessoaJuridica)
            .options(selectinload(PessoaJuridica.usuario))
            .where(PessoaJuridica.id == pessoa.id)
        )
        return result.scalar_one()

    async def get_usuario_by_email(self, email: str) -> Optional[Usuario]:
        result = await self.session.execute(
            select(Usuario).where(Usuario.email == email)
        )
        usuario = result.scalar_one_or_none()
        if usuario and (usuario.created_at is None or usuario.updated_at is None):
            usuario.created_at = datetime.utcnow()
            usuario.updated_at = datetime.utcnow()
            await self.session.commit()
        return usuario

    async def get_usuario_by_id(self, usuario_id: int) -> Optional[Usuario]:
        result = await self.session.execute(
            select(Usuario).where(Usuario.id == usuario_id)
        )
        usuario = result.scalar_one_or_none()
        if usuario and (usuario.created_at is None or usuario.updated_at is None):
            usuario.created_at = datetime.utcnow()
            usuario.updated_at = datetime.utcnow()
            await self.session.commit()
        return usuario

    async def get_pessoa_fisica_by_cpf(self, cpf: str) -> Optional[PessoaFisica]:
        result = await self.session.execute(
            select(PessoaFisica).where(PessoaFisica.cpf == cpf)
        )
        return result.scalar_one_or_none()

    async def get_pessoa_fisica_by_id(self, pessoa_id: int) -> Optional[PessoaFisica]:
        result = await self.session.execute(
            select(PessoaFisica).where(PessoaFisica.id == pessoa_id)
        )
        return result.scalar_one_or_none()

    async def get_pessoa_juridica_by_cnpj(self, cnpj: str) -> Optional[PessoaJuridica]:
        result = await self.session.execute(
            select(PessoaJuridica).where(PessoaJuridica.cnpj == cnpj)
        )
        return result.scalar_one_or_none()

    async def get_pessoa_juridica_by_id(
        self, pessoa_id: int
    ) -> Optional[PessoaJuridica]:
        result = await self.session.execute(
            select(PessoaJuridica).where(PessoaJuridica.id == pessoa_id)
        )
        return result.scalar_one_or_none()

    async def update_usuario(
        self, usuario_id: int, usuario_data: UsuarioUpdate
    ) -> Optional[Usuario]:
        usuario = await self.get_usuario_by_id(usuario_id)
        if not usuario:
            return None

        update_data = usuario_data.dict(exclude_unset=True)
        if "senha" in update_data:
            update_data["senha"] = self._hash_password(update_data["senha"])

        for key, value in update_data.items():
            setattr(usuario, key, value)

        usuario.updated_at = datetime.utcnow()
        await self.session.commit()
        await self.session.refresh(usuario)
        return usuario

    async def update_pessoa_fisica(
        self, pessoa_id: int, pessoa_data: PessoaFisicaUpdate
    ) -> Optional[PessoaFisica]:
        result = await self.session.execute(
            select(PessoaFisica).where(PessoaFisica.id == pessoa_id)
        )
        pessoa = result.scalar_one_or_none()
        if not pessoa:
            return None

        update_data = pessoa_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(pessoa, key, value)

        await self.session.commit()
        await self.session.refresh(pessoa)
        return pessoa

    async def update_pessoa_juridica(
        self, pessoa_id: int, pessoa_data: PessoaJuridicaUpdate
    ) -> Optional[PessoaJuridica]:
        result = await self.session.execute(
            select(PessoaJuridica).where(PessoaJuridica.id == pessoa_id)
        )
        pessoa = result.scalar_one_or_none()
        if not pessoa:
            return None

        update_data = pessoa_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(pessoa, key, value)

        await self.session.commit()
        await self.session.refresh(pessoa)
        return pessoa

    async def delete_usuario(self, usuario_id: int) -> bool:
        usuario = await self.get_usuario_by_id(usuario_id)
        if not usuario:
            return False

        await self.session.delete(usuario)
        await self.session.commit()
        return True

    async def list_pessoas_fisicas(self) -> List[PessoaFisica]:
        result = await self.session.execute(
            select(PessoaFisica)
            .options(selectinload(PessoaFisica.usuario))
            .join(Usuario)
        )
        return result.scalars().all()

    async def list_pessoas_juridicas(self) -> List[PessoaJuridica]:
        result = await self.session.execute(
            select(PessoaJuridica)
            .options(selectinload(PessoaJuridica.usuario))
            .join(Usuario)
        )
        return result.scalars().all()

    async def search_usuarios(self, search: str) -> List[Usuario]:
        result = await self.session.execute(
            select(Usuario).where(
                or_(
                    Usuario.nome.ilike(f"%{search}%"),
                    Usuario.email.ilike(f"%{search}%"),
                )
            )
        )
        return result.scalars().all()
