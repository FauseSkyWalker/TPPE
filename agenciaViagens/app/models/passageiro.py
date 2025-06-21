from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel
from ..enums import TipoPassageiro

class Passageiro(BaseModel):
    __tablename__ = "passageiros"
    
    nome = Column(String(100), nullable=False)
    documento = Column(String(20), nullable=False)
    tipo_passageiro = Column(Enum(TipoPassageiro), nullable=False)
    
    # Relacionamentos
    passagens = relationship("Passagem", back_populates="passageiro")
