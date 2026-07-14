# 🏗️ Desafío: Sistema de Pedidos de Cafetería

> **Clean Architecture — Robert C. Martin**
>
> El objetivo es **internalizar la regla de dependencia** y la **inversión de dependencias**, no entregar features rápido. Cada capa debe depender SOLO hacia adentro.

---

## 📋 Descripción del negocio

Una cafetería de especialidad necesita un sistema para gestionar sus pedidos. Los baristas preparan bebidas a partir de un menú fijo, y los clientes pueden hacer pedidos con una o más bebidas. Hay reglas de negocio que el sistema debe hacer cumplir.

### Reglas de negocio

1. **Stock limitado**: cada producto (bebida) tiene una cantidad máxima disponible por día. No se puede agregar un producto a un pedido si no hay stock suficiente.
2. **Pedido con estado**: un pedido atraviesa los estados `PENDIENTE → EN_PREPARACION → LISTO → ENTREGADO`. También puede ser `CANCELADO`.
3. **Cancelación restringida**: un pedido solo se puede cancelar si está en estado `PENDIENTE`. Una vez que entra en `EN_PREPARACION`, no se puede cancelar.
4. **Precio total**: el precio del pedido se calcula automáticamente como la suma de los precios de cada producto multiplicado por su cantidad. No se permiten descuentos… por ahora.
5. **Productos del menú**: los productos tienen nombre, precio base y stock diario. El stock se decrementa cuando se confirma un pedido (transición de `PENDIENTE` a `EN_PREPARACION`).

---

## 🧅 Las 4 capas de Clean Architecture

Tu implementación debe respetar estrictamente estas capas concéntricas. **El código de una capa externa NUNCA debe ser importado por una capa interna.**

```text
[ Frameworks & Drivers ]  ← Express, base de datos en memoria, CLI
        ↓ depende de
[ Interface Adapters    ]  ← Controladores, Presentadores, Repositorios concretos
        ↓ depende de
[ Application / Use Cases]  ← Casos de uso (servicios de aplicación)
        ↓ depende de
[ Domain / Entities     ]  ← Entidades de negocio, reglas, interfaces (puertos)
```

---

## 🎯 Capa 1: Dominio (Entities)

**No depende de NADIE.** Acá viven las entidades puras y las interfaces de los puertos.

### Entidades

#### `Producto`
```typescript
interface Producto {
  id: string;
  nombre: string;
  precio: number;        // en pesos, > 0
  stockDisponible: number; // >= 0, se decrementa al confirmar pedido
}
```

Comportamiento:
- `tieneStock(cantidad: number): boolean` — verifica si hay stock suficiente
- `decrementarStock(cantidad: number): void` — reduce el stock. Debe lanzar error de dominio si no alcanza.

#### `ItemPedido`
```typescript
interface ItemPedido {
  productoId: string;
  nombreProducto: string;
  cantidad: number;        // > 0
  precioUnitario: number;
  subtotal: number;        // cantidad * precioUnitario
}
```

#### `Pedido`
```typescript
type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';

interface Pedido {
  id: string;
  items: ItemPedido[];
  estado: EstadoPedido;
  total: number;
  fechaCreacion: Date;
}
```

Comportamiento:
- `agregarItem(producto: Producto, cantidad: number): void` — agrega un ítem, calcula subtotal, actualiza total. Solo si el pedido está `PENDIENTE`.
- `calcularTotal(): number` — recorre items y suma subtotales.
- `cancelar(): void` — cambia estado a `CANCELADO`. Solo permitido desde `PENDIENTE`.
- `iniciarPreparacion(): void` — cambia a `EN_PREPARACION`. Solo desde `PENDIENTE`.
- `marcarListo(): void` — cambia a `LISTO`. Solo desde `EN_PREPARACION`.
- `entregar(): void` — cambia a `ENTREGADO`. Solo desde `LISTO`.

### Puertos (interfaces — definidas EN el dominio)

```typescript
interface ProductoRepository {
  findById(id: string): Promise<Producto | null>;
  findAll(): Promise<Producto[]>;
  save(producto: Producto): Promise<void>;
}

interface PedidoRepository {
  findById(id: string): Promise<Pedido | null>;
  findAll(): Promise<Pedido[]>;
  save(pedido: Pedido): Promise<void>;
}
```

Estas interfaces son **contratos que el dominio define**. Las implementaciones concretas viven en la capa de adaptadores.

### Errores de dominio

Debés crear clases de error específicas para cada violación de regla de negocio:
- `ProductoSinStockError`
- `PedidoNoCancelableError`
- `TransicionEstadoInvalidaError`
- `PedidoNoEncontradoError`
- `ProductoNoEncontradoError`

---

## 🎯 Capa 2: Casos de Uso (Application)

**Solo depende del dominio.** Orquesta entidades y repositorios. No sabe NADA de HTTP, CLI, ni bases de datos.

```typescript
class CrearPedidoUseCase {
  constructor(
    private productoRepo: ProductoRepository,
    private pedidoRepo: PedidoRepository
  ) {}

  async execute(items: { productoId: string; cantidad: number }[]): Promise<Pedido>
}
```

Casos de uso requeridos:
1. **`CrearPedido`** — recibe una lista de `{productoId, cantidad}`, valida stock, crea el pedido en estado `PENDIENTE`.
2. **`AgregarItemAPedido`** — agrega un producto a un pedido existente (solo si está `PENDIENTE`).
3. **`ConfirmarPedido`** — transiciona de `PENDIENTE` a `EN_PREPARACION` y decrementa el stock de cada producto.
4. **`CancelarPedido`** — cancela un pedido `PENDIENTE`.
5. **`ListarPedidos`** — devuelve todos los pedidos, opcionalmente filtrados por estado.
6. **`AvanzarEstadoPedido`** — avanza un pedido al siguiente estado (`EN_PREPARACION` → `LISTO` → `ENTREGADO`).
7. **`ListarProductos`** — devuelve todos los productos del menú con su stock actual.

---

## 🎯 Capa 3: Adaptadores de Interfaz (Interface Adapters)

**Solo depende de casos de uso y dominio.** Traduce entre el mundo externo y los casos de uso.

### Controladores (Controllers)

Para **REST API** con Express (opción recomendada) o para **CLI**:

- `PedidoController` — expone endpoints: `POST /pedidos`, `GET /pedidos`, `GET /pedidos/:id`, `PATCH /pedidos/:id/estado`, `DELETE /pedidos/:id`
- `ProductoController` — expone: `GET /productos`

Cada controlador:
- Recibe el request (HTTP, CLI, lo que sea)
- Extrae y valida los datos de entrada
- Llama al caso de uso correspondiente
- Retorna una respuesta formateada

### Presentadores (Presenters) — opcional pero recomendado

Un presenter formatea la salida del caso de uso para el formato específico (JSON para API, texto para CLI). Esto mantiene a los casos de uso sin conocer el formato de salida.

### Repositorios concretos

Implementan las interfaces definidas en el dominio:
- `InMemoryProductoRepository`
- `InMemoryPedidoRepository`

Para este desafío usamos repositorios en memoria (un `Map` o array). La idea es que **cambiar a MongoDB o PostgreSQL sea cambiar solo esta capa**, sin tocar dominio ni casos de uso.

---

## 🎯 Capa 4: Frameworks & Drivers

**La capa más externa.** Acá vive Express (o el CLI), la configuración, y el punto de entrada.

- `src/index.ts` — entry point, cablea todo (inyección de dependencias manual)
- `src/server.ts` — configura Express, monta rutas
- Rutas de Express que llaman a los controladores

---

## 🧪 Testing (Obligatorio)

El testing NO es opcional acá. Parte del aprendizaje es ver cómo la arquitectura facilita testear cada capa de forma aislada.

### Tests de dominio (unitarios, sin mocks)
- Probar transiciones de estado de `Pedido`
- Probar `Producto.decrementarStock()` con y sin stock suficiente
- Probar que `Pedido.cancelar()` falle si no está `PENDIENTE`
- Probar `calcularTotal()` con múltiples items

### Tests de casos de uso (con repositorios mock)
- Probar cada caso de uso con repositorios falsos
- Verificar que los mocks reciban las llamadas correctas

### Tests de integración (extremo a extremo)
- Un test que levante el server, pegue a un endpoint, y verifique la respuesta

---

## 📁 Estructura de archivos sugerida

```text
src/
├── domain/
│   ├── entities/
│   │   ├── Producto.ts
│   │   ├── Pedido.ts
│   │   └── ItemPedido.ts
│   ├── errors/
│   │   ├── ProductoSinStockError.ts
│   │   ├── PedidoNoCancelableError.ts
│   │   ├── TransicionEstadoInvalidaError.ts
│   │   ├── PedidoNoEncontradoError.ts
│   │   └── ProductoNoEncontradoError.ts
│   └── ports/
│       ├── ProductoRepository.ts
│       └── PedidoRepository.ts
├── application/
│   └── use-cases/
│       ├── CrearPedido.ts
│       ├── AgregarItemAPedido.ts
│       ├── ConfirmarPedido.ts
│       ├── CancelarPedido.ts
│       ├── ListarPedidos.ts
│       ├── AvanzarEstadoPedido.ts
│       └── ListarProductos.ts
├── adapters/
│   ├── inbound/
│   │   ├── controllers/
│   │   │   ├── PedidoController.ts
│   │   │   └── ProductoController.ts
│   │   └── routes/
│   │       ├── pedido.routes.ts
│   │       └── producto.routes.ts
│   └── outbound/
│       └── repositories/
│           ├── InMemoryProductoRepository.ts
│           └── InMemoryPedidoRepository.ts
├── infrastructure/
│   ├── server.ts
│   └── index.ts
└── tests/
    ├── unit/
    │   ├── domain/
    │   │   ├── Pedido.test.ts
    │   │   └── Producto.test.ts
    │   └── use-cases/
    │       ├── CrearPedido.test.ts
    │       └── CancelarPedido.test.ts
    └── integration/
        └── api.test.ts
```

---

## 🚫 Restricciones

1. **Ninguna importación hacia afuera**: `domain/` no puede importar nada de `application/`, `adapters/`, ni `infrastructure/`.
2. **Inyección de dependencias manual**: sin frameworks de DI. Pasá las dependencias por constructor.
3. **Sin ORM, sin Mongoose**: el dominio no conoce bases de datos. Los repositorios concretos son la única capa que sabe de almacenamiento.
4. **Errores de dominio**: usá clases de error propias, no genéricos `Error('algo')` ni excepciones de runtime sin contexto.
5. **En memoria para la entrega**: los repositorios deben ser en memoria. Si después querés migrar a MongoDB, solo cambiás los adaptadores outbound.
6. **Tipos estrictos**: si usás TypeScript, activá `strict: true`. Nada de `any` en dominio o casos de uso.

---

## ⏱️ Tiempo estimado: 4–6 horas

| Capa | Tiempo estimado |
|------|-----------------|
| Dominio (entidades + puertos + errores) | 1:00 – 1:30 hs |
| Casos de uso | 1:00 – 1:30 hs |
| Adaptadores (controladores + repos) | 1:00 – 1:30 hs |
| Infraestructura (Express, entry point) | 0:30 – 1:00 hs |
| Tests | 1:00 – 1:30 hs |

---

## ✅ Criterios de aceptación

- [ ] El dominio tiene reglas de negocio ENCAPSULADAS (no hay setters que permitan cualquier valor)
- [ ] Los casos de uso orquestan, no contienen reglas de negocio
- [ ] Los controladores solo traducen HTTP → casos de uso, sin lógica de negocio
- [ ] Los repositorios en memoria implementan las interfaces del dominio
- [ ] Podés cambiar los repositorios en memoria por otra implementación sin tocar dominio ni casos de uso
- [ ] Hay tests del dominio (mínimo 5 tests)
- [ ] Hay tests de al menos 3 casos de uso
- [ ] Hay un test de integración que prueba un endpoint real
- [ ] `tsc --noEmit` pasa sin errores
- [ ] Los tests pasan (`pnpm test` o `npm test`)

---

> *"La arquitectura limpia no es sobre frameworks. Es sobre mantener las opciones abiertas y el dominio protegido."*
> — Robert C. Martin, más o menos.
