from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel

class Usuario(BaseModel):
    __tablename__ = "usuarios"

    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha = Column(String(255), nullable=False)

    # Relacionamentos
    pessoa_fisica = relationship("PessoaFisica", back_populates="usuario", uselist=False)
    pessoa_juridica = relationship("PessoaJuridica", back_populates="usuario", uselist=False)

    def __init__(self, **kwargs):
        # Validações manuais (opcional — já são feitas pelos schemas)
        if not kwargs.get('nome'):
            raise ValueError("Nome não pode ser vazio")
        if not kwargs.get('email'):
            raise ValueError("Email não pode ser vazio")
        if not kwargs.get('senha'):
            raise ValueError("Senha não pode ser vazia")
        if '@' not in kwargs['email'] or '.' not in kwargs['email']:
            raise ValueError("Email inválido")

        super().__init__(**kwargs)
