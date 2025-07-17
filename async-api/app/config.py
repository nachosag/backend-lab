from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite+aiosqlite:///./app.db"
    test_database_url: str = "sqlite+aiosqlite:///./test.db"

    # App
    app_name: str = "Async FastAPI MVC app with SQLModel"
    app_description: str = "API REST con SQLModel y arquitectura MVC asíncrona"
    app_version: str = "1.0.0"
    root_path: str = "/api/v1"
    debug: bool = False
    testing: bool = False

    # Security
    secret_key: str = "your-secret-key-here"

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
    }


# Instancia global de configuración
settings = Settings()
