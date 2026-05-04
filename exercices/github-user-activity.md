# Actividad de Usuario de GitHub

Utilizá la API de GitHub para obtener la actividad de un usuario y mostrarla en la terminal.

En este proyecto vas a construir una **interfaz de línea de comandos (CLI)** simple para obtener la actividad reciente de un usuario de GitHub y mostrarla en la terminal. Este proyecto te ayudará a practicar habilidades de programación, incluyendo trabajo con **APIs**, manejo de **datos JSON** y construcción de una **aplicación CLI simple**.

## Requisitos

La aplicación debe ejecutarse desde la línea de comandos, aceptar el **nombre de usuario de GitHub como argumento**, obtener la actividad reciente del usuario usando la **API de GitHub**, y mostrarla en la terminal.

El usuario debe poder:

### 1. Proporcionar el nombre de usuario de GitHub como argumento al ejecutar el CLI

```bash
github-activity <username>
```

### 2. Obtener la actividad reciente del usuario usando la API de GitHub

Podés usar el siguiente endpoint para obtener la actividad del usuario:

```javascript
# https://api.github.com/users/<username>/events
# Example: https://api.github.com/users/kamranahmedse/events
```

### 3. Mostrar la actividad obtenida en la terminal

```javascript
Output:
- Pushed 3 commits to kamranahmedse/developer-roadmap
- Opened a new issue in kamranahmedse/developer-roadmap
- Starred kamranahmedse/developer-roadmap
- ...
```

Podés aprender más sobre la **API de GitHub** en su documentación oficial.

### 4. Manejar errores correctamente

Por ejemplo:

* Nombres de usuario inválidos.
* Fallos en la API.
* Problemas de red.

### 5. Lenguaje de programación

Podés usar **cualquier lenguaje de programación** para construir este proyecto.

### 6. Restricciones

No utilices **librerías externas ni frameworks** para obtener la actividad de GitHub.

---

## Extensiones opcionales (más avanzado)

Si querés construir una versión más avanzada de este proyecto, podés considerar agregar funcionalidades como:

* Filtrar la actividad por **tipo de evento**.
* Mostrar la actividad en un **formato más estructurado**.
* Implementar **caché** de los datos obtenidos para mejorar el rendimiento.
* Explorar otros **endpoints de la API de GitHub** para obtener información adicional sobre el usuario o sus repositorios.

