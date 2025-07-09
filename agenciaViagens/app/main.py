from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .controllers import (
    usuario_router, auth_router,
    aluguel_router, pagamento_router, viagem_router
)
from .database import create_tables
import logging
# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = FastAPI(
    title="Agência de Viagens API",
    description="API para sistema de agência de viagens com autenticação JWT",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Substitua "*" pelo domínio do frontend, se necessário
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_router, prefix="/api")
app.include_router(usuario_router, prefix="/api")
app.include_router(aluguel_router, prefix="/api")
app.include_router(pagamento_router, prefix="/api")
app.include_router(viagem_router, prefix="/api")

# Tratamento de exceções
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Log de requisições
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"{request.method} {request.url}")
    response = await call_next(request)
    return response

@app.on_event("startup")
async def startup():
    """Criar tabelas no banco de dados durante a inicialização."""
    await create_tables()

@app.get("/")
async def root():
    return {"message": "API is running"}

