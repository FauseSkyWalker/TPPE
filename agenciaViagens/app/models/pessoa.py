from datetime import date
from sqlalchemy import Column, String, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel


class PessoaFisica(BaseModel):
    __tablename__ = "pessoas_fisicas"

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    cpf = Column(String(11), unique=True, nullable=False)
    data_nascimento = Column(Date, nullable=False)

    # Relacionamento
    usuario = relationship("Usuario", back_populates="pessoa_fisica", lazy="joined")

    def __init__(self, **kwargs):
        cpf = kwargs.get("cpf")
        data_nascimento = kwargs.get("data_nascimento")

        if not cpf or len(cpf) != 11 or not cpf.isdigit():
            raise ValueError("CPF inválido")
        if not data_nascimento:
            raise ValueError("Data de nascimento não pode ser vazia")
        if isinstance(data_nascimento, date) and data_nascimento > date.today():
            raise ValueError("Data de nascimento não pode ser futura")

        super().__init__(**kwargs)


class PessoaJuridica(BaseModel):
    __tablename__ = "pessoas_juridicas"

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    cnpj = Column(String(14), unique=True, nullable=False)
    razao_social = Column(String(200), nullable=False)

    # Relacionamento
    usuario = relationship("Usuario", back_populates="pessoa_juridica", lazy="joined")

    def __init__(self, **kwargs):
        cnpj = kwargs.get("cnpj")
        if not cnpj or len(cnpj) != 14 or not cnpj.isdigit():
            raise ValueError("CNPJ inválido")
        if not kwargs.get("razao_social"):
            raise ValueError("Razão social não pode ser vazia")
        super().__init__(**kwargs)
