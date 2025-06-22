from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    senha: str

class Usuario(UsuarioBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True

class PessoaFisicaBase(BaseModel):
    cpf: str
    data_nascimento: date

class PessoaFisicaCreate(PessoaFisicaBase):
    usuario: UsuarioCreate

class PessoaFisica(PessoaFisicaBase):
    id: int
    usuario: Usuario

    class Config:
        from_attributes = True

class PessoaJuridicaBase(BaseModel):
    cnpj: str
    razao_social: str

class PessoaJuridicaCreate(PessoaJuridicaBase):
    usuario: UsuarioCreate

class PessoaJuridica(PessoaJuridicaBase):
    id: int
    usuario: Usuario

    class Config:
        from_attributes = True
