from fastapi import FastAPI

from .views.user import router as user_router


def add_routers(app: FastAPI):
    app.include_router(user_router, prefix="/users", tags=["USERS"])
