# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger                   | Skill                     | Path                                              |
| ------------------------- | ------------------------- | ------------------------------------------------- |
| TypeScript code           | typescript                | ~/.config/opencode/skills/typescript/SKILL.md     |
| Vitest tests              | vitest                    | .agents/skills/vitest/SKILL.md                    |
| oxlint usage              | oxlint                    | .agents/skills/oxlint/SKILL.md                    |
| TypeScript advanced types | typescript-advanced-types | .agents/skills/typescript-advanced-types/SKILL.md |
| Node.js backend           | nodejs-backend-patterns   | .agents/skills/nodejs-backend-patterns/SKILL.md   |
| Node.js best practices    | nodejs-best-practices     | .agents/skills/nodejs-best-practices/SKILL.md     |
| PR creation               | branch-pr                 | ~/.config/opencode/skills/branch-pr/SKILL.md      |
| Issue creation            | issue-creation            | ~/.config/opencode/skills/issue-creation/SKILL.md |
| Chained/stacked PRs       | gentle-ai-chained-pr      | ~/.config/opencode/skills/chained-pr/SKILL.md     |

## Compact Rules

### typescript

- Use const object + typeof for union types (single source of truth)
- Flat interfaces, no inline nested objects
- Never use `any` — use `unknown` or generics instead
- Use `import type` for type-only imports
- Utility types: Pick, Omit, Partial, Record

### vitest

- `test()` / `it()` for test blocks, `describe()` for grouping
- `expect()` with Jest-compatible matchers
- `vi.fn()` for mocking, `vi.spyOn()` for object methods
- `beforeEach()` / `afterEach()` for setup/teardown
- Filter with `--grep` or test name patterns
- Coverage via `vitest --coverage`

### oxlint

- Run after changes: `oxlint .`
- No config file needed (sensible defaults)
- Integrates with TypeScript and ESM

### nodejs-backend-patterns

- Express/Fastify for HTTP servers
- Middleware for cross-cutting concerns
- Error handling with custom error classes
- Auth via JWT or similar
- ORM/DB integration with repository pattern

### nodejs-best-practices

- Async/await for all async operations
- Security first: validate input, sanitize queries
- Graceful shutdown handling
- Environment-based config (no hardcoded values)

## Project Conventions

No convention files found in project root.

## Next Steps

The orchestrator reads this registry once per session and passes pre-resolved skill paths to sub-agents via their launch prompts.
