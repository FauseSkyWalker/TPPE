from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.services.usuario_service import UsuarioService
from app.auth.auth import get_current_user
from app.schemas.usuario import (
    Usuario,
    UsuarioCreate,
    UsuarioUpdate,
    PessoaFisica,
    PessoaFisicaCreate,
    PessoaFisicaUpdate,
    PessoaJuridica,
    PessoaJuridicaCreate,
    PessoaJuridicaUpdate,
)

router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"],
    responses={
        401: {"description": "Não autorizado"},
        403: {"description": "Acesso proibido"},
        404: {"description": "Recurso não encontrado"},
        500: {"description": "Erro interno do servidor"},
    },
)


@router.post(
    "/pessoa-fisica", response_model=PessoaFisica, status_code=status.HTTP_201_CREATED
)
async def create_pessoa_fisica(
    pessoa_data: PessoaFisicaCreate, session: AsyncSession = Depends(get_db)
):
    service = UsuarioService(session)

    if await service.get_usuario_by_email(pessoa_data.usuario.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    if await service.get_pessoa_fisica_by_cpf(pessoa_data.cpf):
        raise HTTPException(status_code=400, detail="CPF já cadastrado")

    pessoa = await service.create_pessoa_fisica(pessoa_data)
    return pessoa


@router.post(
    "/pessoa-juridica",
    response_model=PessoaJuridica,
    status_code=status.HTTP_201_CREATED,
)
async def create_pessoa_juridica(
    pessoa_data: PessoaJuridicaCreate, session: AsyncSession = Depends(get_db)
):
    service = UsuarioService(session)

    if await service.get_usuario_by_email(pessoa_data.usuario.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    if await service.get_pessoa_juridica_by_cnpj(pessoa_data.cnpj):
        raise HTTPException(status_code=400, detail="CNPJ já cadastrado")

    pessoa = await service.create_pessoa_juridica(pessoa_data)
    return pessoa


@router.get("/me", response_model=Usuario)
async def get_current_user_info(
    current_user: Usuario = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    return current_user


@router.put("/me", response_model=Usuario)
async def update_current_user(
    user_data: UsuarioUpdate,
    current_user: Usuario = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    service = UsuarioService(session)

    if user_data.email and user_data.email != current_user.email:
        if await service.get_usuario_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado")

    updated_user = await service.update_usuario(current_user.id, user_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return updated_user


@router.put("/pessoa-fisica/{pessoa_id}", response_model=PessoaFisica)
async def update_pessoa_fisica(
    pessoa_id: int,
    pessoa_data: PessoaFisicaUpdate,
    current_user: Usuario = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    service = UsuarioService(session)

    if pessoa_data.cpf:
        existing = await service.get_pessoa_fisica_by_cpf(pessoa_data.cpf)
        if existing and existing.id != pessoa_id:
            raise HTTPException(status_code=400, detail="CPF já cadastrado")

    updated = await service.update_pessoa_fisica(pessoa_id, pessoa_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Pessoa física não encontrada")
    return updated


@router.put("/pessoa-juridica/{pessoa_id}", response_model=PessoaJuridica)
async def update_pessoa_juridica(
    pessoa_id: int,
    pessoa_data: PessoaJuridicaUpdate,
    current_user: Usuario = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    service = UsuarioService(session)

    if pessoa_data.cnpj:
        existing = await service.get_pessoa_juridica_by_cnpj(pessoa_data.cnpj)
        if existing and existing.id != pessoa_id:
            raise HTTPException(status_code=400, detail="CNPJ já cadastrado")

    updated = await service.update_pessoa_juridica(pessoa_id, pessoa_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Pessoa jurídica não encontrada")
    return updated


@router.get("/pessoas-fisicas", response_model=List[PessoaFisica])
async def list_pessoas_fisicas(session: AsyncSession = Depends(get_db)):
    service = UsuarioService(session)
    return await service.list_pessoas_fisicas()


@router.get("/pessoas-juridicas", response_model=List[PessoaJuridica])
async def list_pessoas_juridicas(session: AsyncSession = Depends(get_db)):
    service = UsuarioService(session)
    return await service.list_pessoas_juridicas()


@router.get("/search", response_model=List[Usuario])
async def search_usuarios(query: str, session: AsyncSession = Depends(get_db)):
    service = UsuarioService(session)
    return await service.search_usuarios(query)


@router.delete("/pessoas-fisicas/{pessoa_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pessoa_fisica(pessoa_id: int, session: AsyncSession = Depends(get_db)):
    service = UsuarioService(session)
    pessoa = await service.get_pessoa_fisica_by_id(pessoa_id)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa física não encontrada")
    await service.delete_usuario(pessoa.usuario_id)


@router.delete("/pessoas-juridicas/{pessoa_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pessoa_juridica(
    pessoa_id: int, session: AsyncSession = Depends(get_db)
):
    service = UsuarioService(session)
    pessoa = await service.get_pessoa_juridica_by_id(pessoa_id)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa jurídica não encontrada")
    await service.delete_usuario(pessoa.usuario_id)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: Usuario = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    service = UsuarioService(session)
    success = await service.delete_usuario(current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
