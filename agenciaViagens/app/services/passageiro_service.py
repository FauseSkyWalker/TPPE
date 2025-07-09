from ..models import Passageiro
from ..enums import TipoPassageiro

def calcular_valor_passagem(passageiro: Passageiro, valor_base: float) -> float:
    """Calcula o valor da passagem com base no tipo do passageiro.
    
    Args:
        passageiro: Instância do modelo Passageiro
        valor_base: Valor base da passagem
        
    Returns:
        float: Valor final da passagem após aplicar desconto
    """
    descontos = {
        TipoPassageiro.ADULTO: 1.0,  # Sem desconto
        TipoPassageiro.CRIANCA: 0.5,  # 50% de desconto
        TipoPassageiro.IDOSO: 0.8,    # 20% de desconto
    }
    return valor_base * descontos[passageiro.tipo_passageiro]
