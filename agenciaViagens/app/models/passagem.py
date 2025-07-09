from sqlalchemy import Column, String, Float, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class Passagem(BaseModel):
    __tablename__ = "passagens"
    
    numero = Column(String(20), unique=True, nullable=False)
    valor = Column(Float, nullable=False)
    data = Column(Date, nullable=False)
    
    # Chaves estrangeiras
    passageiro_id = Column(Integer, ForeignKey("passageiros.id"), nullable=False)
    voo_id = Column(Integer, ForeignKey("voos.id"), nullable=False)
    pagamento_id = Column(Integer, ForeignKey("pagamentos.id"), nullable=True)
    
    # Relacionamentos
    passageiro = relationship("Passageiro", back_populates="passagens")
    voo = relationship("Voo", back_populates="passagens")
    pagamento = relationship("Pagamento", back_populates="passagem")
