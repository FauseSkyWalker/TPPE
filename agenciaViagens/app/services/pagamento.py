from sqlalchemy.ext.asyncio import AsyncSession
from ..repositories import PagamentoRepository
from ..schemas import BoletoCreate, CartaoCreate, PixCreate
from ..enums import TipoPagamento

class PagamentoService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.pagamento_repo = PagamentoRepository(session)

    async def criar_pagamento_boleto(self, pagamento: BoletoCreate):
        return await self.pagamento_repo.create_pagamento(
            TipoPagamento.BOLETO,
            pagamento.model_dump()
        )

    async def criar_pagamento_cartao(self, pagamento: CartaoCreate):
        return await self.pagamento_repo.create_pagamento(
            TipoPagamento.CARTAO,
            pagamento.model_dump()
        )

    async def criar_pagamento_pix(self, pagamento: PixCreate):
        return await self.pagamento_repo.create_pagamento(
            TipoPagamento.PIX,
            pagamento.model_dump()
        )
