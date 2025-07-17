from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True, min_length=3, max_length=50)
    email: EmailStr = Field(index=True, unique=True)
    full_name: str = Field(min_length=1, max_length=100)
    is_active: bool = Field(default=True)


class User(UserBase, table=True):
    """Modelo de tabla para la base de datos"""

    __tablename__ = "users"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.today)
    updated_at: Optional[datetime] = Field(default=None)

    # Relación con posts (ejemplo)
    posts: list["Post"] = Relationship(back_populates="author")


# Modelo adicional para ejemplo de relaciones
class PostBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    published: bool = Field(default=False)


class Post(PostBase, table=True):
    """Modelo de tabla para posts"""

    __tablename__ = "posts"  # type: ignore

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.today)
    author_id: int = Field(foreign_key="users.id")

    # Relación con usuario
    author: Optional[User] = Relationship(back_populates="posts")
