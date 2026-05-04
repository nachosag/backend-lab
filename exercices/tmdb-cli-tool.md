# Herramienta CLI de TMDB

Usa la API de TMDB para obtener información de películas y mostrarla en la terminal.

Comienza a construir, envía tu solución y recibe comentarios de la comunidad.

En este proyecto, construirás una simple interfaz de línea de comandos (CLI) para obtener datos de The Movie Database (TMDB) y mostrarlos en la terminal. Este proyecto te ayudará a practicar tus habilidades de programación, incluyendo el trabajo con APIs, el manejo de datos JSON y la construcción de una aplicación CLI simple.

## Requisitos

La aplicación debe ejecutarse desde la línea de comandos y ser capaz de obtener y mostrar las películas **populares**, **mejor valoradas**, **próximas** y **en cartelera** desde la API de TMDB. El usuario debe poder especificar el tipo de películas que quiere ver pasando un argumento de línea de comandos a la herramienta CLI.

Así es como debería verse el uso de la herramienta CLI:

```bash
tmdb-app --type "playing"      # Películas en cartelera
tmdb-app --type "popular"       # Películas populares
tmdb-app --type "top"           # Películas mejor valoradas
tmdb-app --type "upcoming"      # Próximas películas
```

Puedes consultar la documentación de la API para entender cómo obtener los datos para cada tipo de película.

Hay algunas consideraciones a tener en cuenta:

*   Maneja los errores con elegancia, como fallos de la API o problemas de red.
*   Utiliza el lenguaje de programación de tu elección para construir este proyecto.
*   Asegúrate de incluir un archivo **README** con instrucciones sobre cómo ejecutar la aplicación y cualquier otra información relevante.
