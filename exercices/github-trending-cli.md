# CLI de Tendencias de GitHub

Aplicación de interfaz de línea de comandos (CLI) que se comunica con la API de GitHub y muestra los repositorios en tendencia.

Comienza a construir, envía tu solución y recibe comentarios de la comunidad.

El objetivo de este proyecto es ayudarte a practicar la construcción de aplicaciones CLI, la integración con APIs de terceros, el manejo de errores, configuraciones, etc.

Crea una herramienta de interfaz de línea de comandos (CLI) que interactúe con la API de GitHub para obtener y mostrar repositorios en tendencia. La herramienta permitirá a los usuarios especificar un rango de tiempo (día, semana, mes o año) para filtrar los repositorios en tendencia.

La herramienta CLI obtendrá datos de la API de GitHub y los presentará en un formato amigable para el usuario. La herramienta debe ser fácil de usar y proporcionar una salida clara.

*   **Lenguaje:** Elige cualquier lenguaje de backend.
*   **API de GitHub:** Utiliza la API REST de GitHub para obtener datos de repositorios.
*   **Autenticación:** No se requiere autenticación para repositorios públicos.
*   **Opciones de Rango de Tiempo:** Soporta filtrado por día, semana, mes y año.
*   **Obtención de Datos:** Implementa un manejo robusto de errores para las solicitudes a la API.
*   **Análisis de Datos:** Parsea la respuesta JSON de la API de GitHub.
*   **Ordenamiento:** Ordena los repositorios por cantidad de estrellas.
*   **Formato de Salida:** Muestra los repositorios en tendencia en un formato claro y legible (por ejemplo, nombre del repositorio, descripción, número de estrellas, lenguaje).
*   **Argumentos de Línea de Comandos:**
    *   `--duration`: Especifica el tiempo, es decir, `day`, `week`, `month`, `year`. Por defecto es `week`.
    *   `--limit`: Especifica el número de repositorios a mostrar. Por defecto es `10`.
*   **Manejo de Errores:** Implementa un manejo de errores robusto para entradas inválidas y errores de la API.
*   **Documentación:** Proporciona instrucciones claras sobre cómo instalar y usar la herramienta.

### Ejemplo de Uso

```bash
trending-repos --duration month --limit 20
```

