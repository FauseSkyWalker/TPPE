from sqlalchemy import Column, String, Float, Date, ForeignKey, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel


class Carro(BaseModel):
    __tablename__ = "carros"

    modelo = Column(String(100), nullable=False)
    placa = Column(String(7), unique=True, nullable=False)
    valor_diaria = Column(Float, nullable=False)

    # Relacionamentos
    alugueis = relationship("AluguelCarro", back_populates="carro")


class Hotel(BaseModel):
    __tablename__ = "hoteis"

    nome = Column(String(100), nullable=False)
    endereco = Column(String(200), nullable=False)
    valor_diaria = Column(Float, nullable=False)

    # Relacionamentos
    alugueis = relationship("AluguelHotel", back_populates="hotel")


class AluguelCarro(BaseModel):
    __tablename__ = "alugueis_carros"

    data_inicio = Column(Date, nullable=False)
    data_fim = Column(Date, nullable=False)
    valor = Column(Float, nullable=False)

    # Chaves estrangeiras
    carro_id = Column(Integer, ForeignKey("carros.id"), nullable=False)
    pagamento_id = Column(Integer, ForeignKey("pagamentos.id"), nullable=True)

    # Relacionamentos
    carro = relationship("Carro", back_populates="alugueis")
    pagamento = relationship("Pagamento", back_populates="aluguel_carro")


class AluguelHotel(BaseModel):
    __tablename__ = "alugueis_hoteis"

    data_checkin = Column(Date, nullable=False)
    data_checkout = Column(Date, nullable=False)
    valor = Column(Float, nullable=False)

    # Chaves estrangeiras
    hotel_id = Column(Integer, ForeignKey("hoteis.id"), nullable=False)
    pagamento_id = Column(Integer, ForeignKey("pagamentos.id"), nullable=True)

    # Relacionamentos
    hotel = relationship("Hotel", back_populates="alugueis")
    pagamento = relationship("Pagamento", back_populates="aluguel_hotel")
