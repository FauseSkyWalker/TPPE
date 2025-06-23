from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..services import UsuarioService
from ..schemas import (
    PessoaFisicaCreate, PessoaJuridicaCreate,
    PessoaFisica, PessoaJuridica
)

router = APIRouter()

@router.post("/pessoa-fisica", response_model=PessoaFisica)
async def criar_pessoa_fisica(
    pessoa_fisica: PessoaFisicaCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = UsuarioService(db)
        return await service.criar_pessoa_fisica(pessoa_fisica)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/pessoa-juridica", response_model=PessoaJuridica)
async def criar_pessoa_juridica(
    pessoa_juridica: PessoaJuridicaCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = UsuarioService(db)
        return await service.criar_pessoa_juridica(pessoa_juridica)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
