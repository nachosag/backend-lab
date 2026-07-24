## Testing Capabilities

**Strict TDD Mode**: enabled
**Detected**: 2026-07-23
**Updated**: 2026-07-23

### Test Runner

- Command: `pnpm test`
- Framework: Vitest 4.1.10
- Config: `vitest.config.ts` (globals: true, environment: node)
- Pattern: `tests/**/*.test.ts`

### Test Layers

| Layer       | Available | Command                     |
| ----------- | --------- | --------------------------- |
| Unit        | ✅        | `pnpm test:unit`            |
| Integration | ✅        | `pnpm test:integration`     |
| E2E         | ❌        | —                           |

### Coverage

- Available: ❌
- Command: `—`

### Quality Tools

| Tool         | Available | Command     |
| ------------ | --------- | ----------- |
| Type checker | ✅        | `pnpm build` (tsc) |
| Linter       | ❌        | —           |
| Formatter    | ❌        | —           |

### Notes

- TypeScript 7.0.2 with strict config (nodenext, verbatimModuleSyntax, noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- pnpm as package manager
- strict_tdd enabled — Vitest is configured and functional
