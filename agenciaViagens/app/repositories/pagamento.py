from sqlalchemy.ext.asyncio import AsyncSession
from ..models import Pagamento, Boleto, Cartao, Pix
from .base import BaseRepository
from ..enums import TipoPagamento


class PagamentoRepository(BaseRepository[Pagamento]):
    def __init__(self, session: AsyncSession):
        super().__init__(Pagamento, session)

    async def create_pagamento(
        self, tipo: TipoPagamento, dados: dict
    ) -> Union[Boleto, Cartao, Pix]:
        modelo: Type[Union[Boleto, Cartao, Pix]]
        if tipo == TipoPagamento.BOLETO:
            modelo = Boleto
        elif tipo == TipoPagamento.CARTAO:
            modelo = Cartao
        elif tipo == TipoPagamento.PIX:
            modelo = Pix
        else:
            raise ValueError("Tipo de pagamento inválido")

        pagamento = modelo(**dados)
        self.session.add(pagamento)
        await self.session.commit()
        await self.session.refresh(pagamento)
        return pagamento
