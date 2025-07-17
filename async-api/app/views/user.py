from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers.user import UserController
from app.database import get_db

from ..exceptions import conflict, resource_not_found, resource_repited
from ..schemas.user import UserCreate, UserRead, UserReadWithPosts, UserUpdate

router = APIRouter()


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Crear un nuevo usuario"""
    user = await UserController.create_user(db, user_data)
    if not user:
        resource_repited()
    return user


@router.get("/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Obtener un usuario por ID"""
    user = await UserController.get_user(db, user_id)
    if not user:
        resource_not_found()
    return user


@router.get(
    "/{user_id}/posts", response_model=UserReadWithPosts, status_code=status.HTTP_200_OK
)
async def get_user_with_posts(user_id: int, db: AsyncSession = Depends(get_db)):
    """Obtener usuario con sus posts"""
    user = await UserController.get_user_with_posts(db, user_id)
    if not user:
        resource_not_found()
    return UserReadWithPosts.model_validate(user)


@router.get("/", response_model=list[UserRead], status_code=status.HTTP_200_OK)
async def get_users(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    """Obtener lista de usuarios"""
    return await UserController.get_users(db, skip, limit)


@router.put("/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def update_user(
    user_id: int, user_data: UserUpdate, db: AsyncSession = Depends(get_db)
):
    """Actualizar un usuario"""
    user = await UserController.update_user(db, user_id, user_data)
    if not user:
        resource_not_found()
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """Eliminar un usuario"""
    deleted = await UserController.delete_user(db, user_id)
    if not deleted:
        conflict()


@router.get("/email/{email}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_user_by_email(email: str, db: AsyncSession = Depends(get_db)):
    """Obtener usuario por email"""
    user = await UserController.get_user_by_email(db, email)
    if not user:
        resource_not_found()
    return user


@router.get("/active/all", response_model=list[UserRead])
async def get_active_users(db: AsyncSession = Depends(get_db)):
    """Obtener usuarios activos"""
    return await UserController.get_active_users(db)
