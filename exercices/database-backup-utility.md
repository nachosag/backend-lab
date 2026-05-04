# Database Backup Utility

Construye una utilidad de respaldo de base de datos que pueda respaldar y restaurar cualquier DB.

Se requiere construir una utilidad de interfaz de línea de comandos (CLI) para respaldar cualquier tipo de base de datos. La utilidad soportará varios sistemas de gestión de bases de datos (DBMS) como MySQL, PostgreSQL, MongoDB, SQLite y otros. La herramienta contará con programación automática de respaldos, compresión de archivos de respaldo, opciones de almacenamiento (local y en la nube) y registro de actividades de respaldo.

## Requisitos del Proyecto

La herramienta CLI debe soportar las siguientes características:

### Conectividad de Base de Datos

*   **Soporte para Múltiples DBMS:** Proporcionar soporte para conectarse a varios tipos de bases de datos (por ejemplo, MySQL, PostgreSQL, MongoDB).
*   **Parámetros de Conexión:** Permitir a los usuarios especificar parámetros de conexión a la base de datos. Los parámetros pueden incluir host, puerto, nombre de usuario, contraseña y nombre de la base de datos.
*   **Prueba de Conexión:** Validar las credenciales basadas en el tipo de base de datos antes de proceder con las operaciones de respaldo.
*   **Manejo de Errores:** Implementar manejo de errores para fallos de conexión a la base de datos.

### Operaciones de Respaldo

*   **Tipos de Respaldo:** Soporte para tipos de respaldo completos, incrementales y diferenciales basados en el tipo de base de datos y la preferencia del usuario.
*   **Compresión:** Comprimir los archivos de respaldo para reducir el espacio de almacenamiento.

### Opciones de Almacenamiento

*   **Almacenamiento Local:** Permitir a los usuarios almacenar archivos de respaldo localmente en el sistema.
*   **Almacenamiento en la Nube:** Proporcionar opciones para almacenar archivos de respaldo en servicios de almacenamiento en la nube como AWS S3, Google Cloud Storage o Azure Blob Storage.

### Registro y Notificaciones

*   **Registro (Logging):** Registrar las actividades de respaldo, incluyendo hora de inicio, hora de finalización, estado, tiempo empleado y cualquier error encontrado.
*   **Notificaciones:** Opcionalmente, enviar una notificación a Slack al finalizar las operaciones de respaldo.

### Operaciones de Restauración

*   **Restaurar Respaldo:** Implementar una operación de restauración para recuperar la base de datos desde un archivo de respaldo.
*   **Restauración Selectiva:** Proporcionar opciones para la restauración selectiva de tablas o colecciones específicas si es soportado por el DBMS.

**Restricciones**

Siéntete libre de usar cualquier lenguaje de programación o framework de tu elección para implementar la utilidad de respaldo de base de datos. Asegúrate de que la herramienta esté bien documentada y sea fácil de usar. Puedes aprovechar librerías o herramientas existentes para la conectividad de bases de datos y las operaciones de respaldo.

*   La herramienta debe estar diseñada para manejar bases de datos grandes de manera eficiente.
*   Asegúrate de que las operaciones de respaldo y restauración sean seguras y confiables.
*   La utilidad debe ser fácil de usar y proporcionar instrucciones claras para su uso (por ejemplo, comando de ayuda).
*   Considera las implicaciones de rendimiento de las operaciones de respaldo en el servidor de base de datos.
*   Implementa mecanismos adecuados de manejo de errores y registro para rastrear las actividades de respaldo.
*   Asegura la compatibilidad con diferentes sistemas operativos (Windows, Linux, macOS).

Trabajar en este proyecto te ayudará a obtener una comprensión más profunda de los sistemas de gestión de bases de datos, estrategias de respaldo, desarrollo de interfaces de línea de comandos y manejo de errores. También aprenderás sobre la integración de almacenamiento en la nube y mecanismos de registro. Este proyecto mejorará tus habilidades en programación, gestión de bases de datos y administración de sistemas.
