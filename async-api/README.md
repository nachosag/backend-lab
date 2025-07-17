# Async API

Este repositorio contiene una API RESTful construida con las tecnologías modernas de Python: FastAPI para el framework web y SQLModel para la interacción con la base de datos y la validación de datos. El enfoque principal del proyecto es demostrar una implementación completamente asíncrona, desde las peticiones HTTP hasta las consultas a la base de datos. Se sigue una arquitectura en capas para una clara separación de responsabilidades y se incluye una suite de pruebas robusta con `pytest` para garantizar la calidad y el correcto funcionamiento del código.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/async-api.git
   cd async-api
   ```

2. Crea un entorno virtual y actívalo:
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Linux/macOS
   # venv\Scripts\activate   # En Windows
   ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

## Uso

1. Inicia la aplicación:
   ```bash
   uvicorn app.main:app --reload
   ```
   La API estará disponible en `http://127.0.0.1:8000`.
   Puedes acceder a la documentación interactiva de Swagger UI en `http://127.0.0.1:8000/docs`.

2. Ejecuta los tests:
   ```bash
   pytest
   