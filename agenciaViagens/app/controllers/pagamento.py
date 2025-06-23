from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..services import PagamentoService
from ..schemas import (
    BoletoCreate, CartaoCreate, PixCreate,
    Pagamento, Boleto, Cartao, Pix
)

router = APIRouter()

@router.post("/pagamentos/boleto", response_model=Boleto)
async def criar_pagamento_boleto(
    pagamento: BoletoCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = PagamentoService(db)
        return await service.criar_pagamento_boleto(pagamento)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/pagamentos/cartao", response_model=Cartao)
async def criar_pagamento_cartao(
    pagamento: CartaoCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = PagamentoService(db)
        return await service.criar_pagamento_cartao(pagamento)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/pagamentos/pix", response_model=Pix)
async def criar_pagamento_pix(
    pagamento: PixCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = PagamentoService(db)
        return await service.criar_pagamento_pix(pagamento)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
