import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API is running"}
