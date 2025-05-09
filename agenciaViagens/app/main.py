from fastapi import FastAPI
from app.services.exemplo_service import ExemploService
from app.database import create_tables

app = FastAPI()

@app.on_event("startup")
async def startup():
    await create_tables()

@app.get("/")
async def hello():
    service = ExemploService()
    return {"message": service.hello_world()}
