from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..database import get_db
from ..services import AluguelService
from ..schemas import (
    CarroCreate,
    Carro,
    HotelCreate,
    Hotel,
    AluguelCarroCreate,
    AluguelCarro,
    AluguelHotelCreate,
    AluguelHotel,
)

router = APIRouter(
    prefix="/api/alugueis",
    tags=["alugueis"],
    responses={
        401: {"description": "Não autorizado"},
        403: {"description": "Acesso proibido"},
        404: {"description": "Recurso não encontrado"},
        500: {"description": "Erro interno do servidor"},
    },
)


@router.post("/carros", response_model=Carro)
async def criar_carro(carro: CarroCreate, db: AsyncSession = Depends(get_db)):
    try:
        service = AluguelService(db)
        return await service.criar_carro(carro)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/carros", response_model=List[Carro])
async def listar_carros(db: AsyncSession = Depends(get_db)):
    service = AluguelService(db)
    return await service.carro_repo.get_all()


@router.post("/hoteis", response_model=Hotel)
async def criar_hotel(hotel: HotelCreate, db: AsyncSession = Depends(get_db)):
    try:
        service = AluguelService(db)
        return await service.criar_hotel(hotel)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/hoteis", response_model=List[Hotel])
async def listar_hoteis(db: AsyncSession = Depends(get_db)):
    service = AluguelService(db)
    return await service.hotel_repo.get_all()


@router.delete("/carros/{id}")
async def deletar_carro(id: int, db: AsyncSession = Depends(get_db)):
    try:
        service = AluguelService(db)
        await service.deletar_carro(id)
        return {"message": "Carro deletado com sucesso"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/hoteis/{id}")
async def deletar_hotel(id: int, db: AsyncSession = Depends(get_db)):
    try:
        service = AluguelService(db)
        await service.deletar_hotel(id)
        return {"message": "Hotel deletado com sucesso"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/alugueis/carros", response_model=AluguelCarro)
async def alugar_carro(aluguel: AluguelCarroCreate, db: AsyncSession = Depends(get_db)):
    try:
        service = AluguelService(db)
        return await service.alugar_carro(aluguel)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/alugueis/hoteis", response_model=AluguelHotel)
async def alugar_hotel(aluguel: AluguelHotelCreate, db: AsyncSession = Depends(get_db)):
    try:
        service = AluguelService(db)
        return await service.alugar_hotel(aluguel)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
