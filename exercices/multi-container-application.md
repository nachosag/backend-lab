# Multi-Container Application

Usa Docker Compose para ejecutar una aplicación de múltiples contenedores.

El objetivo de este proyecto es practicar el uso de Docker Compose para ejecutar una aplicación de múltiples contenedores en producción. Utilizarás Docker Compose para ejecutar una aplicación Node.js y una base de datos MongoDB.

## Requisitos

Crea un servicio API simple de Node.js sin autenticación para crear una lista de tareas simple (todo list). La API debe tener los siguientes endpoints:

*   `GET /todos` — obtener todas las tareas
*   `POST /todos` — crear una nueva tarea
*   `GET /todos/:id` — obtener una tarea por su id
*   `PUT /todos/:id` — actualizar una tarea por su id
*   `DELETE /todos/:id` — eliminar una tarea por su id

La API debe conectarse a MongoDB para almacenar los elementos de la lista de tareas. Puedes usar Express para la API y Mongoose para conectarte a MongoDB. Puedes usar `nodemon` para reiniciar automáticamente el servidor cuando el código fuente cambie.

### Requisito #1 - Dockerizar la API

Debes dockerizar la API y tener un archivo `docker-compose.yml` que levantará un contenedor de MongoDB y el contenedor de la API. Si todo funciona correctamente, deberías poder acceder a la API a través de `http://localhost:3000` y las tareas deberían guardarse en el contenedor de MongoDB. Los datos deben persistirse cuando los contenedores se detengan y se inicien.

### Requisito #2 - Configurar un servidor remoto

Configura un servidor remoto en Digital Ocean, AWS o cualquier otro proveedor de la nube. Debes usar Terraform para crear el servidor y Ansible para configurarlo adecuadamente, es decir, instalar Docker, Docker Compose, obtener la imagen desde Docker Hub y ejecutar los contenedores.

### Requisito #3 - Configurar un pipeline CI/CD

Una vez que todo funcione localmente, sube tu código a GitHub y configura un pipeline de CI/CD para desplegar la aplicación en el servidor remoto. Puedes usar GitHub Actions para configurar el pipeline. Asegúrate de usar `docker-compose` para ejecutar la aplicación en el entorno de producción.

### Bonus - Configurar un proxy inverso

Configura un proxy inverso usando Nginx para permitirte acceder a la aplicación a través de `http://tu_dominio.com`. Debes usar docker-compose para configurar el proxy inverso.

Después de completar este proyecto, tendrás un buen entendimiento de Docker Compose, aplicaciones de múltiples contenedores, pipelines de CI/CD y más.
