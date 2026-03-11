# Task Tracker (Seguimiento de Tareas)

**Task tracker** es un proyecto utilizado para rastrear y gestionar tus tareas. En este desafío, vas a construir una interfaz de línea de comandos (CLI) simple para monitorear qué necesitás hacer, qué ya terminaste y en qué estás trabajando actualmente.

Este proyecto te va a ayudar a practicar tus habilidades de programación, incluyendo el manejo del sistema de archivos, la gestión de entradas del usuario y la construcción de una aplicación CLI básica.

## Requerimientos

La aplicación debe ejecutarse desde la terminal, aceptar acciones e inputs del usuario como argumentos y almacenar las tareas en un archivo JSON. El usuario debe ser capaz de:

* **Agregar, Actualizar y Eliminar** tareas.
* Marcar una tarea como **en progreso** o **finalizada**.
* Listar **todas** las tareas.
* Listar todas las tareas que estén **finalizadas**.
* Listar todas las tareas que **no estén terminadas**.
* Listar todas las tareas que estén **en progreso**.

### Restricciones

Para guiar tu implementación, tené en cuenta estos puntos:

1. Podés usar cualquier lenguaje de programación.
2. Usá **argumentos posicionales** en la línea de comandos para aceptar las entradas del usuario.
3. Usá un archivo **JSON** para almacenar las tareas en el directorio actual.
4. El archivo JSON debe crearse automáticamente si no existe.
5. Usá el **módulo nativo** de sistema de archivos de tu lenguaje (filesystem) para interactuar con el JSON.
6. **No uses librerías externas** ni frameworks.
7. Asegurate de manejar errores y casos de borde (edge cases) de forma elegante.

## Ejemplo

A continuación, se detalla la lista de comandos y su uso:

```bash
# Agregar una nueva tarea
task-cli add "Comprar víveres"
# Output: Task added successfully (ID: 1)

# Actualizar y eliminar tareas
task-cli update 1 "Comprar víveres y cocinar la cena"
task-cli delete 1

# Marcar una tarea como en progreso o terminada
task-cli mark-in-progress 1
task-cli mark-done 1

# Listar todas las tareas
task-cli list

# Listar tareas por estado
task-cli list done
task-cli list todo
task-cli list in-progress

```

## Propiedades de la Tarea

Cada tarea debe tener las siguientes propiedades en el JSON:

* `id`: Un identificador único para la tarea.
* `description`: Una descripción corta.
* `status`: El estado de la tarea (`todo`, `in-progress`, `done`).
* `createdAt`: Fecha y hora de creación.
* `updatedAt`: Fecha y hora de la última actualización.

> **Importante:** Asegurate de incluir estas propiedades al crear una tarea y de actualizar `updatedAt` cuando realices cambios.

---

## Guía de Inicio

1. **Configurá tu entorno:** Elegí el lenguaje que más te guste y asegurate de tener tu IDE listo.
2. **Inicializá el proyecto:** Creá la carpeta y metele un `git init`. El control de versiones es sagrado, loco.
3. **Implementación:** Empezá por la estructura básica para capturar argumentos. No quieras hacer todo junto; primero que agregue tareas, después que las liste, y así vas escalando.
4. **Testing y Debugging:** Mirá el archivo JSON constantemente para ver si los datos se están guardando como corresponde.
5. **Finalización:** Limpiá el código, comentá lo que sea necesario y armate un buen `README.md`.
