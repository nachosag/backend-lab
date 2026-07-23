# Design: Order Management API

## Technical Approach

A greenfield TypeScript + Express 5 backend practicing **Uncle Bob's 4-layer Clean Architecture** end-to-end. Six domains (auth, customers, products, orders, payments, inventory) exercise every layer; the dependency rule `frameworks → adapters → use cases → entities` is enforced by folder structure and the DI container. In-memory repositories are designed for one-file swap to Postgres or Mongo later. The user writes every line of code; this design is the contract.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|---|---|---|---|
| Architecture style | Pure 4-layer Clean Architecture (Uncle Bob) | Hexagonal, Layered (3-tier) | Explicit requirement from proposal; learning goal |
| State machine location | In entity (Order.transitionTo, Payment.markCompleted) | In use case | Entity stays rich; use case stays thin orchestrator |
| DI approach | Manual DI container (no library) | InversifyJS, tsyringe, NestJS | Zero magic; user can trace every wiring line |
| Persistence | In-memory Map-backed repositories | JSON file, SQLite, Mongo | In-memory is fastest to TDD; interfaces are persistence-agnostic |
| Cross-domain orchestration | Use cases call other use cases via constructor injection | Dedicated "application service" layer | Standard Uncle Bob pattern; extra layer adds indirection without value at this scale |
| Ownership check | Use case receives `requesterId`; compares to resource owner | Middleware-only | Business rule belongs in use case, not framework layer |
| Zod schema location | `frameworks/express/schemas/{domain}.schema.ts` | Co-located with controller | One source of HTTP truth; reusable for OpenAPI later |
| Auth secret | `process.env.JWT_SECRET` read at boot, fail-fast if missing | Hardcoded, dotenv lazy-load | Production-safe; explicit boot dependency |
| Test file location | Separate `tests/` dir mirroring `src/` | Co-located `*.test.ts` | Scales with many files; matches existing lab convention |
| Linter / formatter | None for this iteration | ESLint + Prettier | Not in proposal; can add later without touching architecture |

## Layer Structure (Concrete)

```text
src/
├── entities/                          ← Layer 1: pure domain (no deps)
│   ├── user.ts
│   ├── customer.ts
│   ├── product.ts
│   ├── order.ts
│   ├── order-item.ts
│   ├── payment.ts
│   ├── order-status.ts                ← enum + transition table
│   └── payment-status.ts              ← enum + transition table
│
├── use-cases/                         ← Layer 2: application rules
│   ├── auth/
│   │   ├── register.use-case.ts
│   │   ├── login.use-case.ts
│   │   └── auth.dto.ts
│   ├── customer/
│   │   ├── get-customer.use-case.ts
│   │   ├── update-customer.use-case.ts
│   │   ├── list-customers.use-case.ts
│   │   └── customer.dto.ts
│   ├── product/
│   │   ├── create-product.use-case.ts
│   │   ├── get-product.use-case.ts
│   │   ├── update-product.use-case.ts
│   │   ├── list-products.use-case.ts
│   │   ├── delete-product.use-case.ts
│   │   └── product.dto.ts
│   ├── order/
│   │   ├── create-order.use-case.ts
│   │   ├── add-item.use-case.ts
│   │   ├── remove-item.use-case.ts
│   │   ├── get-order.use-case.ts
│   │   ├── list-orders.use-case.ts
│   │   ├── submit-order.use-case.ts
│   │   ├── confirm-order.use-case.ts
│   │   ├── ship-order.use-case.ts
│   │   ├── deliver-order.use-case.ts
│   │   ├── cancel-order.use-case.ts
│   │   └── order.dto.ts
│   ├── payment/
│   │   ├── create-payment.use-case.ts
│   │   ├── get-payment.use-case.ts
│   │   └── payment.dto.ts
│   ├── inventory/
│   │   ├── check-stock.use-case.ts
│   │   ├── deduct-stock.use-case.ts
│   │   └── restore-stock.use-case.ts
│   └── interfaces/                    ← Repository contracts (ports)
│       ├── user-repository.interface.ts
│       ├── customer-repository.interface.ts
│       ├── product-repository.interface.ts
│       ├── order-repository.interface.ts
│       └── payment-repository.interface.ts
│
├── interface-adapters/                ← Layer 3: HTTP + persistence
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   └── payment.controller.ts
│   ├── presenters/                    ← Entity → HTTP response shaping
│   │   ├── auth.presenter.ts
│   │   ├── customer.presenter.ts
│   │   ├── product.presenter.ts
│   │   ├── order.presenter.ts
│   │   └── payment.presenter.ts
│   ├── middleware/
│   │   └── auth.middleware.ts         ← JWT verification
│   └── repositories/in-memory/
│       ├── in-memory-user.repository.ts
│       ├── in-memory-customer.repository.ts
│       ├── in-memory-product.repository.ts
│       ├── in-memory-order.repository.ts
│       └── in-memory-payment.repository.ts
│
├── frameworks/                        ← Layer 4: wiring + drivers
│   ├── express/
│   │   ├── app.ts                     ← createApp(deps) factory
│   │   ├── routes.ts                  ← Mounts controllers on paths
│   │   ├── server.ts                  ← Boot: read env → createApp → listen
│   │   ├── error-handler.ts           ← AppError → status code mapping
│   │   └── schemas/                   ← Zod request schemas
│   │       ├── auth.schema.ts
│   │       ├── customer.schema.ts
│   │       ├── product.schema.ts
│   │       ├── order.schema.ts
│   │       └── payment.schema.ts
│   └── config/
│       ├── env.ts                     ← Required env, fail-fast
│       └── di-container.ts            ← Manual wiring root
│
└── shared/
    ├── errors.ts                      ← AppError hierarchy
    ├── ids.ts                         ← generateId() helper (uuid v4)
    └── types.ts                       ← Shared utility types

tests/                                 ← Mirrors src/ structure
├── unit/
│   ├── entities/                      ← Pure entity tests (no mocks)
│   └── use-cases/                     ← Mocks only the repo interfaces
├── integration/                       ← createApp(deps) + Supertest
└── factories/                         ← aUser(), anOrder(), makeUserRepo()...
```

**Dependency rule check**: `frameworks/` imports `interface-adapters/`, `use-cases/`, `entities/`. `interface-adapters/` imports `use-cases/` and `entities/`. `use-cases/` imports `entities/` and own interfaces only. `entities/` imports nothing from this project.

## Dependency Injection Strategy

**Pattern**: a single `di-container.ts` builds a `Deps` object in dependency order and exports both the wiring function and the typed bundle. `createApp(deps)` receives the bundle — making integration tests trivial.

```ts
// frameworks/config/di-container.ts (sketch)
export interface Deps {
  userRepo: UserRepository;
  customerRepo: CustomerRepository;
  productRepo: ProductRepository;
  orderRepo: OrderRepository;
  paymentRepo: PaymentRepository;
  registerUC: RegisterUserUseCase;
  loginUC: LoginUserUseCase;
  // ...one per use case the controllers need
  authMiddleware: RequestHandler;
}

export function buildDeps(env: Env): Deps {
  // 1. Repositories (innermost)
  const userRepo = new InMemoryUserRepository();
  const customerRepo = new InMemoryCustomerRepository();
  const productRepo = new InMemoryProductRepository();
  const orderRepo = new InMemoryOrderRepository();
  const paymentRepo = new InMemoryPaymentRepository();

  // 2. Cross-domain use cases (compose other use cases)
  const checkStockUC = new CheckStockUseCase(productRepo);
  const deductStockUC = new DeductStockUseCase(productRepo);
  const restoreStockUC = new RestoreStockUseCase(productRepo);

  // 3. Use cases (per domain, injecting repos + cross-UC deps)
  const registerUC = new RegisterUserUseCase(userRepo, customerRepo, env.jwtSecret);
  const loginUC    = new LoginUserUseCase(userRepo, env.jwtSecret);
  // ... payment, order transitions, etc., wired with their deps

  // 4. Auth middleware (needs the secret; does NOT need repos)
  const authMiddleware = makeAuthMiddleware(env.jwtSecret);

  return { /* all 30+ fields */ };
}
```

**Why manual**: one file, fully grep-able, zero runtime magic. A test can `buildDeps(testEnv())` and inject custom repos by replacing fields before calling `createApp`. Use cases are **classes with constructor injection** so mocks can `new` them with `vi.fn()`-backed repos.

## DTO Design

DTOs are TypeScript `interface`s co-located with each use case in a `*.dto.ts` file. They are the **contract** between the controller and the use case — Zod parses the wire format, the controller maps parsed data to the DTO, the use case returns the output DTO, the presenter maps it to JSON.

```ts
// use-cases/order/order.dto.ts
export interface CreateOrderInput {
  requesterId: string;        // from req.user (ownership)
  customerId: string;
  items: Array<{ productId: string; quantity: number }>;
}
export interface CreateOrderOutput {
  id: string;
  customerId: string;
  status: OrderStatus;
  items: ReadonlyArray<OrderItemDTO>;
  total: number;
  createdAt: string;          // ISO; presenter reformats if needed
}

// use-cases/payment/payment.dto.ts
export interface CreatePaymentInput { orderId: string; amount: number; method: PaymentMethod; }
export interface CreatePaymentOutput { id: string; orderId: string; status: PaymentStatus; amount: number; }

// use-cases/auth/auth.dto.ts
export interface RegisterInput  { email: string; password: string; name: string; phone?: string; }
export interface RegisterOutput { token: string; userId: string; customerId: string; }
export interface LoginInput     { email: string; password: string; }
export interface LoginOutput    { token: string; userId: string; }
```

**Rule**: DTOs never leak entity internals (no `passwordHash`, no `customer._internal`); the presenter is the boundary that strips sensitive fields.

## Zod Schema Strategy

- **Location**: `frameworks/express/schemas/{domain}.schema.ts` — one file per domain, exporting `xxxRequestSchema` objects per endpoint.
- **Boundary**: parsing happens in the controller, not middleware. Reason: keeps route declarations small (`router.post(path, controller.create)`) and the controller in charge of the HTTP boundary.
- **Type inference**: `z.infer<typeof schema>` derives the *wire* type; the controller manually maps to the *use case DTO*. This means a Zod refactor only changes the schema file, never the use case.
- **Errors**: Zod throws `ZodError`; the global error handler converts it to `ValidationError` (400) with a list of field-level issues.

```ts
// frameworks/express/schemas/order.schema.ts (sketch)
export const createOrderRequestSchema = z.object({
  body: z.object({
    customerId: z.string().uuid(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })).min(1),
  }),
  // params & query: not used here
});
```

## Error Handling Strategy

Custom error hierarchy in `shared/errors.ts`; every layer throws the most specific error. The global Express error middleware (in `frameworks/express/error-handler.ts`) is the **only** place that knows about HTTP status codes.

| Error class | HTTP | When |
|---|---|---|
| `ValidationError` | 400 | Zod failure, entity invariant violated, payment amount mismatch |
| `UnauthorizedError` | 401 | Missing/invalid JWT |
| `ForbiddenError` | 403 | Authenticated but not the owner |
| `NotFoundError` | 404 | User/Customer/Product/Order/Payment id not found |
| `ConflictError` | 409 | Duplicate email/SKU/payment, invalid state transition, insufficient stock |
| `AppError` (base) | 500 | Unexpected internal error (catches programming mistakes) |

**Propagation**: entities throw `ConflictError` for state-machine violations; use cases catch domain errors and re-throw or wrap with context; controllers pass them to `next(err)`; error middleware formats `{ error: { code, message, details? } }`.

## Cross-Domain Orchestration

**Decision**: use cases call other use cases via constructor injection. No application-service layer.

| Trigger | Orchestrating UC | Calls |
|---|---|---|
| `createOrder` | Order | `inventory.checkStock` (validate, no mutation) |
| `addItem` | Order | `inventory.checkStock` (re-validate after item added) |
| `confirmOrder` | Order | `payment.getByOrderId` (gate) → `inventory.deductStock` |
| `cancelOrder` from CONFIRMED | Order | `inventory.restoreStock` |
| `refundPayment` | Payment | updates Payment status → calls Order's `cancelOrder` UC → triggers `inventory.restoreStock` |

```ts
// Example: ConfirmOrderUseCase constructor
constructor(
  private orderRepo: OrderRepository,
  private paymentUC: GetPaymentByOrderUseCase,
  private inventoryUC: DeductStockUseCase,
) {}
```

**Why no service layer**: Uncle Bob's use cases ARE the application services. The "service layer above services" anti-pattern adds indirection. Constructor injection makes cross-UC dependencies **visible in the signature**, which is what we want for review.

## Auth Middleware Design

- **Token extraction**: `Authorization: Bearer <token>` → split, take the second part.
- **Verification**: `jsonwebtoken.verify(token, env.jwtSecret)`. Catch `JsonWebTokenError` and `TokenExpiredError` → throw `UnauthorizedError`.
- **Request typing**: module augmentation in `frameworks/express/types.d.ts`:

  ```ts
  declare global {
    namespace Express {
      interface Request { user?: { userId: string; email: string }; }
    }
  }
  export {};
  ```

- **Middleware factory**: `makeAuthMiddleware(secret: string): RequestHandler` — closure captures the secret, returns the handler. Mounted globally on protected route groups in `routes.ts`.
- **Ownership check**: lives in the **use case**, not middleware. Every use case that touches a customer-owned resource receives `requesterId: string` as its first input and throws `ForbiddenError` if it does not match the loaded resource's owner. The controller forwards `req.user!.userId` as `requesterId`.

## Repository Interface Design

All interfaces live in `use-cases/interfaces/`. They are TypeScript `interface`s only — implementations live in `interface-adapters/repositories/in-memory/`.

```ts
// use-cases/interfaces/user-repository.interface.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;            // upsert by id
}

// use-cases/interfaces/customer-repository.interface.ts
export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByUserId(userId: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  save(customer: Customer): Promise<Customer>;
  update(id: string, patch: Partial<Pick<Customer, "name" | "phone">>): Promise<Customer>;
}

// use-cases/interfaces/product-repository.interface.ts
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(id: string, patch: Partial<Pick<Product, "sku" | "name" | "price" | "stock">>): Promise<Product>;
  delete(id: string): Promise<void>;
  // Deduct/restore are entity operations: the use case loads the product,
  // calls product.deductStock(n), then productRepo.save(product).
}

// use-cases/interfaces/order-repository.interface.ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByCustomerId(customerId: string, status?: OrderStatus): Promise<Order[]>;
  findAll(filter?: { status?: OrderStatus; customerId?: string }): Promise<Order[]>;
  save(order: Order): Promise<Order>;
}

// use-cases/interfaces/payment-repository.interface.ts
export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  save(payment: Payment): Promise<Payment>;
}
```

**Method convention**: `find*` returns `T | null`; `save` is upsert by id; `delete` is `Promise<void>`. Async throughout (interfaces stay future-proof for I/O).

## Testing Design

- **Structure**: `tests/` mirrors `src/`. Files: `tests/unit/entities/order.test.ts` ↔ `src/entities/order.ts`. Integration: `tests/integration/order.lifecycle.test.ts`.
- **Runner**: Vitest 4, `globals: true`. Use `describe`/`it`/`expect` directly. Mock via `vi.fn()` directly on stub objects (matches the existing lab pattern in `blogging-platform-api`).
- **Test data factories** (in `tests/factories/`):

  ```ts
  // tests/factories/user.factory.ts
  export function aUser(overrides: Partial<User> = {}): User {
    return { id: randomUUID(), email: `u${Date.now()}@x.com`,
             passwordHash: "hashed", createdAt: new Date(), ...overrides };
  }
  export const anOrder = (overrides: Partial<Order> = {}): Order => ({ ... });
  export const aProduct = (overrides: Partial<Product> = {}): Product => ({ ... });
  ```

- **Mock factories** — one per repository, returns an object whose every method is a `vi.fn()`:

  ```ts
  // tests/factories/user-repo.factory.ts
  export function makeUserRepo(): UserRepository {
    return { findById: vi.fn(), findByEmail: vi.fn(), save: vi.fn() };
  }
  ```

  Use cases tests do: `const repo = makeUserRepo(); repo.findByEmail.mockResolvedValue(aUser()); new LoginUseCase(repo, "secret").execute(...)`.

- **Integration tests**: `createApp(buildDeps(env))` → use `supertest` to hit the running app. In-memory repos give each test a fresh state because `buildDeps` is called per test. Helper: `async function getApp()` that returns a fresh app + a `Deps` handle for assertions.
- **Layered TDD order** (per proposal Day 1-6): entities first (no mocks) → use cases (mock repos) → integration (full stack with supertest).

## Data Flow: Full Order Lifecycle

```mermaid
---
config:
  theme: default
---
sequenceDiagram
    accTitle: Order lifecycle end-to-end data flow
    accDescr: Client through Express controllers, use cases, and entities across seven HTTP requests

    autonumber
    participant C as Client
    participant A as Express App
    participant MW as authMiddleware
    participant CTR as orderController
    participant UC as OrderUseCase
    participant INV as InventoryUseCase
    participant PAY as PaymentUseCase
    participant ENT as Order/Product Entity
    participant R as InMemoryRepo

    C->>A: POST /auth/register
    A->>CTR: register()
    CTR-->>C: 201 {token, userId, customerId}

    C->>A: POST /orders (Bearer)
    A->>MW: verify JWT
    MW-->>CTR: req.user attached
    CTR->>UC: createOrder(input)
    UC->>INV: checkStock(items)
    INV->>R: findById per product
    INV-->>UC: ok
    UC->>ENT: new Order(...) -> recomputeTotal
    UC->>R: orderRepo.save(order)
    UC-->>CTR: Order (DRAFT)
    CTR-->>C: 201 Order

    C->>A: POST /orders/:id/items
    A->>MW: verify
    MW-->>CTR: req.user
    CTR->>UC: addItem(input)
    UC->>INV: checkStock(new item)
    UC->>ENT: order.addItem(item)
    UC->>R: save(order)
    CTR-->>C: 200 Order (DRAFT)

    C->>A: PATCH /orders/:id/submit
    CTR->>UC: submitOrder(input)
    UC->>ENT: order.submit()
    UC->>R: save(order)
    CTR-->>C: 200 Order (PENDING)

    C->>A: POST /orders/:id/payment
    CTR->>UC: createPayment(input)
    UC->>R: orderRepo.findById
    UC->>ENT: order.total === amount
    UC->>ENT: new Payment (PENDING)
    UC->>R: paymentRepo.save
    CTR-->>C: 201 Payment (PENDING)

    Note over C,R: (External processor step omitted; the API exposes a process-payment endpoint)
    C->>A: PATCH /orders/:id/payment/process
    CTR->>UC: processPayment
    UC->>ENT: payment.markCompleted()
    UC->>R: save(payment)
    CTR-->>C: 200 Payment (COMPLETED)

    C->>A: PATCH /orders/:id/confirm
    CTR->>UC: confirmOrder(input)
    UC->>PAY: getByOrderId
    PAY-->>UC: Payment (COMPLETED)
    UC->>INV: deductStock(items)
    INV->>R: per product.save with stock--
    UC->>ENT: order.confirm()
    UC->>R: orderRepo.save
    CTR-->>C: 200 Order (CONFIRMED)

    C->>A: PATCH /orders/:id/ship
    CTR->>UC: shipOrder
    UC->>ENT: order.ship()
    UC->>R: save
    CTR-->>C: 200 Order (SHIPPED)

    C->>A: PATCH /orders/:id/deliver
    CTR->>UC: deliverOrder
    UC->>ENT: order.deliver()
    UC->>R: save
    CTR-->>C: 200 Order (DELIVERED)
```

**Boundary crossings**: HTTP frame (Express) → DTO (Zod-validated) → use case input (mapped) → entity method (pure) → repository save (in-memory Map). Reverse: entity → output DTO → presenter → JSON.

## Threat Matrix

N/A — this design does not change routing, shell commands, subprocesses, VCS/PR automation, executable-file classification, or process integration. The only I/O surface is Express HTTP, handled by standard middleware (helmet, cors) outside this design's scope.

## Migration / Rollout

No migration required — greenfield. The first deploy target is Render free tier (per proposal). The DI container's repository seam means swapping in-memory → Postgres is a single-file change per repository (add `PostgresXxxRepository` implementing the same interface, swap the `buildDeps` factory) with **zero changes** to entities, use cases, or controllers.

## Open Questions

- [ ] **Should `Product.deductStock` raise an entity event** that the in-memory repo listens to (so the repo auto-saves), or should the use case call `productRepo.save` explicitly? Recommendation: explicit save — clearer call graph, easier to test.
- [ ] **Are partial payments ever needed?** Spec says "only one payment per order". Confirm: the entity should reject a second `save` on the same `orderId` — design assumes yes.
- [ ] **How do we handle the in-memory store surviving restarts?** Proposal lists JSON file as "optional fallback". Recommendation: keep pure in-memory for Day 1-6; revisit on Day 7 deploy if state loss is a problem.
- [ ] **Token revocation?** Not in scope, but if needed later, the `User` entity could grow a `tokenVersion` field included in the JWT.
