from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories.usuario import UsuarioRepository
from ..schemas import (
    UsuarioCreate,
    PessoaFisicaCreate,
    PessoaJuridicaCreate,
    Usuario,
    PessoaFisica,
    PessoaJuridica,
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UsuarioService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.usuario_repo = UsuarioRepository(session)
        self.pf_repo = PessoaFisicaRepository(session)
        self.pj_repo = PessoaJuridicaRepository(session)

    def _hash_senha(self, senha: str) -> str:
        return pwd_context.hash(senha)

    def _verify_senha(self, senha: str, hashed_senha: str) -> bool:
        return pwd_context.verify(senha, hashed_senha)

    async def criar_pessoa_fisica(
        self, pessoa_fisica: PessoaFisicaCreate
    ) -> PessoaFisica:
        # Verificar se email já existe
        if await self.usuario_repo.get_by_email(pessoa_fisica.usuario.email):
            raise ValueError("Email já cadastrado")

        # Verificar se CPF já existe
        if await self.pf_repo.get_by_cpf(pessoa_fisica.cpf):
            raise ValueError("CPF já cadastrado")

        # Criar usuário
        usuario_data = pessoa_fisica.usuario.model_dump()
        usuario_data["senha"] = self._hash_senha(usuario_data["senha"])
        usuario = await self.usuario_repo.create(usuario_data)

        # Criar pessoa física
        pf_data = pessoa_fisica.model_dump(exclude={"usuario"})
        pf_data["usuario_id"] = usuario.id
        pessoa_fisica = await self.pf_repo.create(pf_data)

        return pessoa_fisica

    async def criar_pessoa_juridica(
        self, pessoa_juridica: PessoaJuridicaCreate
    ) -> PessoaJuridica:
        # Verificar se email já existe
        if await self.usuario_repo.get_by_email(pessoa_juridica.usuario.email):
            raise ValueError("Email já cadastrado")

        # Verificar se CNPJ já existe
        if await self.pj_repo.get_by_cnpj(pessoa_juridica.cnpj):
            raise ValueError("CNPJ já cadastrado")

        # Criar usuário
        usuario_data = pessoa_juridica.usuario.model_dump()
        usuario_data["senha"] = self._hash_senha(usuario_data["senha"])
        usuario = await self.usuario_repo.create(usuario_data)

        # Criar pessoa jurídica
        pj_data = pessoa_juridica.model_dump(exclude={"usuario"})
        pj_data["usuario_id"] = usuario.id
        pessoa_juridica = await self.pj_repo.create(pj_data)

        return pessoa_juridica

    async def autenticar(self, email: str, senha: str) -> Optional[Usuario]:
        usuario = await self.usuario_repo.get_by_email(email)
        if not usuario:
            return None
        if not self._verify_senha(senha, usuario.senha):
            return None
        return usuario
