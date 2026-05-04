# Caching Proxy

Construye un servidor de caché que almacene las respuestas de otros servidores.

Se requiere construir una herramienta de línea de comandos (CLI) que inicie un servidor proxy con caché. Este servidor reenviará las peticiones al servidor real y almacenará las respuestas en caché. Si se realiza la misma petición nuevamente, devolverá la respuesta en caché en lugar de reenviar la petición al servidor.

## Requisitos

El usuario debe poder iniciar el servidor proxy con caché ejecutando un comando como el siguiente:

`caching-proxy --port <número> --origin <url>`

- `--port` es el puerto en el que se ejecutará el servidor proxy.
- `--origin` es la URL del servidor al que se le reenviarán las peticiones.

Por ejemplo, si el usuario ejecuta el siguiente comando:

`caching-proxy --port 3000 --origin http://dummyjson.com`

El servidor proxy debería iniciarse en el puerto 3000 y reenviar las peticiones a `http://dummyjson.com`.

Tomando el ejemplo anterior, si el usuario hace una petición a `http://localhost:3000/products`, el servidor proxy debería reenviar la petición a `http://dummyjson.com/products`, devolver la respuesta junto con las cabeceras y almacenar la respuesta en caché. Además, debe añadir a la respuesta las cabeceras que indiquen si ésta proviene de la caché o del servidor.

```plaintext
# Si la respuesta proviene de la caché
X-Cache: HIT

# Si la respuesta proviene del servidor origen
X-Cache: MISS
```

Si se realiza la misma petición de nuevo, el servidor proxy debería devolver la respuesta almacenada en caché en lugar de reenviar la petición al servidor.

También debes proporcionar una forma de limpiar la caché ejecutando un comando como el siguiente:

`caching-proxy --clear-cache`

Después de construir este proyecto, deberías tener un buen entendimiento de cómo funciona el almacenamiento en caché y cómo puedes construir un servidor proxy de caché para almacenar respuestas de otros servidores.
