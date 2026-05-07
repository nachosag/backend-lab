# Skill Registry

**Project**: blogging-platform-api
**Detected**: 2026-05-07
**Mode**: engram

## User Skills (Global)

### TypeScript
- **typescript** — TypeScript strict patterns and best practices. Trigger: When writing TypeScript code - types, interfaces, generics.

### Testing
- **pytest** — Pytest testing patterns for Python. Trigger: When writing Python tests.
- **playwright** — Playwright E2E testing patterns. Trigger: When writing E2E tests.
- **go-testing** — Go testing patterns. Trigger: When writing Go tests.

### Frontend
- **react-19** — React 19 patterns with React Compiler. Trigger: When writing React components.
- **zustand-5** — Zustand 5 state management patterns. Trigger: When managing React state.
- **tailwind-4** — Tailwind CSS 4 patterns. Trigger: When styling with Tailwind.
- **zod-4** — Zod 4 schema validation patterns. Trigger: When using Zod.

### SDD Phases
- **sdd-init** — Initialize SDD context.
- **sdd-explore** — Explore and investigate ideas.
- **sdd-propose** — Create change proposals.
- **sdd-spec** — Write specifications.
- **sdd-design** — Create technical design.
- **sdd-tasks** — Break down into implementation tasks.
- **sdd-apply** — Implement tasks.
- **sdd-verify** — Validate implementation.
- **sdd-archive** — Archive completed changes.

### Workflow
- **skill-registry** — Create/update skill registry.
- **skill-creator** — Create new AI agent skills.
- **issue-creation** — Issue creation workflow.
- **branch-pr** — PR creation workflow.
- **chained-pr** — Chained/stacked PR workflow.
- **work-unit-commits** — Work unit commit structure.
- **judgment-day** — Parallel adversarial review.
- **comment-writer** — Write human comments.
- **cognitive-doc-design** — Cognitive load-reducing documentation.

## Project Skills

### Project-Level (.agents/skills/)
- **nodejs-express-server** — Node.js Express server patterns. Triggers: Express server setup, REST API, middleware, JWT auth, database integration.
- **nodejs-backend-patterns** — Advanced Node.js backend patterns.
- **typescript-advanced-types** — Advanced TypeScript type patterns.
- **nodejs-best-practices** — Node.js best practices.
- **vitest** — Vitest testing framework. Triggers: Unit tests, test coverage, mocking.

## Project Conventions

- **TypeScript Config**: strict mode enabled, extends @tsconfig/node22
- **Package Manager**: pnpm (10.33.0)
- **Dev Server**: tsx watch
- **Test Framework**: Vitest
- **Build Output**: ./dist

## Next Steps
Ready for /sdd-explore <topic> or /sdd-new <change-name>.