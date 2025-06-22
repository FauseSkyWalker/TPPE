from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from ..enums import TipoPassageiro

class PassageiroBase(BaseModel):
    nome: str
    documento: str
    tipo_passageiro: TipoPassageiro

class PassageiroCreate(PassageiroBase):
    pass

class Passageiro(PassageiroBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        from_attributes = True

class AeroportoBase(BaseModel):
    codigo: str
    nome: str
    cidade: str

class AeroportoCreate(AeroportoBase):
    pass

class Aeroporto(AeroportoBase):
    id: int

    class Config:
        from_attributes = True

class VooBase(BaseModel):
    numero: str
    data_partida: datetime
    data_chegada: datetime
    origem_id: int
    destino_id: int

class VooCreate(VooBase):
    pass

class Voo(VooBase):
    id: int
    origem: Aeroporto
    destino: Aeroporto

    class Config:
        from_attributes = True

class PassagemBase(BaseModel):
    numero: str
    valor: float
    data: date
    passageiro_id: int
    voo_id: int

class PassagemCreate(PassagemBase):
    pass

class Passagem(PassagemBase):
    id: int
    passageiro: Passageiro
    voo: Voo
    pagamento_id: Optional[int] = None

    class Config:
        from_attributes = True
