# Real-time Leaderboard

Crea un sistema de clasificación en tiempo real para ranking y puntuación.

Este proyecto implica crear un sistema backend para un servicio de tablas de clasificación en tiempo real. El servicio permitirá a los usuarios competir en varios juegos o actividades, rastrear sus puntuaciones y ver su posición en una tabla de clasificación. El sistema contará con autenticación de usuarios, envío de puntuaciones, actualizaciones de la tabla en tiempo real e historial de puntuaciones. Se utilizarán conjuntos ordenados de Redis para gestionar y consultar las tablas de clasificación de manera eficiente.

## Requisitos del Proyecto

Debes construir un sistema imaginario de tabla de clasificación en tiempo real que clasifique a los usuarios según sus puntuaciones en varios juegos o actividades. El sistema debe cumplir con los siguientes requisitos:

*   **Autenticación de Usuario:** Los usuarios deben poder registrarse e iniciar sesión en el sistema.
*   **Envío de Puntuación:** Los usuarios deben poder enviar sus puntuaciones para diferentes juegos o actividades.
*   **Actualizaciones de la Tabla:** Mostrar una tabla de clasificación global mostrando los mejores usuarios de todos los juegos.
*   **Ranking de Usuarios:** Los usuarios deben poder ver su posición en la tabla de clasificación.
*   **Informe de Mejores Jugadores:** Generar informes sobre los mejores jugadores durante un período específico.

**Consejo - Usa Conjuntos Ordenados de Redis**

*   **Almacenamiento de la Tabla:** Utiliza conjuntos ordenados de Redis para almacenar y gestionar las tablas de clasificación.
*   **Actualizaciones en Tiempo Real:** Utiliza los conjuntos ordenados de Redis para actualizaciones y consultas eficientes en tiempo real.
*   **Consultas de Ranking:** Utiliza comandos de Redis para consultar las posiciones de los usuarios y su lugar en la tabla.

Después de finalizar este proyecto, tendrás un buen entendimiento de cómo crear un sistema de tabla de clasificación en tiempo real que actualice las puntuaciones en tiempo real. También ganarás experiencia trabajando con conjuntos ordenados de Redis e implementando características de autenticación de usuarios y envío de puntuaciones.
