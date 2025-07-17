import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers.user import UserController
from app.models.user import UserCreate

from .conftest import UserData


@pytest.mark.asyncio
async def test_create_user(db_session: AsyncSession, sample_user_data: UserData):
    """Test crear usuario"""
    user_data = UserCreate(**sample_user_data)
    user = await UserController.create_user(db_session, user_data)

    assert user.username == sample_user_data["username"]
    assert user.email == sample_user_data["email"]
    assert user.id is not None


@pytest.mark.asyncio
async def test_get_user(db_session: AsyncSession, sample_user_data: UserData):
    """Test obtener usuario"""
    # Crear usuario
    user_data = UserCreate(**sample_user_data)
    created_user = await UserController.create_user(db_session, user_data)

    # Obtener usuario
    user = await UserController.get_user(db_session, created_user.id)

    assert user.id == created_user.id
    assert user.username == sample_user_data["username"]


@pytest.mark.asyncio
async def test_get_nonexistent_user(db_session: AsyncSession):
    """Test obtener usuario que no existe"""
    user = await UserController.get_user(db_session, 999)
    assert user is None


@pytest.mark.asyncio
async def test_update_user(db_session: AsyncSession, sample_user_data: UserData):
    """Test actualizar usuario"""
    # Crear usuario
    user_data = UserCreate(**sample_user_data)
    created_user = await UserController.create_user(db_session, user_data)

    # Actualizar usuario
    from app.models.user import UserUpdate

    update_data = UserUpdate(full_name="Updated Name")
    updated_user = await UserController.update_user(
        db_session, created_user.id, update_data
    )

    assert updated_user.full_name == "Updated Name"
    assert updated_user.updated_at is not None


@pytest.mark.asyncio
async def test_delete_user(db_session: AsyncSession, sample_user_data: UserData):
    """Test eliminar usuario"""
    # Crear usuario
    user_data = UserCreate(**sample_user_data)
    created_user = await UserController.create_user(db_session, user_data)

    # Eliminar usuario
    result = await UserController.delete_user(db_session, created_user.id)
    assert result is True

    # Verificar que no existe
    user = await UserController.get_user(db_session, created_user.id)
    assert user is None
