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

---

## expense-tracker-api

API de seguimiento de gastos inspirada en el reto de roadmap.sh (ver enlace). Está construida usando **FastAPI**, **SQLModel** y **SQLite**, y utiliza una arquitectura por **capas (Layer Architecture)**.

El proyecto se divide en dos módulos principales:

### 📌 Autorización
- Funcionalidades: **signup** y **login**.
- Utiliza **JWT** para la autenticación de usuarios.

### 📌 Expensas
- CRUD completo de gastos (create, read, update, delete).

### 🧪 Testing
- Se aplicó **pytest** y metodología **TDD**, con testeo únicamente de los **endpoints**, no de la lógica interna.

**Tecnologías y librerías utilizadas:**
- FastAPI
- SQLModel
- SQLite
- Pytest (TDD)
- PyJWT (o equivalente FastAPI JWT)

**Principales funcionalidades de la API:**
- Registro de usuarios (signup)
- Inicio de sesión (login) con JWT
- Crear, leer, actualizar y borrar gastos
- Filtrado de gastos por usuario (asociación implícita al token)

---
