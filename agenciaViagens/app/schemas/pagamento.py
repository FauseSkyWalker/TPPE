from pydantic import BaseModel
from ..enums import TipoPagamento


class PagamentoBase(BaseModel):
    valor: float
    status: str
    tipo: TipoPagamento


class BoletoCreate(PagamentoBase):
    codigo_barras: str


class CartaoCreate(PagamentoBase):
    numero: str
    validade: str
    cvv: str


class PixCreate(PagamentoBase):
    chave: str


class Pagamento(PagamentoBase):
    id: int

    class Config:
        from_attributes = True


class Boleto(Pagamento):
    codigo_barras: str


class Cartao(Pagamento):
    numero: str
    validade: str
    cvv: str


class Pix(Pagamento):
    chave: str
