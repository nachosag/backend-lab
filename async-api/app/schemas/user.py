from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, SQLModel

from app.db_models import UserBase

from .post import PostRead


class UserCreate(UserBase):
    """Schema para crear usuarios"""

    pass


class UserUpdate(SQLModel):
    """Schema para actualizar usuarios"""

    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


class UserRead(UserBase):
    """Schema para leer usuarios"""

    id: int
    created_at: datetime = Field(default=datetime.today())
    updated_at: Optional[datetime] = None


class UserReadWithPosts(UserRead):
    """Schema para leer usuarios con posts"""

    posts: list["PostRead"] = []
