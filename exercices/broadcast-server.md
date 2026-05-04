# Broadcast Server

Construye un servidor que pueda transmitir mensajes a los clientes conectados.

Se requiere crear un servidor de difusión simple que permita a los clientes conectarse a él y enviar mensajes que serán transmitidos a todos los clientes conectados.

## Objetivo

El objetivo de este proyecto es ayudarte a entender cómo trabajar con websockets e implementar comunicación en tiempo real entre clientes y servidores. Esto te ayudará a comprender cómo funcionan las características en tiempo real de aplicaciones como aplicaciones de chat, marcadores en vivo, etc.

## Requisitos

Debes construir una aplicación basada en CLI (interfaz de línea de comandos) que pueda usarse para iniciar el servidor o conectarse al servidor como cliente. Aquí están los comandos de ejemplo que puedes usar:

*   `broadcast-server start` - Este comando iniciará el servidor.
*   `broadcast-server connect` - Este comando conectará el cliente al servidor.

Cuando el servidor se inicia usando el comando `broadcast-server start`, debe escuchar las conexiones de los clientes en un puerto específico (puedes configurarlo usando opciones de comando o hardcodearlo por simplicidad). Cuando un cliente se conecta y envía un mensaje, el servidor debe transmitir este mensaje a todos los clientes conectados.

El servidor debe ser capaz de manejar múltiples clientes conectándose y desconectándose de manera eficiente.

**Implementación**

Puedes usar cualquier lenguaje de programación para implementar este proyecto. Aquí hay algunos de los pasos que puedes seguir para implementarlo:

1.  Crear un servidor que escuche las conexiones entrantes.
2.  Cuando un cliente se conecta, almacenar la conexión en una lista de clientes conectados.
3.  Cuando un cliente envía un mensaje, transmitir este mensaje a todos los clientes conectados.
4.  Manejar las desconexiones de los clientes y eliminar al cliente de la lista de clientes conectados.
5.  Implementar un cliente que pueda conectarse al servidor y enviar mensajes.
6.  Probar el servidor conectando múltiples clientes y enviando mensajes.
7.  Implementar manejo de errores y un apagado controlado del servidor.

Este proyecto te ayudará a entender cómo trabajar con websockets e implementar comunicación en tiempo real entre clientes y servidores. Puedes extender este proyecto añadiendo características como autenticación, historial de mensajes, etc.
