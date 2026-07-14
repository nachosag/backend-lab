# 🗺️ Roadmap — Sistema de Pedidos de Cafetería

> Marcá las tareas a medida que las completes. Cada checkbox representa un entregable concreto. El orden sugerido respeta la regla de dependencia: **empezá por adentro y construí hacia afuera.**

---

## 🔷 FASE 1: Dominio (lo más interno)

### 1.1 Estructura del proyecto
- [x] Inicializar proyecto (`pnpm init`, `tsc --init` con `strict: true`)
- [x] Crear estructura de carpetas (`domain/`, `application/`, `adapters/`, `infrastructure/`, `tests/`)
- [x] Configurar Jest o Vitest

### 1.2 Entidades
- [ ] Crear `ItemPedido` (value object o interfaz, según prefieras)
- [ ] Crear `Producto` con `tieneStock()` y `decrementarStock()`
- [ ] Crear `Pedido` con:
  - [ ] `agregarItem()` — solo en `PENDIENTE`
  - [ ] `calcularTotal()`
  - [ ] `cancelar()` — solo desde `PENDIENTE`
  - [ ] `iniciarPreparacion()` — solo desde `PENDIENTE`
  - [ ] `marcarListo()` — solo desde `EN_PREPARACION`
  - [ ] `entregar()` — solo desde `LISTO`

### 1.3 Errores de dominio
- [ ] `ProductoSinStockError`
- [ ] `PedidoNoCancelableError`
- [ ] `TransicionEstadoInvalidaError`
- [ ] `PedidoNoEncontradoError`
- [ ] `ProductoNoEncontradoError`

### 1.4 Puertos (interfaces)
- [ ] `ProductoRepository` — `findById`, `findAll`, `save`
- [ ] `PedidoRepository` — `findById`, `findAll`, `save`

---

## 🔷 FASE 2: Casos de Uso (Application)

### 2.1 Productos
- [ ] `ListarProductos` — devuelve todos los productos con su stock

### 2.2 Pedidos
- [ ] `CrearPedido` — recibe items `{productoId, cantidad}`, valida stock, crea pedido en `PENDIENTE`
- [ ] `AgregarItemAPedido` — agrega producto a pedido `PENDIENTE`
- [ ] `ConfirmarPedido` — transiciona a `EN_PREPARACION`, decrementa stock
- [ ] `CancelarPedido` — transiciona a `CANCELADO` (solo `PENDIENTE`)
- [ ] `ListarPedidos` — lista todos, filtro opcional por estado
- [ ] `AvanzarEstadoPedido` — avanza un estado (`EN_PREPARACION` → `LISTO` → `ENTREGADO`)

---

## 🔷 FASE 3: Adaptadores (Interface Adapters)

### 3.1 Repositorios concretos (outbound)
- [ ] `InMemoryProductoRepository` — implementa `ProductoRepository` con un `Map`
- [ ] `InMemoryPedidoRepository` — implementa `PedidoRepository` con un `Map`
- [ ] Precargar datos de ejemplo (al menos 5 productos: Espresso, Cappuccino, Latte, Mocha, Té)

### 3.2 Controladores (inbound)
- [ ] `ProductoController` — endpoints para listar productos
  - [ ] `GET /api/productos` — lista todos
- [ ] `PedidoController` — endpoints para CRUD de pedidos
  - [ ] `POST /api/pedidos` — crea un pedido
  - [ ] `GET /api/pedidos` — lista pedidos (query param `?estado=` opcional)
  - [ ] `GET /api/pedidos/:id` — obtiene un pedido
  - [ ] `PATCH /api/pedidos/:id/confirmar` — confirma pedido
  - [ ] `PATCH /api/pedidos/:id/cancelar` — cancela pedido
  - [ ] `PATCH /api/pedidos/:id/avanzar` — avanza estado
  - [ ] `POST /api/pedidos/:id/items` — agrega item a pedido existente

### 3.3 Validación de entrada
- [ ] Validar que los datos de entrada tengan el formato correcto ANTES de llamar al caso de uso
- [ ] Devolver errores HTTP apropiados (400, 404, 409, 422)

---

## 🔷 FASE 4: Infraestructura (Frameworks & Drivers)

- [ ] Configurar Express con las rutas
- [ ] Cablear dependencias manualmente (inversión de control sin framework)
- [ ] Crear `index.ts` — entry point que levanta el servidor
- [ ] Agregar `dev` script (`tsx watch src/index.ts`)
- [ ] Agregar `start` script (compilado)
- [ ] Probar manualmente con curl o Postman

---

## 🔷 FASE 5: Testing

### 5.1 Tests de dominio (unitarios)
- [ ] Test: `Producto.tieneStock()` devuelve `true` cuando hay stock
- [ ] Test: `Producto.tieneStock()` devuelve `false` cuando no alcanza
- [ ] Test: `Producto.decrementarStock()` reduce correctamente
- [ ] Test: `Producto.decrementarStock()` lanza `ProductoSinStockError` si no alcanza
- [ ] Test: `Pedido` se crea en estado `PENDIENTE`
- [ ] Test: `Pedido.agregarItem()` calcula subtotal y total correctamente
- [ ] Test: `Pedido.agregarItem()` lanza error si no está `PENDIENTE`
- [ ] Test: `Pedido.cancelar()` funciona desde `PENDIENTE`
- [ ] Test: `Pedido.cancelar()` lanza `PedidoNoCancelableError` desde `EN_PREPARACION`
- [ ] Test: transiciones de estado válidas (`PENDIENTE` → `EN_PREPARACION` → `LISTO` → `ENTREGADO`)
- [ ] Test: transiciones inválidas lanzan `TransicionEstadoInvalidaError`

### 5.2 Tests de casos de uso (con repos mock)
- [ ] Test: `CrearPedido` con stock suficiente → crea pedido
- [ ] Test: `CrearPedido` con stock insuficiente → lanza error
- [ ] Test: `CancelarPedido` → cambia estado a `CANCELADO`
- [ ] Test: `ConfirmarPedido` → decrementa stock de productos
- [ ] Test: `ListarPedidos` con filtro por estado

### 5.3 Tests de integración
- [ ] Test: `GET /api/productos` devuelve lista de productos
- [ ] Test: `POST /api/pedidos` crea un pedido y devuelve 201
- [ ] Test: `PATCH /api/pedidos/:id/cancelar` en `PENDIENTE` devuelve 200
- [ ] Test: `PATCH /api/pedidos/:id/cancelar` en `EN_PREPARACION` devuelve 409

---

## 🔷 FASE 6: Revisión de arquitectura

- [ ] Verificar que ningún archivo en `domain/` importa de `application/`, `adapters/`, o `infrastructure/`
- [ ] Verificar que ningún archivo en `application/` importa de `adapters/` o `infrastructure/`
- [ ] Verificar que las entidades no tienen dependencias externas (HTTP, DB, etc.)
- [ ] Verificar que los casos de uso reciben repositorios por constructor (inyección de dependencias)
- [ ] Ejecutar `tsc --noEmit` sin errores
- [ ] Ejecutar todos los tests y que pasen en verde

---

## 📊 Progreso

| Fase | Estado | Tareas |
|------|--------|--------|
| 1. Dominio | 🔲 | 0/17 |
| 2. Casos de Uso | 🔲 | 0/7 |
| 3. Adaptadores | 🔲 | 0/12 |
| 4. Infraestructura | 🔲 | 0/6 |
| 5. Testing | 🔲 | 0/16 |
| 6. Revisión | 🔲 | 0/6 |

---

## 🛠️ Comandos útiles

```bash
# Inicializar proyecto Node
pnpm init

# TypeScript estricto
pnpm add -D typescript @types/node
npx tsc --init --strict

# Dev server con hot reload
pnpm add -D tsx
pnpm dev   # tsx watch src/index.ts

# Testing
pnpm add -D vitest
pnpm test  # vitest run

# Express (si elegís REST)
pnpm add express
pnpm add -D @types/express
```

> **Tip**: Si trabaste en el `blogging-platform-api`, ya conocés `vitest` y la estructura hexagonal. Este desafío es un poco más chico y autónomo — ideal para practicar la disciplina de capas sin distracciones.
