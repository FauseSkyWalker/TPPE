from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# Base compartilhado
class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


# Criação
class UsuarioCreate(UsuarioBase):
    senha: str = Field(..., min_length=6)


# Atualização parcial
class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    senha: Optional[str] = Field(None, min_length=6)

    model_config = ConfigDict(from_attributes=True)


# Retorno completo
class Usuario(BaseModel):
    id: int
    nome: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True, exclude={"created_at", "updated_at"}
    )


# ------------------ Pessoa Física ------------------ #
class PessoaFisicaBase(BaseModel):
    cpf: str = Field(..., pattern=r"^\d{11}$")
    data_nascimento: date

    model_config = ConfigDict(from_attributes=True)


class PessoaFisicaCreate(PessoaFisicaBase):
    usuario: UsuarioCreate

    model_config = ConfigDict(from_attributes=True)


class PessoaFisicaUpdate(BaseModel):
    cpf: Optional[str] = Field(None, pattern=r"^\d{11}$")
    data_nascimento: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)


class PessoaFisica(BaseModel):
    id: int
    cpf: str
    data_nascimento: date
    usuario_id: int
    usuario: Usuario

    model_config = ConfigDict(from_attributes=True)


# ------------------ Pessoa Jurídica ------------------ #
class PessoaJuridicaBase(BaseModel):
    cnpj: str = Field(..., pattern=r"^\d{14}$")
    razao_social: str

    model_config = ConfigDict(from_attributes=True)


class PessoaJuridicaCreate(PessoaJuridicaBase):
    usuario: UsuarioCreate

    model_config = ConfigDict(from_attributes=True)


class PessoaJuridicaUpdate(BaseModel):
    cnpj: Optional[str] = Field(None, pattern=r"^\d{14}$")
    razao_social: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PessoaJuridica(BaseModel):
    id: int
    cnpj: str
    razao_social: str
    usuario_id: int
    usuario: Usuario

    model_config = ConfigDict(from_attributes=True)
