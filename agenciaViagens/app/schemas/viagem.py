from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional
from datetime import date


class PassageiroBase(BaseModel):
    nome: str
    documento: str
    tipo_passageiro: str


class PassageiroCreate(PassageiroBase):
    pass


class Passageiro(PassageiroBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True, exclude={"created_at", "updated_at"}
    )


class VooBase(BaseModel):
    nome: str
    data_partida: datetime
    data_chegada: datetime

    model_config = ConfigDict(
        json_encoders={datetime: lambda dt: dt.replace(tzinfo=None)}
    )


class VooCreate(VooBase):
    pass


class Voo(BaseModel):
    id: int
    nome: str
    data_partida: datetime
    data_chegada: datetime

    model_config = ConfigDict(
        from_attributes=True, exclude={"created_at", "updated_at"}
    )


class PassagemBase(BaseModel):
    numero: str
    valor: float
    data: datetime
    passageiro_id: int
    voo_id: int


class PassagemCreate(PassagemBase):
    pass


class Passagem(PassagemBase):
    id: int
    pagamento_id: Optional[int] = None

    model_config = ConfigDict(
        from_attributes=True, exclude={"created_at", "updated_at"}
    )
