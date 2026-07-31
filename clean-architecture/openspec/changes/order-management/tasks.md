# Tasks: Order Management API

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~3500–4500 (greenfield, 6 domains, ~80+ files) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Day 1–2: entities + repos + auth/customer/product UCs) → PR 2 (Day 3–4: order + payment + inventory UCs) → PR 3 (Day 5: Express wiring) → PR 4 (Day 6–7: integration tests + deploy) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending (user decides) |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Entities + state machines + repo interfaces + in-memory repos + auth/customer/product use cases + tests | PR 1 | `pnpm vitest run tests/unit/entities tests/unit/use-cases/auth tests/unit/use-cases/customer tests/unit/use-cases/product` | N/A — no HTTP surface yet; pure unit tests | Remove `src/` and `tests/` entirely; no external deps |
| 2 | Order + payment + inventory use cases + cross-domain orchestration tests | PR 2 | `pnpm vitest run tests/unit/use-cases/order tests/unit/use-cases/payment tests/unit/use-cases/inventory` | N/A — still pure unit tests with mocked repos | Remove order/payment/inventory use cases + tests; PR 1 still passes |
| 3 | Express wiring: DI container, controllers, routes, Zod schemas, auth middleware, error handler | PR 3 | `pnpm vitest run tests/integration` | `curl http://localhost:3000/products` returns 200 | Remove `src/frameworks/` + `src/interface-adapters/controllers/` + routes; PR 1–2 still passes |
| 4 | Integration lifecycle tests + deploy config + smoke test | PR 4 | `pnpm vitest run tests/integration` | Live URL smoke test against Render | Remove `tests/integration/lifecycle*` + deploy config; PR 1–3 still passes |

## Day 1 — Entities + State Machines + Tests

### T-001: Scaffold project (pnpm, TypeScript, Vitest)

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: none
**Estimated effort**: 30min

**What to build**: `pnpm init`, install deps (`typescript`, `vitest`, `express`, `zod`, `jsonwebtoken`, `bcrypt`, `supertest`, `@types/*`, `tsx`), `tsconfig.json` (strict, nodenext), `vitest.config.ts`, `package.json` scripts (`dev`, `build`, `test`, `test:unit`, `test:integration`).

**Tests to write first (TDD)**:
- [x] `pnpm test` runs and reports 0 tests (no failures)

**Acceptance criteria**:
- [x] `pnpm install` succeeds
- [x] `pnpm test` runs with 0 failures
- [x] `pnpm build` compiles with no errors

---

### T-002: Create shared errors and ID helper

**Layer**: entities
**Domain**: cross-cutting
**Depends on**: T-001
**Estimated effort**: 30min

**What to build**: `src/shared/errors.ts` (AppError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError), `src/shared/ids.ts` (generateId using crypto.randomUUID).

**Tests to write first (TDD)**:
- [x] Each error class has correct statusCode
- [x] generateId returns a valid UUID string

**Acceptance criteria**:
- [x] `ValidationError` → 400, `UnauthorizedError` → 401, `ForbiddenError` → 403, `NotFoundError` → 404, `ConflictError` → 409
- [x] `generateId()` returns different values on each call

---

### T-003: Create OrderStatus state machine + tests

**Layer**: entities
**Domain**: order
**Depends on**: T-002
**Estimated effort**: 30min

**What to build**: `src/entities/order-status.ts` — const object + type + transition map + `canTransition(from, to)` + `assertValidTransition(from, to)`.

**Tests to write first (TDD)**:
- [x] DRAFT → PENDING is valid
- [x] PENDING → CONFIRMED is valid
- [x] PENDING → CANCELLED is valid
- [x] CONFIRMED → SHIPPED is valid
- [x] CONFIRMED → CANCELLED is valid
- [x] SHIPPED → DELIVERED is valid
- [x] DRAFT → CONFIRMED throws ConflictError
- [x] CANCELLED → DRAFT throws ConflictError
- [x] DELIVERED → CANCELLED throws ConflictError

**Acceptance criteria**:
- [x] All 6 valid transitions pass
- [x] All invalid transitions throw `ConflictError`

---

### T-004: Create PaymentStatus state machine + tests

**Layer**: entities
**Domain**: payment
**Depends on**: T-002
**Estimated effort**: 30min

**What to build**: `src/entities/payment-status.ts` — const object + type + transition map + `canTransition` + `assertValidTransition`.

**Tests to write first (TDD)**:
- [x] PENDING → COMPLETED is valid
- [x] PENDING → FAILED is valid
- [x] COMPLETED → REFUNDED is valid
- [x] FAILED → COMPLETED throws ConflictError
- [x] REFUNDED → COMPLETED throws ConflictError

**Acceptance criteria**:
- [x] All 3 valid transitions pass
- [x] Invalid transitions throw `ConflictError`

---

### T-005: Create User entity + tests

**Layer**: entities
**Domain**: auth
**Depends on**: T-002
**Estimated effort**: 30min

**What to build**: `src/entities/user.ts` — interface + factory function. Fields: id, email, passwordHash, createdAt.

**Tests to write first (TDD)**:
- [x] User with valid fields is created successfully
- [x] User with empty email throws ValidationError

**Acceptance criteria**:
- [x] Entity interface matches design
- [x] Validation rejects empty email

---

### T-006: Create Customer entity + tests

**Layer**: entities
**Domain**: customer
**Depends on**: T-002
**Estimated effort**: 30min

**What to build**: `src/entities/customer.ts` — interface + factory. Fields: id, userId, name, email, phone?, createdAt.

**Tests to write first (TDD)**:
- [x] Customer with valid fields creates successfully
- [x] Customer with empty name throws ValidationError
- [x] Customer with invalid email throws ValidationError

**Acceptance criteria**:
- [x] name required, email validated, phone optional
- [x] Entity interface matches design

---

### T-007: Create Product entity + tests

**Layer**: entities
**Domain**: product
**Depends on**: T-002
**Estimated effort**: 30min

**What to build**: `src/entities/product.ts` — interface + methods (`deductStock`, `restoreStock`). Fields: id, sku, name, price, stock, createdAt.

**Tests to write first (TDD)**:
- [x] Product with price ≤ 0 throws ValidationError
- [x] Product with stock < 0 throws ValidationError
- [x] `deductStock(5)` on stock=10 → stock=5
- [x] `deductStock(11)` on stock=10 throws ConflictError
- [x] `restoreStock(5)` on stock=5 → stock=10

**Acceptance criteria**:
- [x] price > 0, stock ≥ 0 enforced
- [x] deductStock/restoreStock maintain non-negative invariant

---

### T-008: Create OrderItem entity + tests

**Layer**: entities
**Domain**: order
**Depends on**: T-002
**Estimated effort**: 30min

**What to build**: `src/entities/order-item.ts` — interface + factory. Fields: id, productId, quantity, unitPrice, subtotal (computed).

**Tests to write first (TDD)**:
- [x] OrderItem with quantity ≤ 0 throws ValidationError
- [x] subtotal = quantity × unitPrice
- [x] OrderItem with quantity=2, unitPrice=10 → subtotal=20

**Acceptance criteria**:
- [x] quantity > 0 enforced
- [x] subtotal is always quantity × unitPrice

---

### T-009: Create Order aggregate root entity + tests

**Layer**: entities
**Domain**: order
**Depends on**: T-003, T-008
**Estimated effort**: 1h

**What to build**: `src/entities/order.ts` — aggregate with methods: `addItem`, `removeItem`, `submit`, `confirm`, `ship`, `deliver`, `cancel`, `recomputeTotal`. Fields: id, customerId, status, items[], total, createdAt, updatedAt.

**Tests to write first (TDD)**:
- [x] New order starts in DRAFT status
- [x] `addItem` in DRAFT appends item and recomputes total
- [x] `addItem` in PENDING throws ConflictError
- [x] `removeItem` in DRAFT removes item and recomputes total
- [x] `removeItem` in PENDING throws ConflictError
- [x] `removeItem` with unknown itemId throws NotFoundError
- [x] `submit` transitions DRAFT → PENDING
- [x] `confirm` transitions PENDING → CONFIRMED
- [x] `ship` transitions CONFIRMED → SHIPPED
- [x] `deliver` transitions SHIPPED → DELIVERED
- [x] `cancel` transitions PENDING → CANCELLED
- [x] `cancel` transitions CONFIRMED → CANCELLED
- [x] Invalid transitions throw ConflictError
- [x] Total = Σ(quantity × unitPrice) for all items

**Acceptance criteria**:
- [x] State machine enforced via OrderStatus
- [x] Items only modifiable in DRAFT
- [x] Total always equals sum of subtotals

---

### T-010: Create Payment entity + tests

**Layer**: entities
**Domain**: payment
**Depends on**: T-004
**Estimated effort**: 30min

**What to build**: `src/entities/payment.ts` — entity with methods: `markCompleted`, `markFailed`, `refund`. Fields: id, orderId, amount, status, method, createdAt.

**Tests to write first (TDD)**:
- [x] New payment starts PENDING
- [x] `markCompleted` transitions PENDING → COMPLETED
- [x] `markFailed` transitions PENDING → FAILED
- [x] `refund` transitions COMPLETED → REFUNDED
- [x] `markCompleted` on FAILED throws ConflictError

**Acceptance criteria**:
- [x] Payment state machine enforced
- [x] Entity interface matches design

---

### T-011: Create test factories

**Layer**: cross-cutting
**Domain**: cross-cutting
**Depends on**: T-009, T-010
**Estimated effort**: 30min

**What to build**: `tests/factories/` — `aUser()`, `aCustomer()`, `aProduct()`, `anOrder()`, `anOrderItem()`, `aPayment()`, `makeUserRepo()`, `makeCustomerRepo()`, `makeProductRepo()`, `makeOrderRepo()`, `makePaymentRepo()`.

**Tests to write first (TDD)**:
- [x] Each factory returns valid entity with defaults
- [x] Each mock repo has all methods as `vi.fn()`

**Acceptance criteria**:
- [x] Factories accept overrides via Partial spread
- [x] Mock repos match repository interfaces

---

## Day 2 — Repo Interfaces + In-Memory Impls + Auth/Customer/Product CRUD

### T-012: Create repository interfaces

**Layer**: use-cases
**Domain**: cross-cutting
**Depends on**: T-009, T-010
**Estimated effort**: 30min

**What to build**: `src/use-cases/interfaces/` — `user-repository.interface.ts`, `customer-repository.interface.ts`, `product-repository.interface.ts`, `order-repository.interface.ts`, `payment-repository.interface.ts`.

**Tests to write first (TDD)**:
- [x] TypeScript compiles with no errors (interfaces are type-only)

**Acceptance criteria**:
- [x] All interfaces match design signatures
- [x] All methods are async (return Promises)

---

### T-013: Create in-memory repository implementations

**Layer**: interface-adapters
**Domain**: cross-cutting
**Depends on**: T-012
**Estimated effort**: 1h

**What to build**: `src/interface-adapters/repositories/in-memory/` — one file per repo, backed by `Map<string, Entity>`.

**Tests to write first (TDD)**:
- [ ] `save` + `findById` round-trips an entity
- [ ] `findByEmail` returns correct user
- [ ] `findBySku` returns correct product
- [ ] `findAll` returns all entities
- [ ] `delete` removes entity
- [ ] `findByOrderId` returns correct payment

**Acceptance criteria**:
- [ ] All repos implement their interface
- [ ] save is upsert by id

---

### T-014: Auth DTOs + RegisterUser use case + tests

**Layer**: use-cases
**Domain**: auth
**Depends on**: T-005, T-006, T-012
**Estimated effort**: 1h

**What to build**: `src/use-cases/auth/auth.dto.ts` (RegisterInput, RegisterOutput, LoginInput, LoginOutput), `src/use-cases/auth/register.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] Register with valid data creates User + Customer and returns JWT
- [ ] Register with duplicate email throws ConflictError
- [ ] Register with password < 8 chars throws ValidationError

**Acceptance criteria**:
- [ ] Password hashed with bcrypt before save
- [ ] JWT contains userId + email, expires 24h
- [ ] Customer created with matching data

---

### T-015: LoginUser use case + tests

**Layer**: use-cases
**Domain**: auth
**Depends on**: T-014
**Estimated effort**: 30min

**What to build**: `src/use-cases/auth/login.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] Login with correct credentials returns JWT
- [ ] Login with wrong password throws UnauthorizedError
- [ ] Login with unknown email throws UnauthorizedError (same message)

**Acceptance criteria**:
- [ ] Error message doesn't distinguish email vs password failure
- [ ] JWT contains userId + email

---

### T-016: Customer DTOs + use cases (Get, Update, List) + tests

**Layer**: use-cases
**Domain**: customer
**Depends on**: T-006, T-012
**Estimated effort**: 1h

**What to build**: `src/use-cases/customer/customer.dto.ts`, `get-customer.use-case.ts`, `update-customer.use-case.ts`, `list-customers.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] GetCustomer returns customer by id
- [ ] GetCustomer with unknown id throws NotFoundError
- [ ] UpdateCustomer patches name/phone and returns updated
- [ ] UpdateCustomer with unknown id throws NotFoundError
- [ ] ListCustomers returns all customers
- [ ] ListCustomers with no data returns empty array

**Acceptance criteria**:
- [ ] All use cases use mocked repos
- [ ] DTOs don't leak internal fields

---

### T-017: Product DTOs + use cases (Create, Get, Update, List, Delete) + tests

**Layer**: use-cases
**Domain**: product
**Depends on**: T-007, T-012
**Estimated effort**: 1h

**What to build**: `src/use-cases/product/product.dto.ts`, `create-product.use-case.ts`, `get-product.use-case.ts`, `update-product.use-case.ts`, `list-products.use-case.ts`, `delete-product.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] CreateProduct with valid data returns product
- [ ] CreateProduct with duplicate SKU throws ConflictError
- [ ] CreateProduct with price ≤ 0 throws ValidationError
- [ ] GetProduct returns product by id
- [ ] GetProduct with unknown id throws NotFoundError
- [ ] UpdateProduct patches fields
- [ ] UpdateProduct with SKU conflict throws ConflictError
- [ ] ListProducts returns all
- [ ] DeleteProduct removes product
- [ ] DeleteProduct with unknown id throws NotFoundError

**Acceptance criteria**:
- [ ] All invariants from spec enforced
- [ ] DeleteProduct checks for OrderItem references (deferred to T-027 if needed)

---

## Day 3 — Order Use Cases (Create + Items + Queries)

### T-018: Order DTOs

**Layer**: use-cases
**Domain**: order
**Depends on**: T-009
**Estimated effort**: 30min

**What to build**: `src/use-cases/order/order.dto.ts` — CreateOrderInput/Output, AddItemInput, RemoveItemInput, GetOrderOutput, ListOrdersInput/Output, OrderItemDTO.

**Tests to write first (TDD)**:
- [ ] TypeScript compiles (types only)

**Acceptance criteria**:
- [ ] DTOs match design contracts
- [ ] No entity internals leaked

---

### T-019: Inventory use cases (CheckStock, DeductStock, RestoreStock) + tests

**Layer**: use-cases
**Domain**: inventory
**Depends on**: T-007, T-012
**Estimated effort**: 1h

**What to build**: `src/use-cases/inventory/check-stock.use-case.ts`, `deduct-stock.use-case.ts`, `restore-stock.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] CheckStock with sufficient stock returns ok
- [ ] CheckStock with insufficient stock throws ConflictError
- [ ] CheckStock with exact stock returns ok
- [ ] CheckStock with unknown productId throws NotFoundError
- [ ] DeductStock reduces stock per item
- [ ] DeductStock with insufficient stock throws ConflictError
- [ ] RestoreStock increases stock back

**Acceptance criteria**:
- [ ] Stock never goes negative
- [ ] Each use case operates via productRepo

---

### T-020: CreateOrder use case + tests

**Layer**: use-cases
**Domain**: order
**Depends on**: T-018, T-019
**Estimated effort**: 1h

**What to build**: `src/use-cases/order/create-order.use-case.ts`. Injects orderRepo, productRepo, checkStockUC.

**Tests to write first (TDD)**:
- [ ] Create with valid items returns DRAFT order with correct total
- [ ] Create with empty items throws ValidationError
- [ ] Create with quantity ≤ 0 throws ValidationError
- [ ] Create with unknown productId throws NotFoundError
- [ ] Create with quantity > stock throws ConflictError

**Acceptance criteria**:
- [ ] Unit prices captured at creation time
- [ ] Stock validated via injected CheckStock
- [ ] Total = Σ(quantity × unitPrice)

---

### T-021: AddItemToOrder + RemoveItemFromOrder use cases + tests

**Layer**: use-cases
**Domain**: order
**Depends on**: T-020
**Estimated effort**: 1h

**What to build**: `src/use-cases/order/add-item.use-case.ts`, `remove-item.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] AddItem to DRAFT order appends item, recalculates total
- [ ] AddItem to PENDING order throws ConflictError
- [ ] AddItem with insufficient stock throws ConflictError
- [ ] RemoveItem from DRAFT removes item, recalculates total
- [ ] RemoveItem from PENDING throws ConflictError
- [ ] RemoveItem with unknown itemId throws NotFoundError

**Acceptance criteria**:
- [ ] Items only modifiable in DRAFT
- [ ] Stock re-validated on add

---

### T-022: GetOrder + ListOrders use cases + tests

**Layer**: use-cases
**Domain**: order
**Depends on**: T-018
**Estimated effort**: 1h

**What to build**: `src/use-cases/order/get-order.use-case.ts`, `list-orders.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] GetOrder returns order for owner
- [ ] GetOrder with unknown id throws NotFoundError
- [ ] GetOrder for non-owner throws ForbiddenError
- [ ] ListOrders returns only requester's orders
- [ ] ListOrders with status filter returns matching
- [ ] ListOrders with customerId filter for another user throws ForbiddenError

**Acceptance criteria**:
- [ ] Ownership enforced via customer.userId === requesterId
- [ ] Filters work correctly

---

## Day 4 — Transitions + Payments + Cross-Domain

### T-023: Order transition use cases (Submit, Confirm, Ship, Deliver, Cancel) + tests

**Layer**: use-cases
**Domain**: order
**Depends on**: T-020, T-019
**Estimated effort**: 2h

**What to build**: `submit-order.use-case.ts`, `confirm-order.use-case.ts`, `ship-order.use-case.ts`, `deliver-order.use-case.ts`, `cancel-order.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] SubmitOrder transitions DRAFT → PENDING
- [ ] SubmitOrder on PENDING throws ConflictError
- [ ] ConfirmOrder with COMPLETED payment transitions PENDING → CONFIRMED, deducts stock
- [ ] ConfirmOrder without COMPLETED payment throws ConflictError
- [ ] ShipOrder transitions CONFIRMED → SHIPPED
- [ ] DeliverOrder transitions SHIPPED → DELIVERED
- [ ] CancelOrder from PENDING → CANCELLED (no stock restore)
- [ ] CancelOrder from CONFIRMED → CANCELLED (restores stock)
- [ ] CancelOrder from DELIVERED throws ConflictError
- [ ] All transitions enforce ownership (requesterId)

**Acceptance criteria**:
- [ ] ConfirmOrder calls paymentUC + inventoryUC
- [ ] CancelOrder calls restoreStock only when was CONFIRMED

---

### T-024: Payment DTOs + CreatePayment + GetPayment use cases + tests

**Layer**: use-cases
**Domain**: payment
**Depends on**: T-010, T-012
**Estimated effort**: 1h

**What to build**: `src/use-cases/payment/payment.dto.ts`, `create-payment.use-case.ts`, `get-payment.use-case.ts`, `process-payment.use-case.ts`, `fail-payment.use-case.ts`, `refund-payment.use-case.ts`.

**Tests to write first (TDD)**:
- [ ] CreatePayment with matching amount returns PENDING payment
- [ ] CreatePayment with mismatched amount throws ValidationError
- [ ] CreatePayment for order with existing payment throws ConflictError
- [ ] CreatePayment for unknown order throws NotFoundError
- [ ] GetPayment returns payment by orderId
- [ ] GetPayment with no payment throws NotFoundError
- [ ] ProcessPayment transitions PENDING → COMPLETED
- [ ] FailPayment transitions PENDING → FAILED
- [ ] RefundPayment transitions COMPLETED → REFUNDED

**Acceptance criteria**:
- [ ] Amount validated against order total
- [ ] One payment per order enforced

---

### T-025: RefundPayment cross-domain orchestration + tests

**Layer**: use-cases
**Domain**: cross-cutting
**Depends on**: T-023, T-024
**Estimated effort**: 1h

**What to build**: Extend `refund-payment.use-case.ts` to call cancelOrder + restoreStock after marking REFUNDED.

**Tests to write first (TDD)**:
- [ ] Refund of COMPLETED payment on CONFIRMED order → cancels order + restores stock
- [ ] Refund of COMPLETED payment on already CANCELLED order → payment REFUNDED, order stays CANCELLED
- [ ] Refund of PENDING payment throws ConflictError

**Acceptance criteria**:
- [ ] Cancel + stock restore triggered atomically
- [ ] Already-cancelled orders not double-cancelled

---

## Day 5 — Express Wiring

### T-026: DI container + env config

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: T-013, T-025
**Estimated effort**: 1h

**What to build**: `src/frameworks/config/env.ts` (fail-fast JWT_SECRET + PORT), `src/frameworks/config/di-container.ts` (buildDeps function wiring all repos + use cases + middleware).

**Tests to write first (TDD)**:
- [ ] buildDeps returns all dependencies
- [ ] Missing JWT_SECRET throws at boot

**Acceptance criteria**:
- [ ] All 30+ deps wired correctly
- [ ] Env validation is fail-fast

---

### T-027: Express app factory + error handler + auth middleware

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: T-026
**Estimated effort**: 1h

**What to build**: `src/frameworks/express/app.ts` (createApp factory), `src/frameworks/express/error-handler.ts`, `src/interface-adapters/middleware/auth.middleware.ts`, `src/frameworks/express/types.d.ts` (Request augmentation).

**Tests to write first (TDD)**:
- [ ] createApp returns Express app
- [ ] Error handler maps AppError to correct status codes
- [ ] Auth middleware rejects missing token (401)
- [ ] Auth middleware rejects invalid token (401)
- [ ] Auth middleware attaches req.user for valid token

**Acceptance criteria**:
- [ ] Error handler: ValidationError→400, Unauthorized→401, Forbidden→403, NotFound→404, Conflict→409
- [ ] Module augmentation compiles

---

### T-028: Zod schemas (all domains)

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: T-018
**Estimated effort**: 1h

**What to build**: `src/frameworks/express/schemas/` — `auth.schema.ts`, `customer.schema.ts`, `product.schema.ts`, `order.schema.ts`, `payment.schema.ts`.

**Tests to write first (TDD)**:
- [ ] Each schema parses valid input
- [ ] Each schema rejects invalid input with field-level errors

**Acceptance criteria**:
- [ ] Zod schemas match DTO contracts
- [ ] Type inference works (`z.infer`)

---

### T-029: Auth controller + routes + integration test

**Layer**: interface-adapters
**Domain**: auth
**Depends on**: T-027, T-028
**Estimated effort**: 1h

**What to build**: `src/interface-adapters/controllers/auth.controller.ts`, `src/interface-adapters/presenters/auth.presenter.ts`, routes in `src/frameworks/express/routes.ts`.

**Tests to write first (TDD)**:
- [ ] POST /auth/register → 201 with token
- [ ] POST /auth/register duplicate email → 409
- [ ] POST /auth/login → 200 with token
- [ ] POST /auth/login wrong password → 401

**Acceptance criteria**:
- [ ] Full auth round-trip works via supertest
- [ ] Presenter strips passwordHash

---

### T-030: Customer controller + routes + integration test

**Layer**: interface-adapters
**Domain**: customer
**Depends on**: T-029
**Estimated effort**: 30min

**What to build**: `src/interface-adapters/controllers/customer.controller.ts`, presenter, routes (protected).

**Tests to write first (TDD)**:
- [ ] GET /customers/:id → 200 (with auth)
- [ ] GET /customers/:id → 401 (no auth)
- [ ] PATCH /customers/:id → 200 with updated data
- [ ] GET /customers → 200 with array

**Acceptance criteria**:
- [ ] All routes protected
- [ ] Presenter formats response correctly

---

### T-031: Product controller + routes + integration test

**Layer**: interface-adapters
**Domain**: product
**Depends on**: T-029
**Estimated effort**: 30min

**What to build**: `src/interface-adapters/controllers/product.controller.ts`, presenter, routes (mix of public/protected).

**Tests to write first (TDD)**:
- [ ] POST /products → 201 (protected)
- [ ] GET /products/:id → 200 (public)
- [ ] GET /products → 200 (public)
- [ ] PATCH /products/:id → 200 (protected)
- [ ] DELETE /products/:id → 204 (protected)

**Acceptance criteria**:
- [ ] Public endpoints work without token
- [ ] Protected endpoints require token

---

### T-032: Order controller + routes + integration test

**Layer**: interface-adapters
**Domain**: order
**Depends on**: T-029
**Estimated effort**: 1h

**What to build**: `src/interface-adapters/controllers/order.controller.ts`, presenter, routes (all protected, ownership checks).

**Tests to write first (TDD)**:
- [ ] POST /orders → 201 (DRAFT)
- [ ] POST /orders/:id/items → 200
- [ ] DELETE /orders/:id/items/:itemId → 200
- [ ] PATCH /orders/:id/submit → 200 (PENDING)
- [ ] GET /orders/:id → 200 (own), 403 (other's)
- [ ] GET /orders → 200 (own only)

**Acceptance criteria**:
- [ ] Ownership enforced at controller level (forwards req.user.userId)
- [ ] All routes protected

---

### T-033: Payment controller + routes + integration test

**Layer**: interface-adapters
**Domain**: payment
**Depends on**: T-032
**Estimated effort**: 30min

**What to build**: `src/interface-adapters/controllers/payment.controller.ts`, presenter, routes.

**Tests to write first (TDD)**:
- [ ] POST /orders/:id/payment → 201 (PENDING)
- [ ] POST /orders/:id/payment mismatched amount → 400
- [ ] GET /orders/:id/payment → 200

**Acceptance criteria**:
- [ ] Payment routes protected
- [ ] Amount validated via use case

---

### T-034: Server bootstrap (server.ts)

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: T-026, T-027
**Estimated effort**: 30min

**What to build**: `src/frameworks/express/server.ts` — reads env, calls buildDeps, calls createApp, listens on PORT.

**Tests to write first (TDD)**:
- [ ] `pnpm dev` starts and responds to GET /products → 200

**Acceptance criteria**:
- [ ] Server starts without errors
- [ ] Health check or basic route responds

---

## Day 6 — Integration Tests (Lifecycle)

### T-035: Full order lifecycle integration test

**Layer**: integration
**Domain**: cross-cutting
**Depends on**: T-034
**Estimated effort**: 2h

**What to build**: `tests/integration/order.lifecycle.test.ts` — full happy path via supertest.

**Tests to write first (TDD)**:
- [ ] Register → Login → Create Product (stock=10) → Create Order → Add Item → Submit → Create Payment → Process Payment → Confirm → Ship → Deliver
- [ ] Verify order status at each step
- [ ] Verify stock deducted after confirm
- [ ] Verify total correct at each step

**Acceptance criteria**:
- [ ] Full lifecycle passes end-to-end
- [ ] Each status transition verified

---

### T-036: Cancel + refund integration tests

**Layer**: integration
**Domain**: cross-cutting
**Depends on**: T-035
**Estimated effort**: 1h

**What to build**: `tests/integration/cancel-refund.lifecycle.test.ts`.

**Tests to write first (TDD)**:
- [ ] Cancel PENDING order → stock NOT restored
- [ ] Cancel CONFIRMED order → stock restored
- [ ] Refund COMPLETED payment → order CANCELLED + stock restored
- [ ] Refund on already CANCELLED order → payment REFUNDED, order stays CANCELLED

**Acceptance criteria**:
- [ ] Stock restoration verified via GET /products/:id
- [ ] Cross-domain orchestration works end-to-end

---

### T-037: Edge case integration tests

**Layer**: integration
**Domain**: cross-cutting
**Depends on**: T-036
**Estimated effort**: 1h

**What to build**: `tests/integration/edge-cases.test.ts`.

**Tests to write first (TDD)**:
- [ ] Invalid transition (DRAFT → confirm) → 409
- [ ] Payment amount mismatch → 400
- [ ] Duplicate payment → 409
- [ ] Stock depletion → 409
- [ ] Non-owner accessing order → 403
- [ ] Expired token → 401

**Acceptance criteria**:
- [ ] All error paths return correct status codes
- [ ] Error response body matches `{ error: { code, message } }`

---

## Day 7 — Deploy

### T-038: Environment config for Render

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: T-037
**Estimated effort**: 30min

**What to build**: `render.yaml` or Render dashboard config, `.env.example`, `PORT` env binding, build/start scripts.

**Tests to write first (TDD)**:
- [ ] `pnpm build && pnpm start` starts server locally

**Acceptance criteria**:
- [ ] Build succeeds
- [ ] Server starts on Render's PORT

---

### T-039: Deploy + smoke test

**Layer**: frameworks
**Domain**: cross-cutting
**Depends on**: T-038
**Estimated effort**: 1h

**What to build**: Deploy to Render free tier. Smoke test script/checklist.

**Tests to write first (TDD)**:
- [ ] GET /products → 200 on live URL
- [ ] POST /auth/register → 201 on live URL
- [ ] Full lifecycle on live URL

**Acceptance criteria**:
- [ ] Live URL responds correctly
- [ ] No startup errors in Render logs

---

### T-040: README with setup instructions

**Layer**: cross-cutting
**Domain**: cross-cutting
**Depends on**: T-039
**Estimated effort**: 30min

**What to build**: `README.md` — architecture overview, setup, scripts, API endpoints, deploy info.

**Tests to write first (TDD)**:
- [ ] README exists and is accurate

**Acceptance criteria**:
- [ ] Setup instructions work from scratch
- [ ] All endpoints documented

---

## Review Workload Forecast

- **Total estimated changed lines**: ~3500–4500 (greenfield, 6 domains, 80+ files, ~40 tasks)
- **Chained PRs recommended**: Yes
- **400-line budget risk**: High
- **Decision needed before apply**: Yes
- **Chained PRs recommended**: Yes
- **Chain strategy**: pending (user decides)
- **400-line budget risk**: High

### Suggested PR Split

| PR | Days | Tasks | Estimated Lines | Commit boundary |
|----|------|-------|-----------------|-----------------|
| PR 1 | Day 1–2 | T-001 → T-017 | ~1200 | Entities + repos + auth/customer/product UCs — all unit tests green |
| PR 2 | Day 3–4 | T-018 → T-025 | ~1000 | Order + payment + inventory UCs — all unit tests green |
| PR 3 | Day 5 | T-026 → T-034 | ~800 | Express wiring — all integration tests green |
| PR 4 | Day 6–7 | T-035 → T-040 | ~500 | Lifecycle tests + deploy + README |

Each PR is independently testable and rollback-safe. PR 1+2 have no HTTP surface (pure unit tests). PR 3 adds the HTTP layer. PR 4 adds lifecycle verification and deploy.
