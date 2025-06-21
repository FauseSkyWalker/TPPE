from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Aeroporto(BaseModel):
    __tablename__ = "aeroportos"
    
    codigo = Column(String(3), unique=True, nullable=False)
    nome = Column(String(100), nullable=False)
    cidade = Column(String(100), nullable=False)
    
    # Relacionamentos
    voos_origem = relationship("Voo", foreign_keys="[Voo.origem_id]", back_populates="origem")
    voos_destino = relationship("Voo", foreign_keys="[Voo.destino_id]", back_populates="destino")

class Voo(BaseModel):
    __tablename__ = "voos"
    
    numero = Column(String(10), unique=True, nullable=False)
    data_partida = Column(DateTime, nullable=False)
    data_chegada = Column(DateTime, nullable=False)
    
    # Chaves estrangeiras
    origem_id = Column(Integer, ForeignKey("aeroportos.id"), nullable=False)
    destino_id = Column(Integer, ForeignKey("aeroportos.id"), nullable=False)
    
    # Relacionamentos
    origem = relationship("Aeroporto", foreign_keys=[origem_id], back_populates="voos_origem")
    destino = relationship("Aeroporto", foreign_keys=[destino_id], back_populates="voos_destino")
    passagens = relationship("Passagem", back_populates="voo")
