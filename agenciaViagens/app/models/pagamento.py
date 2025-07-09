from sqlalchemy import Column, Float, String, Enum, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel
from ..enums import TipoPagamento

class Pagamento(BaseModel):
    __tablename__ = "pagamentos"
    
    valor = Column(Float, nullable=False)
    status = Column(String(20), nullable=False)
    tipo = Column(Enum(TipoPagamento), nullable=False)
    
    # Relacionamentos
    passagem = relationship("Passagem", back_populates="pagamento", uselist=False)
    aluguel_carro = relationship("AluguelCarro", back_populates="pagamento", uselist=False)
    aluguel_hotel = relationship("AluguelHotel", back_populates="pagamento", uselist=False)
    
    __mapper_args__ = {
        'polymorphic_on': tipo,
        'polymorphic_identity': None
    }

class Boleto(Pagamento):
    __tablename__ = "boletos"
    
    id = Column(Integer, ForeignKey("pagamentos.id"), primary_key=True)
    codigo_barras = Column(String(48), nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': TipoPagamento.BOLETO,
        'inherit_condition': id == Pagamento.id
    }

class Cartao(Pagamento):
    __tablename__ = "cartoes"
    
    id = Column(Integer, ForeignKey("pagamentos.id"), primary_key=True)
    numero = Column(String(16), nullable=False)
    validade = Column(String(7), nullable=False)
    cvv = Column(String(3), nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': TipoPagamento.CARTAO,
        'inherit_condition': id == Pagamento.id
    }

class Pix(Pagamento):
    __tablename__ = "pix"
    
    id = Column(Integer, ForeignKey("pagamentos.id"), primary_key=True)
    chave = Column(String(100), nullable=False)
    
    __mapper_args__ = {
        'polymorphic_identity': TipoPagamento.PIX,
        'inherit_condition': id == Pagamento.id
    }
