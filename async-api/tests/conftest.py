from typing import TypedDict

import pytest
import pytest_asyncio

# import asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
from app.config import settings
from app.database import get_db, test_db_manager
from app.main import app

# Configurar modo testing
settings.testing = True


@pytest_asyncio.fixture(scope="session")
async def event_loop():
    """Crear event loop para toda la sesión de tests"""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session():
    """Crear sesión de base de datos para cada test"""
    # Crear tablas
    await test_db_manager.create_tables()

    # Obtener sesión
    async for session in test_db_manager.get_session():
        yield session

    # Limpiar después del test
    await test_db_manager.drop_tables()


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession):
    """Cliente HTTP para tests"""
    # Override dependency
    app.dependency_overrides[get_db] = lambda: db_session
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac
    finally:
        # Limpiar override
        app.dependency_overrides.clear()


class UserData(TypedDict):
    username: str
    email: str
    full_name: str
    is_active: bool


@pytest.fixture(scope="function")
def sample_user_data() -> UserData:
    """Datos de ejemplo para tests"""
    return {
        "username": "testuser",
        "email": "test@example.com",
        "full_name": "Test User",
        "is_active": True,
    }
