# Exploration: order-management-api

## Exploration: order-management-api

### Current State

Greenfield project in `/home/nachosag/dev/backend-lab/clean-architecture/`. No code exists yet. The user wants to practice Uncle Bob's Clean Architecture with an order management domain. They previously built `blogging-platform-api/` using Hexagonal (Ports & Adapters) architecture, so they have experience with dependency inversion and boundary interfaces, but Clean Architecture adds stricter layer boundaries and the "screaming architecture" principle where the project structure reflects the domain, not the framework.

### Affected Areas

This is a greenfield project, so all areas are new:

- `src/entities/` — Domain entities with encapsulated business rules (Order, OrderItem, Product, Customer)
- `src/use-cases/` — Application business rules (create order, transition state, cancel)
- `src/interface-adapters/` — Controllers, presenters, repository interfaces
- `src/frameworks/` — Express server, in-memory DB, file-based storage
- `tests/` — Layered tests matching Clean Architecture boundaries

### Approaches

1. **Pure Clean Architecture (Uncle Bob strict)** — Four concentric layers with strict dependency rule (inner layers know nothing of outer layers)
   - Pros: Maximum separation of concerns, easiest to test, domain is completely framework-agnostic
   - Cons: More boilerplate, steeper learning curve, can feel over-engineered for a small project
   - Effort: Medium

2. **Clean-ish Architecture (pragmatic variant)** — Same layers but allow DTOs to cross boundaries more freely, use framework types in outer layers only
   - Pros: Less ceremony, still testable, faster to build
   - Cons: Slightly weaker boundaries, easier to leak framework code inward
   - Effort: Low

### Recommendation

**Approach 1 (Pure Clean Architecture)** — Because the user's explicit goal is to *practice* Clean Architecture, not to ship fast. The 2-3 day timebox is perfect for learning the strict form. If they wanted pragmatic, they'd already be doing it. The strict version teaches the discipline that makes the pragmatic version work later.

Key differences from Hexagonal (Ports & Adapters) they already know:
- **Hexagonal** says "inside is application logic, outside is adapters" — two layers.
- **Clean Architecture** says "inside is enterprise business rules (entities), next ring is application business rules (use cases), next is interface adapters, outer ring is frameworks" — four layers.
- In Hexagonal, the domain model is often anemic — just data structures with validation in services.
- In Clean Architecture, **Entities encapsulate business rules** — an Order knows it cannot transition from `SHIPPED` to `PENDING`. That rule lives in the entity, not a service.

### Domain Analysis

**Core Entities:**

- **Order** — Central aggregate. Has status, items, total, customer reference, timestamps.
- **OrderItem** — Child of Order. Product reference, quantity, unit price, subtotal.
- **Product** — Standalone entity (could be a value object if simple). SKU, name, price, stock.
- **Customer** — Standalone entity. Name, email (for now; auth out of scope).

**Business Rules / Invariants (these belong in Entities):**

- An Order must have at least one item.
- Order total must equal sum of item subtotals.
- Order status transitions are state-machine governed:
  - `DRAFT` → `PENDING` (submit)
  - `PENDING` → `CONFIRMED` (confirm)
  - `PENDING` → `CANCELLED` (cancel)
  - `CONFIRMED` → `SHIPPED` (ship)
  - `CONFIRMED` → `CANCELLED` (cancel)
  - `SHIPPED` → `DELIVERED` (deliver)
  - No other transitions are valid.
- A cancelled order cannot be modified.
- Item quantity must be > 0.

**Use Cases (Application Business Rules):**

1. `CreateOrder` — Create a new draft order with items.
2. `AddItemToOrder` — Add a product to an existing draft order.
3. `RemoveItemFromOrder` — Remove an item from a draft order.
4. `SubmitOrder` — Transition draft → pending.
5. `ConfirmOrder` — Transition pending → confirmed.
6. `ShipOrder` — Transition confirmed → shipped.
7. `DeliverOrder` — Transition shipped → delivered.
8. `CancelOrder` — Transition pending/confirmed → cancelled.
9. `GetOrder` — Retrieve order by ID.
10. `ListOrders` — List orders with optional filters (status, customer).

### Layer Mapping

```
src/
├── entities/                  # Enterprise business rules (innermost)
│   ├── order.ts                 # Order aggregate root — knows status transitions
│   ├── order-item.ts            # OrderItem value object/entity
│   ├── product.ts               # Product entity
│   ├── customer.ts              # Customer entity
│   └── order-status.ts          # State machine logic + const types
│
├── use-cases/                   # Application business rules
│   ├── create-order/
│   │   ├── create-order.use-case.ts
│   │   └── create-order.dto.ts  # Input/output DTOs live WITH the use case
│   ├── add-item-to-order/
│   │   ├── add-item-to-order.use-case.ts
│   │   └── add-item-to-order.dto.ts
│   ├── transition-order-status/
│   │   ├── submit-order.use-case.ts
│   │   ├── confirm-order.use-case.ts
│   │   ├── ship-order.use-case.ts
│   │   ├── deliver-order.use-case.ts
│   │   ├── cancel-order.use-case.ts
│   │   └── transition-order.dto.ts
│   ├── get-order/
│   │   ├── get-order.use-case.ts
│   │   └── get-order.dto.ts
│   ├── list-orders/
│   │   ├── list-orders.use-case.ts
│   │   └── list-orders.dto.ts
│   └── interfaces/              # Repository interfaces (gateways) — use cases DEPEND on these
│       ├── order-repository.interface.ts
│       ├── product-repository.interface.ts
│       └── customer-repository.interface.ts
│
├── interface-adapters/          # Controllers, presenters, repository implementations
│   ├── controllers/             # Express controllers — HTTP in
│   │   ├── order.controller.ts
│   │   └── dto/                 # Request/response DTOs (Zod schemas here)
│   ├── presenters/              # Format output for HTTP response
│   │   └── order.presenter.ts
│   └── repositories/            # Concrete implementations
│       ├── in-memory/
│       │   ├── in-memory-order.repository.ts
│       │   ├── in-memory-product.repository.ts
│       │   └── in-memory-customer.repository.ts
│       └── file-based/          # Optional later
│
└── frameworks/                    # Express, config, main.ts
    ├── express/
    │   ├── app.ts
    │   ├── routes.ts
    │   └── server.ts
    └── config/
        └── database.ts          # In-memory store singleton
```

### Dependency Rule

Dependencies point INWARD only:

- `frameworks` → `interface-adapters` → `use-cases` → `entities`
- `use-cases` knows about `entities`, but NOT about Express, NOT about in-memory repo implementation.
- `use-cases` depends on repository **interfaces** (defined in `use-cases/interfaces/`).
- `interface-adapters` implements those interfaces.
- **DTOs**: Input/output DTOs live in the use case folder (e.g., `create-order.dto.ts`). These are plain objects — no framework types, no ORM decorators. The controller translates HTTP request body into a use-case DTO. The presenter translates use-case output into HTTP response.

### Validation Strategy

- **Zod** for boundary validation (request body in controllers).
- **Entity constructors/methods** enforce business invariants (e.g., `order.submit()` throws if already cancelled).
- Two layers of validation:
  1. Zod: Is the request structurally valid? (string, number, UUID format)
  2. Entity: Is the business operation allowed? (status transition valid, stock available)

### Repository Pattern

- Repository **interfaces** live in `use-cases/interfaces/` because use cases need to declare what they need.
- Repository **implementations** live in `interface-adapters/repositories/`.
- For this project, start with **in-memory** implementations. They implement the same interfaces, so swapping to Postgres later requires zero use-case changes.

### Scope Recommendation (2-3 Day Slice)

**Day 1 — Entities + Core Use Cases + Tests:**
- Build Order, OrderItem, Product, Customer entities with full business rules.
- Build `CreateOrder`, `GetOrder`, `ListOrders` use cases.
- Write unit tests for entities (pure, fast) and use cases (with mocked repos).

**Day 2 — State Transitions + Remaining Use Cases + Tests:**
- Build all transition use cases (submit, confirm, ship, deliver, cancel).
- Add `AddItemToOrder`, `RemoveItemFromOrder`.
- Write tests for transitions and edge cases.

**Day 3 — Express Wiring + Integration Tests:**
- Wire Express controllers, routes.
- Connect in-memory repositories.
- Write integration tests (Supertest hitting real endpoints with in-memory DB).

**Out of this initial slice:**
- File-based persistence (can swap in-memory → file-based in an afternoon later).
- Customer CRUD (assume customers exist or are created out-of-band for now).
- Product CRUD (same — seed a few products manually).
- Auth, payment, inventory, notifications.

### Testing Strategy

| Layer | What to Test | Tools | Approach |
|---|---|---|---|
| **Entities** | Business rules, invariants, state transitions | Vitest | Pure unit — instantiate, call methods, assert. No mocks needed. |
| **Use Cases** | Orchestration logic, repository calls, error paths | Vitest + `vi.fn()` | Unit with mocked repositories. Test "given order exists, when confirmed, then repo.save called with CONFIRMED status." |
| **Interface Adapters** | HTTP request handling, DTO translation, response formatting | Vitest + Supertest | Integration — spin up Express app with in-memory repos, hit endpoints, assert response. |
| **Frameworks** | Wiring, config, server startup | Manual / smoke test | Verify app boots and routes respond. |

Key TDD principle: Write entity tests first (they have no dependencies), then use-case tests (mock the repos), then integration tests (wire everything). Vertical slices, not horizontal.

### Risks

- **Boilerplate fatigue**: Clean Architecture has more files than MVC. The user needs to feel the win (testability, swap-able DB) or they'll abandon it.
- **Anemic domain trap**: Easy to put status transition logic in use cases instead of entities. Must enforce that entities own their rules.
- **DTO proliferation**: Many small DTO files. Need clear naming convention.
- **In-memory persistence limits**: No real persistence means integration tests are fast but don't validate real DB behavior. Acceptable for learning, but should be called out.
- **Over-scoping**: 10 use cases in 3 days is tight if the user writes every line by hand. The scope above is aggressive but doable if they stay focused.

### Ready for Proposal

**Yes.** The domain is clear, the layers are mapped, the scope is bounded. The next step is a formal SDD Proposal that locks the scope to the Day 1-3 slice above, selects the in-memory repository as the initial gateway, and confirms the testing strategy.
