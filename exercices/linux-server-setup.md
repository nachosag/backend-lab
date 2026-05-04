# Linux Server Setup

Aprende a configurar y asegurar un servidor Linux desde cero.

El objetivo de este proyecto es tomar un servidor Linux nuevo (por ejemplo, un VPS recién provisionado de DigitalOcean, Linode, AWS o cualquier proveedor de la nube) y configurarlo con las medidas de seguridad y ajustes esenciales que todo servidor de producción debería tener. Al finalizar, tendrás un servidor endurecido listo para desplegar aplicaciones.

## Requisitos

Se requiere que realices las siguientes tareas en un servidor Ubuntu nuevo:

*   **Configuración de Usuario:** Crea un usuario no root con privilegios sudo. Este usuario debe ser utilizado para toda la administración futura del servidor en lugar del usuario root.
*   **Configuración de SSH:** Genera un par de claves SSH en tu máquina local, añade la clave pública a tu servidor y configura el servidor para deshabilitar la autenticación basada en contraseña.
*   **Configuración del Cortafuegos:** Configura UFW (Uncomplicated Firewall) para permitir solo SSH (puerto 22) por defecto. Debes entender cómo añadir reglas adicionales cuando sea necesario.
*   **Actualizaciones del Sistema:** Actualiza todos los paquetes del sistema y configura las actualizaciones de seguridad automáticas usando `unattended-upgrades`.
*   **Endurecimiento Básico:** Instala y configura Fail2Ban para proteger contra ataques de fuerza bruta por SSH.
*   **Configuración del Servidor:** Establece la zona horaria correcta y un nombre de host (hostname) significativo para tu servidor.
*   **Gestión de Servicios:** Demuestra comandos básicos de `systemctl` para verificar el estado de los servicios, iniciarlos/detenerlos y habilitarlos al arrancar.
*   **Inspección de Registros (Logs):** Usa `journalctl` para ver los registros del sistema y localiza archivos de registro comunes en `/var/log/`.
*   **Verificación:** Completa una lista de verificación de seguridad confirmando que todas las configuraciones están en su lugar y funcionando correctamente.

## Resultados del Aprendizaje

Después de completar este proyecto, habrás aprendido cómo asegurar un servidor Linux contra vectores de ataque comunes, gestionar usuarios y permisos, configurar SSH para autenticación basada en claves, configurar un cortafuegos y mantener tu servidor con actualizaciones automáticas. Estas son habilidades fundamentales para cualquier desarrollador que trabaje con infraestructura en la nube, despliegue aplicaciones o gestione sus propios servidores.
