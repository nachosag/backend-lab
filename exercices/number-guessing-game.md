# Juego de Adivinanza de Números

Construí un juego simple de adivinanza de números para poner a prueba tu suerte.

Se te pide construir un juego simple de adivinanza de números donde la computadora selecciona un número al azar y el usuario tiene que adivinarlo. El usuario tendrá una cantidad limitada de intentos para adivinar el número. Si el usuario adivina el número correctamente, el juego terminará y el usuario ganará. De lo contrario, el juego continuará hasta que el usuario se quede sin intentos.

## Requisitos

Es un juego basado en CLI (interfaz de línea de comandos), por lo que debes usar la línea de comandos para interactuar con el juego. El juego debe funcionar de la siguiente manera:

- Cuando el juego comienza, debe mostrar un mensaje de bienvenida junto con las reglas del juego.
- La computadora debe seleccionar aleatoriamente un número entre 1 y 100.
- El usuario debe seleccionar el nivel de dificultad (fácil, medio, difícil) que determinará la cantidad de intentos que tiene para adivinar el número.
- El usuario debe poder ingresar su suposición.
- Si la suposición del usuario es correcta, el juego debe mostrar un mensaje de felicitación junto con la cantidad de intentos que tomó adivinar el número.
- Si la suposición del usuario es incorrecta, el juego debe mostrar un mensaje indicando si el número es mayor o menor que la suposición del usuario.
- El juego debe terminar cuando el usuario adivina el número correcto o se queda sin intentos.

Aquí hay un ejemplo de salida del juego:

```plaintext
Bienvenido al Juego de Adivinanza de Números!
Estoy pensando en un número entre 1 y 100.
Tienes 5 oportunidades para adivinar el número correcto.

Por favor, selecciona el nivel de dificultad:
1. Fácil (10 oportunidades)
2. Medio (5 oportunidades)
3. Difícil (3 oportunidades)

Ingresa tu elección: 2

Genial! Has seleccionado el nivel de dificultad Medio.
Comencemos el juego!

Ingresa tu suposición: 50
Incorrecto! El número es menor que 50.

Ingresa tu suposición: 25
Incorrecto! El número es mayor que 25.

Ingresa tu suposición: 35
Incorrecto! El número es menor que 35.

Ingresa tu suposición: 30
Felicitaciones! Adivinaste el número correcto en 4 intentos.
```

## Características adicionales

Para hacer el juego más interesante, puedes agregar las siguientes funcionalidades:

- Permitir al usuario jugar múltiples rondas del juego (es decir, seguir jugando hasta que el usuario decida salir). Puedes hacer esto preguntando al usuario si quiere jugar nuevamente después de cada ronda.
- Agregar un temporizador para ver cuánto tiempo le toma al usuario adivinar el número.
- Implementar un sistema de pistas que proporcione indicios al usuario si está estancado.
- Mantener un registro de la puntuación más alta del usuario (es decir, la menor cantidad de intentos que tomó adivinar el número en un nivel de dificultad específico).
