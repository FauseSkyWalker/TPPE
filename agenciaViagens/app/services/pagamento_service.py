from sqlalchemy.ext.asyncio import AsyncSession
from ..models.pagamento import Pagamento, Boleto, Cartao, Pix
from ..repositories.base_repository import BaseRepository
from ..schemas.pagamento import BoletoCreate, CartaoCreate, PixCreate


class PagamentoService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.pagamento_repo = BaseRepository(db, Pagamento)
        self.boleto_repo = BaseRepository(db, Boleto)
        self.cartao_repo = BaseRepository(db, Cartao)
        self.pix_repo = BaseRepository(db, Pix)

    async def criar_pagamento_boleto(self, pagamento: BoletoCreate):
        """Criar um novo pagamento com boleto."""
        db_boleto = Boleto(**pagamento.model_dump())
        await self.boleto_repo.add(db_boleto)
        return db_boleto

    async def criar_pagamento_cartao(self, pagamento: CartaoCreate):
        """Criar um novo pagamento com cartão."""
        db_cartao = Cartao(**pagamento.model_dump())
        await self.cartao_repo.add(db_cartao)
        return db_cartao

    async def criar_pagamento_pix(self, pagamento: PixCreate):
        """Criar um novo pagamento com PIX."""
        db_pix = Pix(**pagamento.model_dump())
        await self.pix_repo.add(db_pix)
        return db_pix

    async def listar_pagamentos(self):
        """Listar todos os pagamentos."""
        return await self.pagamento_repo.get_all()
