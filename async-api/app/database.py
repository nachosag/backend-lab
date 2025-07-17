from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from .config import settings


class DatabaseManager:
    def __init__(self, database_url: str):
        self.engine = create_async_engine(
            database_url,
            echo=settings.debug,
            future=True,
            connect_args={"check_same_thread": False}
            if "sqlite" in database_url
            else {},
        )
        self.SessionLocal = async_sessionmaker(
            bind=self.engine, class_=AsyncSession, expire_on_commit=False
        )

    async def create_tables(self):
        """Crear todas las tablas"""
        async with self.engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

    async def drop_tables(self):
        """Eliminar todas las tablas (útil para testing)"""
        async with self.engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.drop_all)

    async def get_session(self):
        """Obtener sesión de base de datos"""
        async with self.SessionLocal() as session:
            try:
                yield session
            finally:
                await session.close()

    async def close(self):
        """Cerrar conexión a la base de datos"""
        await self.engine.dispose()


# Instancias globales
db_manager = DatabaseManager(settings.database_url)
test_db_manager = DatabaseManager(settings.test_database_url)


async def get_db():
    if settings.testing:
        async for session in test_db_manager.get_session():
            yield session
    else:
        async for session in db_manager.get_session():
            yield session
