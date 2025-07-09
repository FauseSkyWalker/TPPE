import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API is running"}
