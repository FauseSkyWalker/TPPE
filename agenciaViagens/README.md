# Agência de Viagens

Sistema de agência de viagens desenvolvido em Python usando FastAPI, seguindo os princípios de Clean Architecture, MVC e boas práticas de desenvolvimento.

## Arquitetura

O projeto segue a arquitetura Clean Architecture com padrão MVC:

- **Models**: Entidades do domínio e regras de negócio
- **Views**: Schemas do Pydantic para validação e serialização de dados
- **Controllers**: Rotas da API (endpoints)
- **Services**: Lógica de negócio
- **Repositories**: Acesso a dados

### Padrões de Projeto Utilizados

1. **Repository Pattern**: Abstração do acesso a dados
2. **Dependency Injection**: Injeção de dependências via FastAPI
3. **Factory Pattern**: Criação de objetos complexos
4. **Strategy Pattern**: Diferentes estratégias de pagamento
5. **Template Method**: Nas classes base abstratas

## Estrutura de Pastas

```
agenciaViagens/
├── app/
│   ├── controllers/    # Rotas da API
│   ├── models/        # Modelos do SQLAlchemy
│   ├── schemas/       # Schemas Pydantic
│   ├── services/      # Lógica de negócio
│   ├── repositories/  # Acesso a dados
│   ├── enums/         # Enumerações
│   ├── database.py    # Configuração do banco
│   └── main.py        # Aplicação FastAPI
├── tests/            # Testes unitários
└── requirements.txt  # Dependências
```

## Tecnologias Utilizadas

- Python 3.11
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Pytest

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
   ```

4. Execute com Docker Compose:
   ```bash
   docker-compose up -d
   ```

5. Acesse a documentação da API:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Testes

Para executar os testes:

```bash
pytest tests/
```

## Clean Code

O projeto segue as seguintes práticas de Clean Code:

1. **Nomes Significativos**: Classes, métodos e variáveis com nomes claros
2. **Funções Pequenas**: Cada função tem uma única responsabilidade
3. **DRY (Don't Repeat Yourself)**: Código reutilizável e bem organizado
4. **SOLID**: Princípios de design orientado a objetos
5. **Comentários Significativos**: Documentação clara e objetiva
6. **Formatação Consistente**: Seguindo PEP 8
7. **Tratamento de Erros**: Exceções bem definidas e tratadas

## Refatoração

Principais técnicas de refatoração utilizadas:

1. **Extract Method**: Separação de código em métodos menores
2. **Extract Class**: Separação de responsabilidades em classes
3. **Move Method**: Reorganização de métodos entre classes
4. **Rename**: Melhoria na nomenclatura
5. **Pull Up/Push Down**: Hierarquia de classes otimizada
