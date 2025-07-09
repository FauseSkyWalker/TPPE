FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro para aproveitar o cache
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o resto do código
COPY . .

ENV PYTHONPATH=/app

RUN chmod +x /app/migrations/apply_migrations.sh

CMD ["/bin/bash", "-c", "/app/migrations/apply_migrations.sh && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir /app"]
