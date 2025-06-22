from pydantic import BaseModel
from datetime import date
from typing import Optional

class CarroBase(BaseModel):
    modelo: str
    placa: str
    valor_diaria: float

class CarroCreate(CarroBase):
    pass

class Carro(CarroBase):
    id: int

    class Config:
        from_attributes = True

class HotelBase(BaseModel):
    nome: str
    endereco: str
    valor_diaria: float

class HotelCreate(HotelBase):
    pass

class Hotel(HotelBase):
    id: int

    class Config:
        from_attributes = True

class AluguelCarroBase(BaseModel):
    data_inicio: date
    data_fim: date
    valor: float
    carro_id: int

class AluguelCarroCreate(AluguelCarroBase):
    pass

class AluguelCarro(AluguelCarroBase):
    id: int
    carro: Carro
    pagamento_id: Optional[int] = None

    class Config:
        from_attributes = True

class AluguelHotelBase(BaseModel):
    data_checkin: date
    data_checkout: date
    valor: float
    hotel_id: int

class AluguelHotelCreate(AluguelHotelBase):
    pass

class AluguelHotel(AluguelHotelBase):
    id: int
    hotel: Hotel
    pagamento_id: Optional[int] = None

    class Config:
        from_attributes = True
