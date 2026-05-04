# API de Clima (Servicio Wrapper)

Construye una API de clima que obtenga y devuelva datos meteorológicos.

Comienza a construir, envía tu solución y recibe comentarios de la comunidad.

En este proyecto, en lugar de depender de nuestros propios datos climáticos, construiremos una API de clima que obtiene y devuelve datos meteorológicos desde una API de terceros. Este proyecto te ayudará a entender cómo trabajar con APIs de terceros, caché y variables de entorno.

![](./images/weather-api.png)

En cuanto a la API de clima a utilizar, puedes usar tu favorita. Como sugerencia, aquí tienes un enlace a la API de Visual Crossing; es completamente GRATUITA y fácil de usar.

Con respecto al caché en memoria, una recomendación bastante común es usar Redis. Puedes leer más sobre ello aquí. Como recomendación, podrías usar el código de ciudad ingresado por el usuario como clave, y guardar allí el resultado de la llamada a la API.

Al mismo tiempo, cuando "establezcas" el valor en el caché, también puedes asignarle un tiempo de expiración en segundos (usando la bandera `EX` en el comando `SET`). De esa manera, el caché (las claves) se limpiará automáticamente cuando los datos sean suficientemente antiguos (por ejemplo, asignándole un tiempo de expiración de 12 horas).

## Algunos Consejos

Aquí tienes algunos consejos para ayudarte a comenzar:

*   Comienza creando una API simple que devuelva una respuesta climática predefinida (hardcoded). Esto te ayudará a entender cómo estructurar tu API y cómo manejar las solicitudes.
*   Utiliza variables de entorno para almacenar la clave de la API y la cadena de conexión de Redis. De esta manera, puedes cambiarlas fácilmente sin tener que modificar tu código.
*   Asegúrate de manejar los errores correctamente. Si la API de terceros no funciona o si el código de ciudad no es válido, asegúrate de devolver el mensaje de error apropiado.
*   Utiliza algún paquete o módulo para realizar solicitudes HTTP. Por ejemplo, si usas Node.js, puedes usar el paquete `axios`; si usas Python, puedes usar el módulo `requests`.
*   Implementa limitación de tasa (rate limiting) para prevenir el abuso de tu API. Puedes usar un paquete como `express-rate-limit` si usas Node.js o `flask-limiter` si usas Python.

Este proyecto te ayudará a entender cómo trabajar con APIs de terceros, caché y variables de entorno. También te ayudará a comprender cómo estructurar tu API y cómo manejar las solicitudes.

Si necesitas procesar algún otro contenido, ¡no dudes en pedírmelo!
