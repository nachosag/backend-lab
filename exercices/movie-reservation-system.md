# Movie Reservation System

Construye un sistema que permita a los usuarios reservar entradas de cine.

Se requiere construir el sistema backend para un servicio de reserva de películas. El servicio permitirá a los usuarios registrarse, iniciar sesión, explorar películas, reservar asientos para funciones específicas y gestionar sus reservas. El sistema contará con autenticación de usuarios, gestión de películas y funciones, funcionalidad de reserva de asientos e informes sobre reservas.

## Objetivo

El objetivo de este proyecto es ayudarte a entender cómo implementar lógica de negocio compleja, es decir, reserva de asientos y programación, pensar en el modelo de datos y las relaciones, y consultas complejas.

## Requisitos

Hemos omitido intencionalmente los detalles de implementación para animarte a pensar sobre el diseño e implementación del sistema. Sin embargo, aquí hay algunos requisitos que puedes considerar:

### Autenticación y Autorización de Usuarios

*   Los usuarios deberían poder registrarse e iniciar sesión.
*   También necesitas roles para los usuarios, como administrador y usuario regular.
    *   Los administradores deberían poder gestionar películas y funciones.
    *   Los usuarios regulares deberían poder reservar asientos para una función.
*   Puedes crear el administrador inicial usando datos semilla (seed data). Solo los administradores deberían poder promover a otros usuarios a administradores y ser capaces de realizar tareas relacionadas con la gestión de películas, informes, etc.

### Gestión de Películas

*   Los administradores deberían poder añadir, actualizar y eliminar películas.
*   Cada película debe tener un título, descripción e imagen de póster.
*   Las películas deberían estar categorizadas por género.
*   Las películas deben tener funciones (horarios de proyección).

### Gestión de Reservas

*   Los usuarios deberían poder obtener las películas y sus horarios de función para una fecha específica.
*   Los usuarios deberían poder reservar asientos para una función, ver los asientos disponibles y seleccionar los asientos que deseen.
*   Los usuarios deberían poder ver sus reservas y cancelarlas (solo las próximas).
*   Los administradores deberían poder ver todas las reservas, la capacidad y los ingresos.

**Consideraciones de Implementación**

*   Piensa en el modelo de datos y las relaciones entre entidades.
*   Piensa en cómo evitarás la sobreventa y cómo manejarás las reservas de asientos.
*   Piensa en cómo manejarás la programación de las funciones.
*   Piensa en cómo manejarás la generación de informes de reservas.
*   Piensa en cómo manejarás la autenticación y autorización de los usuarios.

Este proyecto es bastante complejo y requerirá que pienses en el diseño e implementación del sistema. Puedes usar cualquier lenguaje de programación y base de datos de tu elección. Recomendaría usar una base de datos relacional como MySQL o PostgreSQL. Una vez que hayas terminado este proyecto, tendrás un buen entendimiento de cómo implementar lógica de negocio compleja, pensar en el modelo de datos y las relaciones, y realizar consultas complejas. También puedes extender este proyecto añadiendo más características como procesamiento de pagos, notificaciones por correo electrónico, etc.
