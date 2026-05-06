# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When writing TypeScript code | typescript | /home/nachosag/.config/opencode/skills/typescript/SKILL.md |
| When using Zod for validation | zod-4 | /home/nachosag/.config/opencode/skills/zod-4/SKILL.md |
| When managing React state with Zustand | zustand-5 | /home/nachosag/.config/opencode/skills/zustand-5/SKILL.md |
| When styling with Tailwind | tailwind-4 | /home/nachosag/.config/opencode/skills/tailwind-4/SKILL.md |
| When writing React components | react-19 | /home/nachosag/.config/opencode/skills/react-19/SKILL.md |
| When writing Python tests | pytest | /home/nachosag/.config/opencode/skills/pytest/SKILL.md |
| When writing E2E tests | playwright | /home/nachosag/.config/opencode/skills/playwright/SKILL.md |
| When implementing a change | work-unit-commits | /home/nachosag/.config/opencode/skills/work-unit-commits/SKILL.md |
| When creating GitHub issues | issue-creation | /home/nachosag/.config/opencode/skills/issue-creation/SKILL.md |
| When creating a pull request | branch-pr | /home/nachosag/.config/opencode/skills/branch-pr/SKILL.md |
| When drafting review comments | comment-writer | /home/nachosag/.config/opencode/skills/comment-writer/SKILL.md |
| When writing documentation | cognitive-doc-design | /home/nachosag/.config/opencode/skills/cognitive-doc-design/SKILL.md |
| When planning chained PRs | gentle-ai-chained-pr | /home/nachosag/.config/opencode/skills/chained-pr/SKILL.md |
| When doing adversarial review | judgment-day | /home/nachosag/.config/opencode/skills/judgment-day/SKILL.md |
| When creating new AI skills | skill-creator | /home/nachosag/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### typescript
- Const Types Pattern (REQUIRED): Create const object first, then extract type. NEVER direct union types.
- Flat Interfaces: One level depth, nested objects → dedicated interface. NEVER inline nested objects.
- NEVER use `any`. Use `unknown` for truly unknown types, generics for flexible types.
- Use `import type` for type-only imports, `import { foo, type Config }` for mixed.
- Use type guards (`value is Type`) for runtime type checking.

### zod-4
- Breaking from Zod 3: Use `z.email()`, `z.uuid()`, `z.url()` instead of `.email()`, `.uuid()`, `.url()` on string.
- Error handling: Use `error` param instead of `message` for custom errors.
- Use `z.infer<typeof schema>` to extract TypeScript types from schemas.
- Prefer `safeParse` over `parse` for handling validation errors gracefully.
- Use discriminated unions (`z.discriminatedUnion`) for efficient union handling.

### vitest
- Use Vitest for testing (test runner available via `vitest`).
- Use `describe`/`test` blocks, `expect` for assertions.
- Use `vi.fn()` for mocking, `vi.mock()` for module mocking.
- Use `beforeEach`/`afterEach` for setup/teardown.

### oxlint
- Use `oxlint` for linting (available via npm).
- Use `oxlint --fix` to auto-fix issues.
- Use `oxfmt` for formatting.

### zod (project-level)
- Use Zod 4 for schema validation.
- Follow zod-4 compact rules above.

### nodejs-best-practices
- Follow Node.js backend patterns for server-side TypeScript.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| Skill | .agents/skills/vitest/SKILL.md | Project-level Vitest skill |
| Skill | .agents/skills/zod/SKILL.md | Project-level Zod skill |
| Skill | .agents/skills/vitest/GENERATION.md | Generated skill metadata |
| Config | package.json | npm scripts: test, lint, fmt, build |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.