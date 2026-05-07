# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | ~/.config/opencode/skills/branch-pr/SKILL.md |
| When a PR would exceed 400 changed lines, when planning chained PRs, stacked PRs, or reviewable slices | chained-pr | ~/.config/opencode/skills/chained-pr/SKILL.md |
| When writing guides, READMEs, RFCs, onboarding docs, architecture docs, or review-facing documentation | cognitive-doc-design | ~/.config/opencode/skills/cognitive-doc-design/SKILL.md |
| When drafting or posting feedback, review comments, maintainer replies, Slack messages, or GitHub comments | comment-writer | ~/.config/opencode/skills/comment-writer/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | ~/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | ~/.config/opencode/skills/judgment-day/SKILL.md |
| When implementing a change, preparing commits, splitting PRs, or planning chained or stacked PRs | work-unit-commits | ~/.config/opencode/skills/work-unit-commits/SKILL.md |

## Project Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When defining Zod schemas, using safeParse, z.infer, or validation error handling | zod | .agents/skills/zod/SKILL.md |
| When building REST APIs with Express, implementing middleware chains, routing, or error handling | nodejs-express-server | .agents/skills/nodejs-express-server/SKILL.md |
| When creating Node.js servers, REST/GraphQL APIs, microservices, middleware, auth, or database integration | nodejs-backend-patterns | .agents/skills/nodejs-backend-patterns/SKILL.md |
| When implementing complex type logic, generics, conditional/mapped types, or type-safe API clients | typescript-advanced-types | .agents/skills/typescript-advanced-types/SKILL.md |
| When making Node.js architecture decisions, choosing frameworks, designing async patterns, or applying security | nodejs-best-practices | .agents/skills/nodejs-best-practices/SKILL.md |
| When writing tests, mocking, configuring coverage, or working with test filtering and fixtures | vitest | .agents/skills/vitest/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### branch-pr
- Every PR MUST link an approved issue with `status:approved` label — no exceptions
- Every PR MUST have exactly one `type:*` label
- Automated checks must pass before merge is possible
- Branch naming: `type/description` (e.g., `feat/add-auth`, `fix/typo-header`)
- Use PR template and run shellcheck on modified scripts

### chained-pr
- MUST split when a PR exceeds 400 changed lines unless maintainer-approved `size:exception`
- Design each PR for approximately ≤60-minute human review
- Every chained PR MUST state where it starts, where it ends, what came before, what comes next
- Every chained PR MUST be understandable and verifiable on its own
- One deliverable work unit per PR; do not mix unrelated refactors, features, tests, or docs
- Include dependency diagram marking the current PR
- In Feature Branch Chain, child PRs target the immediate previous PR branch

### cognitive-doc-design
- Lead with the answer — put decision, action, or outcome first; context comes after
- Progressive disclosure: start with happy path, then add details, edge cases, references
- Chunking: group related info into small sections, keep flat lists short
- Signposting: use headings, labels, callouts, summaries so readers know where they are
- Recognition over recall: prefer tables, checklists, examples, templates over prose
- Design docs so reviewers can verify intent without reconstructing the whole story

### comment-writer
- Start with the actionable point, do not recap the whole PR before feedback
- Sound like a thoughtful teammate, not a corporate bot
- Prefer 1-3 short paragraphs or a tight bullet list
- Give the technical reason when asking for a change
- Match thread language; use Rioplatense Spanish/voseo for Spanish
- No em dashes — use commas, periods, or parentheses

### issue-creation
- Blank issues are disabled — MUST use a template (bug report or feature request)
- Every issue gets `status:needs-review` automatically on creation
- A maintainer MUST add `status:approved` before any PR can be opened
- Search existing issues for duplicates before creating
- Questions go to Discussions, not issues

### judgment-day
- Launch TWO sub-agents via delegate (async, parallel — never sequential)
- Each agent receives the same target but works independently; neither knows about the other
- Synthesize findings from both judges, apply fixes, then re-judge
- Escalate after 2 iterations if both judges do not pass
- Always resolve skill registry first and inject project standards into both judge prompts

### work-unit-commits
- A commit represents a deliverable behavior, fix, migration, or docs unit — NOT file-type batches
- Keep tests with code — tests belong in the same commit as the behavior they verify
- Keep docs with the user-visible change
- A reviewer should understand why each commit exists from its diff and message
- Each commit should be a candidate chained PR when the change grows
- If SDD tasks forecast >400-line change, group commits into chained PR slices before implementation

### zod
- Use z.unknown() instead of z.any() for type safety
- Validate at system boundaries — never trust JSON.parse output
- Use safeParse() for user input, parse() for trusted internal data
- Use z.infer instead of manual types; distinguish z.input from z.infer for transforms
- Apply string validations at schema definition
- Use enums for fixed string values, coercion for form/query data
- Handle ALL validation issues not just the first one
- Use flatten() for form error display, issue.path for nested errors
- Use partial() for update schemas, pick/omit for variants, extend() for composition
- Distinguish optional() from nullable()
- Return false instead of throwing in refine
- Cache schema instances, avoid dynamic creation in hot paths

### nodejs-express-server
- Use middleware for cross-cutting concerns, not in route handlers
- Implement proper error handling with centralized error middleware
- Validate input data before processing
- Use async/await for async operations, avoid callback hell
- Use environment variables for configuration, never hardcode secrets
- Add logging and monitoring
- Implement rate limiting and HTTPS in production
- Keep route handlers focused and small
- Don't handle errors silently or expose stack traces in production

### nodejs-backend-patterns
- Use layered architecture: Controllers → Services → Repositories
- Use dependency injection for easier testing and maintenance
- Implement custom error classes (AppError, ValidationError, NotFoundError, etc.)
- Catch errors at top level with global error handler middleware
- Use asyncHandler wrapper to avoid try/catch in every controller
- Validate input with Zod or similar; never trust client input
- Use connection pooling for databases
- Implement graceful shutdown to clean up resources
- Use structured logging (Pino, Winston)
- Don't leak error details in production

### typescript-advanced-types
- Use `unknown` over `any` — enforce type checking
- Prefer `interface` for object shapes, `type` for unions and complex types
- Leverage type inference — let TypeScript infer when possible
- Use const assertions to preserve literal types
- Avoid type assertions — use type guards instead
- Use discriminated unions for type narrowing with switch statements
- Create helper types and reusable type utilities
- Document complex types with JSDoc comments
- Enable strict mode — all strict compiler options
- Avoid deeply nested conditional types — can slow down compilation

### nodejs-best-practices
- Choose framework based on CONTEXT, not default
- Use layered architecture for growing projects
- Validate all inputs at system boundaries
- Use environment variables for secrets only
- Profile before optimizing
- Use async/await for sequential, Promise.all for parallel operations
- Never use sync methods in production (fs.readFileSync, etc.)
- Offload CPU-intensive work to worker threads
- Fail fast on validation with clear error messages
- Trust nothing — validate query params, body, headers, cookies, file uploads, external APIs

### vitest
- Native ESM and TypeScript support out of the box
- Jest-compatible API — drop-in replacement for most Jest suites
- Use vi.mock() for module mocking, vi.fn() for function mocks
- Use vitest --coverage with V8 or Istanbul provider
- Use describe/test for grouping, beforeEach/afterEach for fixtures
- Use concurrent tests for parallel execution when tests are independent
- Use test context for fixtures and shared state
- Snapshot testing with toMatchSnapshot for expected output comparisons
- Smart watch mode — only reruns affected tests based on module graph
