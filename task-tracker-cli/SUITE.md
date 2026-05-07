# Suite de Tests Unitarios - Task Tracker CLI

## Visión General

Este documento describe la suite de tests unitarios para el proyecto Task Tracker CLI, implementada con Vitest.

## Estructura del Proyecto

```
src/
├── types.ts           # Definiciones de tipos
├── task-repository.ts # Persistencia en tasks.json
├── task-manager.ts    # Lógica de negocio
├── parser.ts          # CLI argumentos
└── task-cli.ts        # Entry point

tests/
├── vitest.config.ts   # Configuración de Vitest
├── types.test.ts      # Tests de tipos
├── task-repository.test.ts # Tests de persistencia
├── task-manager.test.ts # Tests de lógica de negocio
└── parser.test.ts    # Tests del CLI
```

## Casos de Test

### 1. Unit Tests - `task-manager.test.ts`

| ID    | Descripción                        | Input                        | Output Esperado                        |
| ----- | ---------------------------------- | ---------------------------- | -------------------------------------- |
| TM-01 | Agregar tarea                      | `description: "Nueva tarea"` | Task con id, status 'todo', timestamps |
| TM-02 | Listar todas las tareas            | Sin filtros                  | Array de todas las tareas              |
| TM-03 | Listar tareas filtradas por status | `status: 'done'`             | Solo tareas con status matching        |
| TM-04 | Eliminar tarea existente           | `id: uuid`                   | Task removida del array                |
| TM-05 | Eliminar tarea inexistente         | `id: uuid-invalido`          | Error thrown                           |
| TM-06 | Actualizar descripción             | `id, description`            | Task.description actualizada           |
| TM-07 | Actualizar status                  | `id, status`                 | Task.status actualizada                |
| TM-08 | FindById tarea existente           | `id`                         | Task encontrada                        |
| TM-09 | FindById tarea inexistente         | `id-invalido`                | Error thrown                           |

### 2. Unit Tests - `task-repository.test.ts`

| ID    | Descripción                             | Input             | Output Esperado          |
| ----- | --------------------------------------- | ----------------- | ------------------------ |
| TR-01 | Obtener todas las tareas                | archivo existe    | Array de tareas          |
| TR-02 | Obtener tareas de archivo vacío         | `[]`              | Array vacío              |
| TR-03 | Guardar tareas                          | `Task[]`          | Archivo written con JSON |
| TR-04 | Persistencia crear archivo si no existe | archivo no existe | Archivo creado           |

### 3. Unit Tests - `parser.test.ts`

| ID   | Descripción                              | Input                          | Output                        |
| ---- | ---------------------------------------- | ------------------------------ | ----------------------------- |
| P-01 | Parsear comando add                      | `['add', 'desc']`              | task agregada, log con ID     |
| P-02 | Add sin descripción                      | `['add']`                      | Error: "Falta la descripción" |
| P-03 | Parsear comando update                   | `['update', 'id', 'new desc']` | task actualizada              |
| P-04 | Update sin parámetros                    | `['update']`                   | Error apropiado               |
| P-05 | Parsear comando delete                   | `['delete', 'id']`             | task eliminada                |
| P-06 | Delete sin id                            | `['delete']`                   | Error: "Falta el id"          |
| P-07 | Parsear comando list sin filtro          | `['list']`                     | Tabla con todas las tareas    |
| P-08 | Parsear comando list con filtro válido   | `['list', 'done']`             | Tabla filtrada                |
| P-09 | Parsear comando list con filtro inválido | `['list', 'invalid']`          | Error: "Status inválido"      |
| P-10 | Parsear mark-in-progress                 | `['mark-in-progress', 'id']`   | status = 'in-progress'        |
| P-11 | Parsear mark-done                        | `['mark-done', 'id']`          | status = 'done'               |
| P-12 | Comando desconocido                      | `['unknown']`                  | Mensaje de ayuda              |

### 4. Unit Tests - `types.test.ts`

| ID   | Descripción                                     |
| ---- | ----------------------------------------------- |
| T-01 | Verificar Task interface tiene todos los campos |
| T-02 | Verificar TaskStatus tiene valores válidos      |

## Ejecución

```bash
# Ejecutar todos los tests
pnpm test:run

# Modo watch durante desarrollo
pnpm test

# UI interactiva
pnpm test:ui
```

## Configuración

- Framework: Vitest v4.1.5
- TypeScript: strict mode
- Coverage: 100% en lógica de negocio

## Estado de Implementación

| Módulo                    | Tests  | Estado      |
| ------------------------- | ------ | ----------- |
| `types.test.ts`           | 6      | ✅ Pass     |
| `task-repository.test.ts` | 5      | ✅ Pass     |
| `task-manager.test.ts`    | 11     | ✅ Pass     |
| `parser.test.ts`          | 20     | ✅ Pass     |
| **Total**                 | **42** | ✅ **Pass** |

## Archivos Creados

- `tests/vitest.config.ts` - Configuración de Vitest
- `tests/types.test.ts` - Tests de tipos
- `tests/task-repository.test.ts` - Tests de persistencia
- `tests/task-manager.test.ts` - Tests de lógica de negocio
- `tests/parser.test.ts` - Tests del CLI
- `tsconfig.json` - Actualizado con `exclude: ["tests"]`
