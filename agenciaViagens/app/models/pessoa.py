from sqlalchemy import Column, String, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class PessoaFisica(BaseModel):
    __tablename__ = "pessoas_fisicas"
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True)
    cpf = Column(String(11), unique=True, nullable=False)
    data_nascimento = Column(Date, nullable=False)
    
    # Relacionamento
    usuario = relationship("Usuario", back_populates="pessoa_fisica")

class PessoaJuridica(BaseModel):
    __tablename__ = "pessoas_juridicas"
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), unique=True)
    cnpj = Column(String(14), unique=True, nullable=False)
    razao_social = Column(String(200), nullable=False)
    
    # Relacionamento
    usuario = relationship("Usuario", back_populates="pessoa_juridica")
