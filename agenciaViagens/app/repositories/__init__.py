from .usuario import UsuarioRepository, PessoaFisicaRepository, PessoaJuridicaRepository
from .viagem import PassageiroRepository, VooRepository, AeroportoRepository, PassagemRepository
from .pagamento import PagamentoRepository
from .aluguel import CarroRepository, HotelRepository, AluguelCarroRepository, AluguelHotelRepository

__all__ = [
    'UsuarioRepository',
    'PessoaFisicaRepository',
    'PessoaJuridicaRepository',
    'PassageiroRepository',
    'VooRepository',
    'AeroportoRepository',
    'PassagemRepository',
    'PagamentoRepository',
    'CarroRepository',
    'HotelRepository',
    'AluguelCarroRepository',
    'AluguelHotelRepository'
]
