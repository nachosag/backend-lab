from datetime import datetime
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select

from ..db_models import Post, User
from ..schemas.user import UserCreate, UserUpdate


class UserModel:
    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate) -> Optional[User]:
        """Crear un nuevo usuario"""
        # Verificar si el usuario ya existe
        statement = select(User).where(
            (User.username == user_data.username) | (User.email == user_data.email)
        )
        result = await db.execute(statement)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            return None

        # Crear nuevo usuario
        db_user = User.model_validate(user_data)
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def get_user(db: AsyncSession, user_id: int) -> Optional[User]:
        """Obtener un usuario por ID"""
        statement = select(User).where(User.id == user_id)
        result = await db.execute(statement)
        user = result.scalar_one_or_none()

        if not user:
            return None
        return user

    @staticmethod
    async def get_user_with_posts(db: AsyncSession, user_id: int) -> Optional[User]:
        """Obtener usuario con sus posts"""
        statement = (
            select(User).where(User.id == user_id).options(selectinload(User.posts))  # type: ignore
        )
        result = await db.execute(statement)
        user = result.scalar_one_or_none()

        if not user:
            return None

        # Cargar posts relacionados
        posts_statement = select(Post).where(Post.author_id == user_id)
        posts_result = await db.execute(posts_statement)
        user.posts = list(posts_result.scalars().all())

        return user

    @staticmethod
    async def get_users(
        db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> list[User]:
        """Obtener lista de usuarios"""
        statement = select(User).offset(skip).limit(limit)
        result = await db.execute(statement)
        return list(result.scalars().all())

    @staticmethod
    async def update_user(
        db: AsyncSession, user_id: int, user_data: UserUpdate
    ) -> Optional[User]:
        """Actualizar un usuario"""
        # Verificar que el usuario existe
        statement = select(User).where(User.id == user_id)
        result = await db.execute(statement)
        db_user = result.scalar_one_or_none()

        if not db_user:
            return None

        # Actualizar campos
        update_data = user_data.model_dump(exclude_unset=True, exclude_none=True)
        if update_data:
            update_data["updated_at"] = datetime.today()
            for key, value in update_data.items():
                setattr(db_user, key, value)

            await db.commit()
            await db.refresh(db_user)

        return db_user

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> bool:
        """Eliminar un usuario"""
        statement = select(User).where(User.id == user_id)
        result = await db.execute(statement)
        user = result.scalar_one_or_none()

        if not user:
            return False

        await db.delete(user)
        await db.commit()
        return True

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """Obtener usuario por email"""
        statement = select(User).where(User.email == email)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_active_users(db: AsyncSession) -> list[User]:
        """Obtener usuarios activos"""
        statement = select(User).where(User.is_active)
        result = await db.execute(statement)
        return list(result.scalars().all())
