from .usuario_controller import router as usuario_router
from .auth_controller import router as auth_router
from .aluguel import router as aluguel_router
from .pagamento import router as pagamento_router
from .viagem import router as viagem_router

__all__ = [
    'usuario_router',
    'auth_router',
    'aluguel_router',
    'pagamento_router',
    'viagem_router'
]
