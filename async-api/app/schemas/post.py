from datetime import datetime

from sqlmodel import Field

from app.db_models import PostBase


class PostCreate(PostBase):
    author_id: int


class PostRead(PostBase):
    id: int
    created_at: datetime = Field(default=datetime.today())
    author_id: int
