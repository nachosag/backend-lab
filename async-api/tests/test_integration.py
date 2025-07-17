import pytest
from httpx import AsyncClient
from .conftest import UserData


@pytest.mark.asyncio
async def test_create_user_endpoint(client: AsyncClient, sample_user_data: UserData):
    """Test endpoint crear usuario"""
    response = await client.post("/api/v1/users/", json=sample_user_data)

    assert response.status_code == 201
    data = response.json()
    assert data["username"] == sample_user_data["username"]
    assert data["email"] == sample_user_data["email"]


@pytest.mark.asyncio
async def test_get_user_endpoint(client: AsyncClient, sample_user_data: UserData):
    """Test endpoint obtener usuario"""
    # Crear usuario
    create_response = await client.post("/api/v1/users/", json=sample_user_data)
    user_id = create_response.json()["id"]

    # Obtener usuario
    response = await client.get(f"/api/v1/users/{user_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id


@pytest.mark.asyncio
async def test_get_users_endpoint(client: AsyncClient, sample_user_data: UserData):
    """Test endpoint obtener lista de usuarios"""
    # Crear algunos usuarios
    for i in range(3):
        user_data = sample_user_data.copy()
        user_data["username"] = f"user{i}"
        user_data["email"] = f"user{i}@example.com"
        await client.post("/api/v1/users/", json=user_data)

    # Obtener lista
    response = await client.get("/api/v1/users/")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


@pytest.mark.asyncio
async def test_update_user_endpoint(client: AsyncClient, sample_user_data: UserData):
    """Test endpoint actualizar usuario"""
    # Crear usuario
    create_response = await client.post("/api/v1/users/", json=sample_user_data)
    user_id = create_response.json()["id"]

    # Actualizar usuario
    update_data = {"full_name": "Updated Name"}
    response = await client.put(f"/api/v1/users/{user_id}", json=update_data)

    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"


@pytest.mark.asyncio
async def test_delete_user_endpoint(client: AsyncClient, sample_user_data: UserData):
    """Test endpoint eliminar usuario"""
    # Crear usuario
    create_response = await client.post("/api/v1/users/", json=sample_user_data)
    user_id = create_response.json()["id"]

    # Eliminar usuario
    response = await client.delete(f"/api/v1/users/{user_id}")

    assert response.status_code == 204

    # Verificar que no existe
    get_response = await client.get(f"/api/v1/users/{user_id}")
    assert get_response.status_code == 404
