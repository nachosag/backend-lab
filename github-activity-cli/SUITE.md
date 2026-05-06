# Test Suite — github-activity-cli

## Framework

Vitest

## Ubicación

`tests/`

---

## Módulo: `parser.ts`

### Función: `aggregateEvents`

| ID   | Descripción                                                    | Input                                                           | Output esperado                                  |
| ---- | -------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| P001 | Agrupar un solo evento por repo y tipo                         | `[{type: 'PushEvent', repo: {name: 'user/repo'}, payload: {}}]` | `{ 'user/repo': { 'PushEvent': { count: 1 } } }` |
| P002 | Retornar objeto vacío para array vacío                         | `[]`                                                            | `{}`                                             |
| P003 | Agrupar múltiples eventos por repo y distinto tipo             | `[{type: 'PushEvent', ...}, {type: 'WatchEvent', ...}]`         | Dos entradas en el repo                          |
| P004 | Agrupar múltiples eventos del mismo tipo (incrementar count)   | 2 eventos del mismo tipo                                        | `count: 2`                                       |
| P005 | Incluir action del payload si existe                           | evento con `payload.action`                                     | Incluir `action` en el resultado                 |
| P006 | Incluir ref del payload si existe                              | evento con `payload.ref`                                        | Incluir `ref` en el resultado                    |
| P007 | Incluir ref_type del payload si existe                         | evento con `payload.ref_type`                                   | Incluir `ref_type` en el resultado               |
| P008 | Manejar eventos de múltiples repos                             | eventos de `repo1` y `repo2`                                    | Dos claves en el objeto raíz                     |
| P009 | Sobrescribir action con el último valor (mismo tipo de evento) | 2 eventos con diferente action                                  | Último action prevalece                          |

### Función: `formatMessage`

| ID   | Descripción                             | Input                                                     | Output           |
| ---- | --------------------------------------- | --------------------------------------------------------- | ---------------- |
| P010 | Reemplazar placeholders simple          | template `'Hi {name}'`, data `{name: 'Nacho'}`            | `'Hi Nacho'`     |
| P011 | Reemplazar placeholders numéricos       | template `'{count} msgs'`, data `{count: 5}`              | `'5 msgs'`       |
| P012 | Capitalizar valor de action             | template `'{action} issue'`, data `{action: 'opened'}`    | `'Opened issue'` |
| P013 | Multiple placeholders en orden variable | template `'{count} {name}'`, data `{count: 2, name: 'x'}` | `'2 x'`          |

---

## Módulo: `api.ts`

### Función: `fetchUserEvents`

| ID   | Descripción                                      | Input                       | Output esperado                       |
| ---- | ------------------------------------------------ | --------------------------- | ------------------------------------- |
| A001 | Fetch exitoso retorna eventos parseados          | username válido             | `Events` (array validado por Zod)     |
| A002 | Lanzar error en respuesta no-ok (404)            | username no existe          | `Error: 'Error fetching data'`        |
| A003 | Lanzar error en respuesta no-ok (403 rate limit) | rate limit excedido         | `Error: 'Error fetching data'`        |
| A004 | Lanzar error si respuesta no es array válido     | API retorna objeto no-array | `Error` con mensaje de validación Zod |
| A005 | Lanzar error si evento tiene campo faltante      | evento sin campo `type`     | `Error` de validación Zod             |

### Schema: `EventSchema`

| ID   | Descripción                             | Input                          | Resultado |
| ---- | --------------------------------------- | ------------------------------ | --------- |
| A006 | Validar evento válido                   | objeto con type, repo, payload | válido    |
| A007 | Invalidar evento sin type               | sin campo `type`               | inválido  |
| A008 | Invalidar evento sin repo.name          | repo sin `name`                | inválido  |
| A009 | Invalidar evento con payload inválido   | payload no es objeto           | inválido  |
| A010 | Permitir payload vacío                  | `payload: {}`                  | válido    |
| A011 | Permitir action/ref/ref_type opcionales | con todos los opcionales       | válido    |

---

## Módulo: `args.ts`

### Función: `parseArgs`

| ID    | Descripción                           | Input (process.argv)                  | Output esperado                 |
| ----- | ------------------------------------- | ------------------------------------- | ------------------------------- |
| AR001 | Retornar username válido              | `['node', 'script', 'nacho']`         | `'nacho'`                       |
| AR002 | Lanzar error si no hay username       | `['node', 'script']`                  | `Error: 'Username is required'` |
| AR003 | Ignorar argumentos adicionales        | `['node', 'script', 'user', 'extra']` | `'user'`                        |
| AR004 | Retornar string vacío si arg es vacío | `['node', 'script', '']`              | `''` (no lanza error)           |

---

## Módulo: `output.ts`

### Función: `displayEvents`

| ID   | Descripción                               | Input                     | Verificación                                 |
| ---- | ----------------------------------------- | ------------------------- | -------------------------------------------- |
| O001 | Imprimir mensaje para cada evento         | `RepoStats` con un evento | `console.log` llamado con mensaje formateado |
| O002 | Usar template correcto por tipo de evento | `PushEvent`               | mensaje contiene "Pushed"                    |
| O003 | Usar template para WatchEvent             | `WatchEvent`              | mensaje contiene "Starred"                   |
| O004 | Usar template para IssuesEvent            | `IssuesEvent`             | mensaje contiene "issue"                     |
| O005 | Usar template para CreateEvent            | `CreateEvent`             | mensaje contiene "Created"                   |
| O006 | Interpolar repo name en mensaje           | repo `'user/repo'`        | mensaje contiene el nombre                   |
| O007 | Manejar evento sin template definido      | tipo desconocido          | silently skip o fallback                     |
| O008 | Iterar múltiples repos                    | stats con 2 repos         | console.log llamado múltiples veces          |

---

## Ejecución

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar con coverage
pnpm coverage

# Ejecutar en modo watch
pnpm test -- --watch
```

---

## Notas

- Los tests de `api.ts` que hacen fetch real deberán usar `vi.mock()` para evitar llamadas a la API real.
- Los tests de `output.ts` usan `vi.spyOn(console, 'log')` para capturar output.
- Los tests de `args.ts` deberán mockear `process.argv` o usar `vi.stubGlobal`.
