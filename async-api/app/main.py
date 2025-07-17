from contextlib import asynccontextmanager

from fastapi import FastAPI

from .config import settings
from .database import db_manager
from .routers import add_routers


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    await db_manager.create_tables()
    print("Database tables created")

    yield

    # Shutdown
    print("Shutting down...")
    await db_manager.close()


app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    root_path=settings.root_path,
    lifespan=lifespan,
)

add_routers(app)


@app.get("/")
async def root():
    return {"message": "API funcionando con SQLModel"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}
