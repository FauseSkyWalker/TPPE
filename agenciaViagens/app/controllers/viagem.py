from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from ..services import ViagemService
from ..schemas import (
    PassageiroCreate, PassageiroCreate, Passageiro,
    VooCreate, Voo,

    PassagemCreate, Passagem
)

router = APIRouter(
    prefix="/api/viagens",
    tags=["viagens"],
    responses={
        401: {"description": "Não autorizado"},
        403: {"description": "Acesso proibido"},
        404: {"description": "Recurso não encontrado"},
        500: {"description": "Erro interno do servidor"}
    }
)

@router.post("/passageiros", response_model=Passageiro)
async def criar_passageiro(
    passageiro: PassageiroCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ViagemService(db)
        return await service.criar_passageiro(passageiro)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/passageiros", response_model=List[Passageiro])
async def listar_passageiros(db: AsyncSession = Depends(get_db)):
    service = ViagemService(db)
    return await service.passageiro_repo.get_all()

@router.post("/voos", response_model=Voo)
async def criar_voo(
    voo: VooCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ViagemService(db)
        return await service.criar_voo(voo)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/voos", response_model=List[Voo])
async def listar_voos(db: AsyncSession = Depends(get_db)):
    service = ViagemService(db)
    return await service.voo_repo.get_all()

@router.post("/passagens", response_model=Passagem)
async def criar_passagem(
    passagem: PassagemCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ViagemService(db)
        return await service.criar_passagem(passagem)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/passagens", response_model=List[Passagem])
async def listar_passagens(db: AsyncSession = Depends(get_db)):
    service = ViagemService(db)
    return await service.passagem_repo.get_all()
