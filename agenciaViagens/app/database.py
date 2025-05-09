import asyncpg
import os

DATABASE_URL = os.getenv("DATABASE_URL")

async def create_tables():
    conn = await asyncpg.connect(DATABASE_URL)
    await conn.execute("""
    CREATE TABLE IF NOT EXISTS exemplo (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL
    )
    """)
    await conn.close()
