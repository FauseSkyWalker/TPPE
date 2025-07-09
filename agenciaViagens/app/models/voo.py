from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from .base import BaseModel


class Voo(BaseModel):
    __tablename__ = "voos"

    nome = Column(String(100), nullable=False)
    data_partida = Column(DateTime(timezone=False), nullable=False)
    data_chegada = Column(DateTime(timezone=False), nullable=False)

    # Relacionamentos
    passagens = relationship("Passagem", back_populates="voo")
