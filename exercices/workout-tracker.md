# Workout Tracker

Aplicación para permitir a los usuarios rastrear sus entrenamientos y progreso.

Este proyecto implica crear un sistema backend para una aplicación de seguimiento de entrenamientos donde los usuarios puedan registrarse, iniciar sesión, crear planes de entrenamiento y rastrear su progreso. El sistema contará con autenticación JWT, operaciones CRUD para los entrenamientos y generará informes sobre entrenamientos pasados.

## Requisitos

Se requiere que desarrolles una API para una aplicación de seguimiento de entrenamientos que permita a los usuarios gestionar sus rutinas y rastrear su progreso. Tu primera tarea es pensar en el esquema de la base de datos y los endpoints de la API que serán necesarios para soportar la funcionalidad de la aplicación. Aquí hay algunas de las características clave que deberías considerar:

### Datos de Ejercicios

Debes escribir un "data seeder" (sembrador de datos) para poblar la base de datos con una lista de ejercicios. Cada ejercicio debe tener un nombre, una descripción y una categoría (por ejemplo, cardio, fuerza, flexibilidad) o grupo muscular (por ejemplo, pecho, espalda, piernas). Los ejercicios se utilizarán para crear planes de entrenamiento.

### Autenticación y Autorización de Usuarios

Los usuarios podrán registrarse, iniciar sesión y cerrar sesión en la aplicación. Debes usar JWT para la autenticación y autorización. Solo los usuarios autenticados deberían poder crear, actualizar y eliminar planes de entrenamiento. No hace falta decir que los usuarios solo deberían poder acceder a sus propios planes de entrenamiento.

*   **Registro:** Permitir a los usuarios crear una cuenta.
*   **Inicio de Sesión:** Permitir a los usuarios iniciar sesión en su cuenta.
*   **JWT:** Usar JSON Web Tokens para la autenticación.

### Gestión de Entrenamientos

Los usuarios podrán crear sus planes de entrenamiento. Los planes de entrenamiento deben consistir en múltiples ejercicios, cada uno con un número establecido de repeticiones, series y pesos. Los usuarios deberían poder actualizar y eliminar sus planes de entrenamiento. Además, los usuarios deberían poder programar entrenamientos para fechas y horas específicas.

*   **Crear Entrenamiento:** Permitir a los usuarios crear entrenamientos compuestos por múltiples ejercicios.
*   **Actualizar Entrenamiento:** Permitir a los usuarios actualizar entrenamientos y añadir comentarios.
*   **Eliminar Entrenamiento:** Permitir a los usuarios eliminar entrenamientos.
*   **Programar Entrenamientos:** Permitir a los usuarios programar entrenamientos para fechas y horas específicas.
*   **Listar Entrenamientos:** Listar entrenamientos activos o pendientes ordenados por fecha y hora.
*   **Generar Informes:** Generar informes sobre entrenamientos pasados y progreso.

**Restricciones**

Eres libre de elegir el lenguaje de programación y la base de datos de tu preferencia. Las decisiones reales sobre el esquema de la base de datos, los endpoints de la API y otros detalles de implementación dependen de ti. Sin embargo, debes considerar las siguientes restricciones:

*   **Base de Datos:** Usa una base de datos relacional para almacenar datos de usuario, planes de entrenamiento y datos de ejercicios.
*   **API:** Desarrolla una API RESTful para interactuar con la base de datos.
*   **Seguridad:** Implementa autenticación JWT para asegurar los endpoints de la API.
*   **Pruebas:** Escribe pruebas unitarias para asegurar la corrección de tu código.
*   **Documentación:** Aprende sobre Especificaciones OpenAPI. Documenta tus endpoints de la API y proporciona ejemplos de cómo usarlos.

Este proyecto es una excelente manera de practicar la construcción de un sistema backend para una aplicación del mundo real. Aprenderás cómo diseñar un esquema de base de datos, implementar autenticación de usuarios y crear endpoints de API RESTful. Además, ganarás experiencia en escribir pruebas unitarias y documentar tu código.
