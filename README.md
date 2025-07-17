# backend-lab

Laboratorio de proyectos backend con distintas tecnologías y arquitecturas. Cada subproyecto explora conceptos fundamentales como APIs REST, autenticación, autorización, manejo de sesiones, testing, arquitecturas limpias, asincronía, etc.

A continuación se listan los proyectos incluidos:

---

## async-api

API asincrónica desarrollada con **FastAPI** y **SQLModel**, utilizando **SQLite** como base de datos.  
El proyecto implementa una arquitectura **MVC** sencilla centrada en el manejo de **usuarios** como único modelo.  
Se incluyen **tests unitarios asincrónicos** tanto para los endpoints como para la lógica interna, usando **pytest**.

**Tecnologías y librerías utilizadas:**
- FastAPI
- SQLModel
- SQLite
- Pytest (con soporte asincrónico)
- Uvicorn (para levantar el servidor)

**Principales funcionalidades de la API:**
- Crear un usuario
- Obtener un usuario por ID
- Obtener todos los usuarios
- Actualizar un usuario
- Borrar un usuario
- Obtener un usuario por email
- Obtener todos los usuarios activos
