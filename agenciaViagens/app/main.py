from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .controllers import usuario, viagem, pagamento, aluguel
from .database import create_tables

app = FastAPI(
    title="Agência de Viagens API",
    description="API para sistema de agência de viagens",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(usuario.router, prefix="/api/usuarios", tags=["Usuários"])
app.include_router(viagem.router, prefix="/api/viagens", tags=["Viagens"])
app.include_router(pagamento.router, prefix="/api/pagamentos", tags=["Pagamentos"])
app.include_router(aluguel.router, prefix="/api/alugueis", tags=["Aluguéis"])

@app.on_event("startup")
def startup():
    """Criar tabelas no banco de dados durante a inicialização."""
    create_tables()

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API da Agência de Viagens",
        "docs": "/docs",
        "redoc": "/redoc"
    }
