# AGENTS.md — Backend Lab

Multi-project backend learning lab with four completed experiments and one active project.

## Active project: `blogging-platform-api/`

**Stack**: TypeScript 6.0, Express 5, MongoDB driver 7 (native — no Mongoose), Zod 4, Vitest 4, pnpm.

### Architecture

Hexagonal (Ports & Adapters). Every dependency points inward:

```
src/adapters/inbound/   — controllers, middlewares, routes (mostly scaffolding)
src/adapters/outbound/  — MongoDB connection, MongoDB PostRepository
src/application/services/ — PostService (wired via constructor DI)
src/ports/entities/     — Post interface
src/ports/repositories/ — PostRepository interface
src/ports/errors/       — PostNotFound domain error
src/shared/             — types/, utils/ (both empty)
src/tests/unit/         — 1 test exists (PostService.create)
src/tests/integration/  — empty
src/tests/e2e/          — empty
```

Inbound layers (controllers, middlewares, routes) are empty scaffolding. The app entrypoint `src/index.ts` only initializes MongoDB + repo and logs "Hello World" — no Express server wired yet.

### TypeScript quirks (tripwires)

- **`verbatimModuleSyntax: true`** → must use `import type` for type-only imports. Runtime imports omit `type`.
- **`module: nodenext`** → all relative imports MUST include `.js` extension (`./foo.js`, not `./foo`). This applies to imports from `.ts` files too.
- **`noUncheckedIndexedAccess: true`** → array and object index access returns `T | undefined`.
- **`exactOptionalPropertyTypes: true`** → `undefined` is not implicitly allowed for optional properties; set explicitly if needed.
- **No linter configured**, **no formatter configured**. No `ts-standard`, no Prettier, no ESLint.

### Commands

| What | How |
|------|-----|
| Dev server | `pnpm dev` (tsx watch) |
| Build | `pnpm build` (tsc → dist/) |
| Start built | `pnpm start` |
| Test (all) | `pnpm test` (vitest) |
| Test connection | `pnpm test:connection` |
| Single test run | `pnpm test -- src/tests/unit/services/post.service.test.ts` |

### Testing

- **Vitest 4** with `globals: true` (describe/it/expect available without import, but existing test imports `{ expect, vi }` from vitest anyway).
- **Environment**: `node` (not jsdom).
- Tests are co-located in `src/tests/unit/`, structured by module (`services/`).
- Mock via `vi.fn()` directly on stub objects (see `post.service.test.ts` for pattern).
- Integration and E2E test directories exist but are empty.

### MongoDB

- **MongoDB Atlas** (cloud) via native driver. No Mongoose, no ORM.
- Connection in `src/adapters/outbound/database/mongodb.ts`.
- **`.env` contains real Atlas credentials** — never commit, never paste in prompts. The file is in `.gitignore`.
- Repository implements $regex-based search for `findAll(term)`. Indexes on `category: 1` and `createdAt: -1`.

### SDD workflow

`openspec/config.yaml` has `strict_tdd: true`. Project-specific skills live in `.agents/skills/` (nodejs-backend-patterns, vitest, zod, etc.). Skill registry at `.atl/skill-registry.md`.

## Completed projects (read-only references)

| Project | Stack | Structure |
|---------|-------|-----------|
| `async-api/` | Python FastAPI, async SQLAlchemy, SQLModel | MVC: views/ → controllers/ → models/ |
| `expense-tracker-api/` | Python FastAPI, sync SQLAlchemy, JWT | Layered modules: auth/, expenses/, database/ |
| `express-typescript-api/` | Express, vanilla TS | Routes → services, runtime DTO parsing |
| `auth-flow/` | Express, EJS, JWT cookies | Monolithic index.js, user-repository, EJS views |

`exercices/`, `oop-library/`, `github-activity-cli/`, `task-tracker-cli/` are smaller standalone experiments.

## Git

- Two branches: `main` (legacy projects) and `blogging-platform-api` (active work).
- No CI, no pre-commit hooks, no GitHub Actions.
- **Root `.gitignore** covers `dist/`, `node_modules/`, `.atl/`, `.pi`, `.env`. Subproject `.gitignore` in blogging-platform-api additionally ignores `.pi-lens/`.
- `dist/` exists on disk but is gitignored at root (was tracked before the pattern was added).
