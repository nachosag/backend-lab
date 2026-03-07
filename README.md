# Backend Lab

A multi-project backend laboratory that implements and contrasts four API styles: an async FastAPI MVC service, a layered expense tracker with JWT auth, an Express + TypeScript validation-focused API, and an Express session/cookie auth flow.

## Overview

This repository is a deliberate engineering sandbox for backend design decisions rather than a single deployable product. Each subproject was built to solve a different backend concern:

- **`async-api`**: demonstrate end-to-end asynchronous request handling with `FastAPI`, async SQLAlchemy sessions, and SQLModel entities.
- **`expense-tracker-api`**: implement a realistic domain workflow (auth + expenses) using layered architecture, token-based authorization, and database seeding.
- **`express-typescript-api`**: show TypeScript-driven request validation and safe DTO construction in a minimal Express service.
- **`auth-flow`**: model cookie-based session handling and JWT verification middleware in Express with lightweight local persistence.

The project is aimed at engineers learning trade-offs between architecture patterns, sync vs async data access, authentication mechanisms, and testing strategies across Python and Node.js stacks.

## Key Features

- **Asynchronous CRUD API with relation loading** (`async-api`), including user/post relationships and async integration tests.
- **JWT authentication with OAuth2 password flow** (`expense-tracker-api`) and protected per-user expense operations.
- **Domain-level constraints and startup seeding** (`expense-tracker-api`) via enum-backed categories and idempotent bootstrap logic.
- **Runtime input parsing to typed domain objects** (`express-typescript-api`) before persistence-like operations.
- **Cookie-backed session restoration middleware** (`auth-flow`) that decodes JWT on every request and exposes a consistent `req.session` contract.
- **Automated test coverage focused on API behavior** in both Python projects (`pytest`, `pytest-asyncio`, and FastAPI `TestClient`/`httpx`).

## Architecture

The repository follows a **modular monorepo layout**, where each folder is an independent backend experiment.

### 1) `async-api` (Async MVC / layered)

- **`app/views/`**: HTTP layer (`APIRouter`) with status codes and schema-bound responses.
- **`app/controllers/`**: orchestration layer that delegates use-cases to data models.
- **`app/models/`**: persistence/query layer with SQLModel + async SQLAlchemy session usage.
- **`app/schemas/`**: request/response DTOs and partial update contracts.
- **`app/database.py` + `app/main.py`**: engine/session lifecycle and startup table creation through FastAPI lifespan hooks.

Interaction path: **Route -> Controller -> Model -> DB session**, with exceptions mapped in the view layer.

### 2) `expense-tracker-api` (Layered modules by domain)

- **`src/modules/auth/`**: signup/login, password hashing, token generation and decoding.
- **`src/modules/expenses/`**: expense CRUD, date-range filtering, user-scoped access control.
- **`src/database/`**: SQLModel entities, engine/session dependencies, lifecycle seeding of categories.
- **`src/routers.py`**: composition root wiring auth and expense modules.

Interaction path: **Router -> Service -> SQLModel session**, with dependency injection for both DB sessions and bearer tokens.

### 3) `express-typescript-api` (Minimal service + runtime validation)

- **`src/routes/`**: HTTP endpoints.
- **`src/services/`**: in-memory/JSON-backed business operations.
- **`src/utils.ts`**: parser/guards converting untyped request bodies into `NewDiaryEntry` safely.

### 4) `auth-flow` (Express auth flow prototype)

- **`index.js`**: app bootstrap, middleware chain, login/register/logout/protected routes.
- **`user-repository.js`**: user creation/login with validation and bcrypt hashing.
- **`views/`**: EJS templates used to test protected UI flow.

## Tech Stack

- **Languages**: Python 3.12+, TypeScript, JavaScript.
- **Frameworks**:
  - FastAPI (high-performance API development + dependency injection).
  - Express 5 (lightweight routing/middleware composition).
- **Data / ORM**:
  - SQLModel + SQLAlchemy (`async-api` async sessions, `expense-tracker-api` sync sessions).
  - SQLite as local development/testing datastore.
  - `db-local` for file-based persistence in `auth-flow`.
- **Auth / Security**:
  - JWT (`python-jose` and `jsonwebtoken`).
  - OAuth2 password bearer flow in FastAPI.
  - `passlib`/`bcrypt` password hashing.
  - HTTP-only cookies for browser session continuity.
- **Testing & Quality**:
  - `pytest`, `pytest-asyncio`, FastAPI `TestClient`, `httpx` ASGI transport.
  - TypeScript linting/tooling via `ts-standard` and `ts-node-dev`.

## Notable Implementation Details

- **FastAPI lifespan-driven infrastructure bootstrapping**: both Python APIs initialize schema/tables during startup, reducing manual setup drift.
- **Environment-aware DB dependency switching** (`async-api`): test mode routes dependencies to a separate test database manager.
- **Relation loading strategy** (`async-api`): `selectinload` plus explicit post query for user-with-posts retrieval, showing intentional control over related data hydration.
- **User-level authorization boundary** (`expense-tracker-api`): expense queries always include `user_id` from decoded JWT claims, preventing cross-user data access.
- **Idempotent reference-data seeding** (`expense-tracker-api`): category enums are inserted only when absent, making repeated startups safe.
- **Partial update handling** in both Python APIs: updates rely on `exclude_unset`/`exclude_none` to avoid accidental null-overwrites.
- **DTO sanitization pattern** (`express-typescript-api`): `toNewDiaryEntry` enforces runtime checks for enums/date/string before accepting data into service logic.

## How to Run the Project

Because this is a multi-project lab, run each service independently.

### `async-api`

```bash
cd async-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Run tests:

```bash
pytest
```

### `expense-tracker-api`

```bash
cd expense-tracker-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# configure .env with DATABASE_URL, TEST_DATABASE_URL, KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
fastapi dev src/main.py
```

Run tests:

```bash
pytest
```

### `express-typescript-api`

```bash
cd express-typescript-api
pnpm install
pnpm dev
```

Optional build:

```bash
pnpm tsc
pnpm start
```

### `auth-flow`

```bash
cd auth-flow
pnpm install
pnpm dev
```

## Example Usage

Example flow for `expense-tracker-api`:

```bash
# 1) Sign up
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"secret123","name":"Dev"}'

# 2) Login (OAuth2 password form)
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=dev@example.com&password=secret123"

# 3) Create expense (replace TOKEN)
curl -X POST http://localhost:8000/expenses/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category_id":1,"amount":42.5,"description":"Groceries","spent_at":"2025-01-15"}'
```

## Project Structure

```text
backend-lab/
├── async-api/
│   ├── app/
│   │   ├── views/           # FastAPI routes
│   │   ├── controllers/     # application orchestration
│   │   ├── models/          # SQLModel query/data layer
│   │   ├── schemas/         # request/response DTOs
│   │   └── database.py      # async engine/session managers
│   └── tests/               # async unit + integration tests
├── expense-tracker-api/
│   └── src/
│       ├── modules/
│       │   ├── auth/        # signup/login/JWT services
│       │   └── expenses/    # expense CRUD + filtering
│       ├── database/        # models, session dependency, startup seeding
│       └── routers.py       # module wiring
├── express-typescript-api/
│   └── src/
│       ├── routes/          # Express endpoints
│       ├── services/        # diary business logic + dataset
│       └── utils.ts         # runtime request parsing/validation
└── auth-flow/
    ├── index.js             # middleware and auth routes
    ├── user-repository.js   # persistence + credential verification
    └── views/               # EJS pages for auth flow
```

## Future Improvements

- Add **cross-project consistency** for tooling (shared formatting/lint/test standards).
- Introduce **containerized local environments** (Docker Compose with per-service profiles).
- Add **centralized observability patterns** (structured logging + request correlation IDs).
- Expand `expense-tracker-api` with **refresh tokens, RBAC, and pagination**.
- Refine `async-api` relation loading to reduce duplicate query work in user-post retrieval.
- Add CI pipelines that run Python and Node suites in parallel with quality gates.

## Author

Developed as a backend engineering portfolio lab to document practical architecture trade-offs across Python and Node ecosystems.
