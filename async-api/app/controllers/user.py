from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from ..db_models import User
from ..models.user import UserModel
from ..schemas.user import UserCreate, UserUpdate


class UserController:
    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate):
        """Crear un nuevo usuario"""
        return await UserModel.create_user(db, user_data)

    @staticmethod
    async def get_user(db: AsyncSession, user_id: int):
        """Obtener un usuario por ID"""
        return await UserModel.get_user(db, user_id)

    @staticmethod
    async def get_user_with_posts(db: AsyncSession, user_id: int):
        """Obtener usuario con sus posts"""
        return await UserModel.get_user_with_posts(db, user_id)

    @staticmethod
    async def get_users(
        db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> list[User]:
        """Obtener lista de usuarios"""
        return await UserModel.get_users(db, skip, limit)

    @staticmethod
    async def update_user(db: AsyncSession, user_id: int, user_data: UserUpdate):
        """Actualizar un usuario"""
        return await UserModel.update_user(db, user_id, user_data)

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> bool:
        """Eliminar un usuario"""
        return await UserModel.delete_user(db, user_id)

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """Obtener usuario por email"""
        return await UserModel.get_user_by_email(db, email)

    @staticmethod
    async def get_active_users(db: AsyncSession) -> list[User]:
        """Obtener usuarios activos"""
        return await UserModel.get_active_users(db)
