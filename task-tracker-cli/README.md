# Task Tracker CLI

**Task Tracker** es una aplicación de línea de comandos (CLI) para gestionar tareas diarias. Permite agregar, actualizar, eliminar y rastrear el estado de tus tareas directamente desde la terminal.

## Características

✅ **Agregar tareas** - Crea nuevas tareas con una descripción  
✅ **Listar tareas** - Visualiza todas tus tareas o filtra por estado  
✅ **Actualizar tareas** - Modifica la descripción de una tarea existente  
✅ **Eliminar tareas** - Elimina tareas que ya no necesitas  
✅ **Cambiar estado** - Marca tareas como en progreso o finalizadas  
✅ **Persistencia** - Las tareas se guardan automáticamente en un archivo JSON  

## Requisitos Previos

- **Node.js** v18 o superior
- **pnpm** v10 o superior (gestor de paquetes)

## Instalación

1. Clona o descarga el repositorio:
```bash
cd task-tracker-cli
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Compila el proyecto:
```bash
pnpm build
```

## Uso

Ejecuta el CLI con el siguiente comando:

```bash
pnpm start [comando] [parámetros]
```

### Comandos Disponibles

#### 1. **add** - Agregar una nueva tarea
```bash
pnpm start add "Descripción de la tarea"
```

**Ejemplo:**
```bash
pnpm start add "Implementar nueva feature"
# Output: Task agregada - ID: 550e8400-e29b-41d4-a716-446655440000
```

#### 2. **list** - Listar tareas
```bash
pnpm start list [estado]
```

**Estados válidos:** `todo`, `in-progress`, `done`

**Ejemplos:**
```bash
# Listar todas las tareas
pnpm start list

# Listar solo tareas pendientes
pnpm start list todo

# Listar tareas en progreso
pnpm start list in-progress

# Listar tareas completadas
pnpm start list done
```

**Output:**
```
┌─────────────────────────────────────┬──────────────────────────┬──────────────┬──────────────────────────────┬──────────────────────────────┐
│ id                                  │ description              │ status       │ createdAt                    │ updatedAt                    │
├─────────────────────────────────────┼──────────────────────────┼──────────────┼──────────────────────────────┼──────────────────────────────┤
│ 550e8400-e29b-41d4-a716-446655440000│ Implementar nueva feature│ todo         │ 2026-03-11T10:30:00.000Z     │ 2026-03-11T10:30:00.000Z    │
└─────────────────────────────────────┴──────────────────────────┴──────────────┴──────────────────────────────┴──────────────────────────────┘
```

#### 3. **update** - Actualizar la descripción de una tarea
```bash
pnpm start update [id] "Nueva descripción"
```

**Ejemplo:**
```bash
pnpm start update "550e8400-e29b-41d4-a716-446655440000" "Refactorizar código"
```

#### 4. **delete** - Eliminar una tarea
```bash
pnpm start delete [id]
```

**Ejemplo:**
```bash
pnpm start delete "550e8400-e29b-41d4-a716-446655440000"
```

#### 5. **mark-in-progress** - Marcar una tarea como en progreso
```bash
pnpm start mark-in-progress [id]
```

**Ejemplo:**
```bash
pnpm start mark-in-progress "550e8400-e29b-41d4-a716-446655440000"
```

#### 6. **mark-done** - Marcar una tarea como finalizada
```bash
pnpm start mark-done [id]
```

**Ejemplo:**
```bash
pnpm start mark-done "550e8400-e29b-41d4-a716-446655440000"
```

## Almacenamiento

Las tareas se almacenan en un archivo `tasks.json` en el directorio actual donde se ejecuta el comando. El archivo se crea automáticamente si no existe.

**Ejemplo de contenido de `tasks.json`:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "description": "Implementar nueva feature",
    "status": "in-progress",
    "createdAt": "2026-03-11T10:30:00.000Z",
    "updatedAt": "2026-03-11T14:15:30.000Z"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "description": "Revisar código",
    "status": "done",
    "createdAt": "2026-03-10T09:00:00.000Z",
    "updatedAt": "2026-03-11T12:00:00.000Z"
  }
]
```

## Estructura del Proyecto

```
task-tracker-cli/
├── src/
│   ├── types.ts              # Definiciones de tipos e interfaces
│   ├── task-cli.ts           # Punto de entrada de la aplicación
│   ├── parser.ts             # Parser de argumentos y comandos
│   ├── task-manager.ts       # Lógica de negocio para gestionar tareas
│   └── task-repository.ts    # Persistencia de datos (archivos)
├── dist/                      # Archivos compilados (generado)
├── package.json              # Configuración del proyecto
├── tsconfig.json             # Configuración de TypeScript
├── pnpm-lock.yaml            # Lock file de dependencias
└── README.md                 # Este archivo
```

## Arquitectura

### Capas de la Aplicación

**1. CLI Parser (`parser.ts`)**
- Interpreta los argumentos de la línea de comandos
- Valida las entradas del usuario
- Maneja errores y mensajes

**2. Task Manager (`task-manager.ts`)**
- Lógica de negocio principal
- Operaciones CRUD de tareas
- Manejo de estados (todo, in-progress, done)

**3. Repository (`task-repository.ts`)**
- Abstracción de persistencia
- Lee y escribe en `tasks.json`
- Crea el archivo automáticamente si no existe

**4. Types (`types.ts`)**
- Definiciones de tipos TypeScript
- Interfaz `Task`
- Estados de tareas

### Tipos de Datos

```typescript
type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;              // UUID único
  description: string;     // Descripción de la tarea
  status: TaskStatus;      // Estado actual
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Manejo de Errores

La aplicación valida las entradas y maneja los siguientes errores:

- **Descripción faltante:** `Error: Falta la descripción de la tarea`
- **ID faltante:** `Error: Falta el id de la tarea`
- **Estado inválido:** `Error: Status inválido. Usá: todo, in-progress o done.`
- **Tarea no encontrada:** `Error: No se encontró la tarea con ID: [id]`
- **Error de archivos:** Manejo automático de errores de lectura/escritura

## Scripts Disponibles

- `pnpm build` - Compila TypeScript a JavaScript
- `pnpm start` - Compila y ejecuta la aplicación

## Dependencias

### Dependencias de Desarrollo

- **TypeScript** - Lenguaje tipado para JavaScript
- **@types/node** - Tipos de TypeScript para Node.js
- **tsx** - Ejecutor de TypeScript directo
- **pnpm** - Gestor de paquetes rápido y eficiente

## Características Técnicas

✅ Escrito en **TypeScript** para mayor seguridad de tipos  
✅ Módulos nativos de Node.js (sin dependencias externas)  
✅ IDs únicos con **UUID** (crypto nativo)  
✅ Timestamps en formato **ISO 8601**  
✅ Persistencia automática en **JSON**  
✅ Validación de entrada robusto  
✅ Manejo de errores elegante  

## Ejemplo de Flujo Completo

```bash
# 1. Agregar una nueva tarea
pnpm start add "Estudiar TypeScript"
# Task agregada - ID: 123e4567-e89b-12d3-a456-426614174000

# 2. Listar todas las tareas
pnpm start list
# Tabla con todas las tareas

# 3. Marcar como en progreso
pnpm start mark-in-progress "123e4567-e89b-12d3-a456-426614174000"

# 4. Ver solo tareas en progreso
pnpm start list in-progress

# 5. Actualizar descripción
pnpm start update "123e4567-e89b-12d3-a456-426614174000" "Estudiar TypeScript avanzado"

# 6. Marcar como finalizada
pnpm start mark-done "123e4567-e89b-12d3-a456-426614174000"

# 7. Ver tareas completadas
pnpm start list done
```

## Distribución

Para instalar la CLI como comando global:

```bash
pnpm build
npm link
```

Luego podrás usar:
```bash
task-cli add "Mi tarea"
task-cli list
```

## Restricciones de Implementación

✓ No utiliza librerías externas (solo módulos nativos de Node.js)  
✓ Almacenamiento en JSON puro  
✓ Argumentos posicionales para entrada de usuario  
✓ Manejo elegante de errores y edge cases  
✓ Creación automática de archivo de almacenamiento  

## Contribuciones

Este es un proyecto educativo para practicar:
- Desarrollo de CLI
- Manejo de archivos
- Gestión de estado
- Arquitectura en capas
- TypeScript

---

Project from `https://roadmap.sh/projects/task-tracker`

---

**Versión:** 1.0.0  
**Licencia:** ISC
