# API de Plataforma de Blogs

Construye una API RESTful para una plataforma de blogs personal.

Comienza a construir, envía tu solución y recibe comentarios de la comunidad.

Se te requiere crear una API RESTful simple con operaciones CRUD básicas para una plataforma de blogs personal. CRUD significa Crear, Leer, Actualizar y Eliminar (Create, Read, Update, Delete).

## Objetivos

Los objetivos de este proyecto son ayudarte a:

*   Entender qué son las APIs RESTful, incluyendo las mejores prácticas y convenciones.
*   Aprender cómo crear una API RESTful.
*   Aprender sobre métodos HTTP comunes como GET, POST, PUT, PATCH, DELETE.
*   Aprender sobre códigos de estado y manejo de errores en APIs.
*   Aprender cómo realizar operaciones CRUD usando una API.
*   Aprender cómo trabajar con bases de datos.

## Requisitos

Debes crear una API RESTful para una plataforma de blogs personal. La API debe permitir a los usuarios realizar las siguientes operaciones:

*   Crear una nueva publicación de blog
*   Actualizar una publicación de blog existente
*   Eliminar una publicación de blog existente
*   Obtener una sola publicación de blog
*   Obtener todas las publicaciones de blog
*   Filtrar publicaciones de blog por un término de búsqueda

A continuación se detallan los aspectos de cada operación de la API.

### Crear Publicación de Blog

Crea una nueva publicación de blog usando el método `POST`.

**Petición de ejemplo:**
```plaintext
POST /posts
{
  "title": "Mi Primer Post del Blog",
  "content": "Este es el contenido de mi primer post.",
  "category": "Tecnología",
  "tags": ["Tec", "Programación"]
}
```

Cada publicación de blog debe tener los siguientes campos:
```json
{
  "title": "Mi Primer Post del Blog",
  "content": "Este es el contenido de mi primer post.",
  "category": "Tecnología",
  "tags": ["Tec", "Programación"]
}
```

El endpoint debe validar el cuerpo de la solicitud y devolver:
*   Un código de estado `201 Created` con la publicación de blog recién creada, incluyendo los campos adicionales `id`, `createdAt` y `updatedAt`.
    ```json
    {
      "id": 1,
      "title": "Mi Primer Post del Blog",
      "content": "Este es el contenido de mi primer post.",
      "category": "Tecnología",
      "tags": ["Tec", "Programación"],
      "createdAt": "2021-09-01T12:00:00Z",
      "updatedAt": "2021-09-01T12:00:00Z"
    }
    ```
*   O un código de estado `400 Bad Request` con mensajes de error en caso de fallos de validación.

### Actualizar Publicación de Blog

Actualiza una publicación de blog existente usando el método `PUT` (o `PATCH`).

**Petición de ejemplo:**
```plaintext
PUT /posts/1
{
  "title": "Mi Post del Blog Actualizado",
  "content": "Este es el contenido actualizado de mi primer post.",
  "category": "Tecnología",
  "tags": ["Tec", "Programación"]
}
```

El endpoint debe validar el cuerpo de la solicitud y devolver:
*   Un código de estado `200 OK` con la publicación de blog actualizada (con `updatedAt` modificado).
    ```json
    {
      "id": 1,
      "title": "Mi Post del Blog Actualizado",
      "content": "Este es el contenido actualizado de mi primer post.",
      "category": "Tecnología",
      "tags": ["Tec", "Programación"],
      "createdAt": "2021-09-01T12:00:00Z",
      "updatedAt": "2021-09-01T12:30:00Z"
    }
    ```
*   Un código de estado `400 Bad Request` con mensajes de error en caso de validación fallida.
*   Un código de estado `404 Not Found` si no se encuentra la publicación a actualizar.

### Eliminar Publicación de Blog

Elimina una publicación de blog existente usando el método `DELETE`.

**Petición de ejemplo:**
```plaintext
DELETE /posts/1
```

El endpoint debe devolver:
*   Un código de estado `204 No Content` si la publicación fue eliminada exitosamente.
*   Un código de estado `404 Not Found` si la publicación no fue encontrada.

### Obtener Publicación de Blog

Obtiene una sola publicación de blog usando el método `GET`.

**Petición de ejemplo:**
```plaintext
GET /posts/1
```

El endpoint debe devolver:
*   Un código de estado `200 OK` con la publicación de blog solicitada.
    ```json
    {
      "id": 1,
      "title": "Mi Primer Post del Blog",
      "content": "Este es el contenido de mi primer post.",
      "category": "Tecnología",
      "tags": ["Tec", "Programación"],
      "createdAt": "2021-09-01T12:00:00Z",
      "updatedAt": "2021-09-01T12:00:00Z"
    }
    ```
*   O un código de estado `404 Not Found` si no se encuentra la publicación.

### Obtener Todas las Publicaciones de Blog

Obtiene todas las publicaciones de blog usando el método `GET`. Opcionalmente, permite filtrar por un término de búsqueda.

**Petición de ejemplo (todas):**
```plaintext
GET /posts
```

**Respuesta de ejemplo:**
```json
[
  {
    "id": 1,
    "title": "Mi Primer Post del Blog",
    "content": "Este es el contenido de mi primer post.",
    "category": "Tecnología",
    "tags": ["Tec", "Programación"],
    "createdAt": "2021-09-01T12:00:00Z",
    "updatedAt": "2021-09-01T12:00:00Z"
  },
  {
    "id": 2,
    "title": "Mi Segundo Post del Blog",
    "content": "Este es el contenido de mi segundo post.",
    "category": "Viajes",
    "tags": ["Aventura"],
    "createdAt": "2021-09-01T12:30:00Z",
    "updatedAt": "2021-09-01T12:30:00Z"
  }
]
```

El endpoint debe devolver un código de estado `200 OK` con un array de publicaciones.

**Filtrado por término de búsqueda:**
Mientras se recuperan los posts, el usuario también puede filtrarlos por un término de búsqueda usando un parámetro de consulta `term`. Se debe realizar una búsqueda amplia sobre los campos `title`, `content` o `category`.

**Petición de ejemplo (con filtro):**
```plaintext
GET /posts?term=tec
```

Esta petición debería devolver todas las publicaciones que contengan el término "tec" en su título, contenido o categoría (en el ejemplo, devolvería el post con ID 1).

**Nota:** No es necesario implementar paginación, autenticación o autorización para este proyecto. Puedes enfocarte en la funcionalidad principal de la API.

## Tecnologías (Stack Tecnológico)

Siéntete libre de usar cualquier lenguaje de programación, framework y base de datos de tu elección para este proyecto. Aquí hay algunas sugerencias:

*   **JavaScript:** Node.js con Express.js
*   **Python:** Flask o Django
*   **Java:** Spring Boot
*   **Ruby:** Ruby on Rails

Para las **bases de datos**, puedes usar:
*   **MySQL** (o similar) si usas SQL
*   **MongoDB** (o similar) si usas NoSQL
