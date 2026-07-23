## Testing Capabilities

**Strict TDD Mode**: disabled
**Detected**: 2026-07-23

### Test Runner

- Command: `—`
- Framework: not detected (greenfield project)

### Test Layers

| Layer       | Available | Tool |
| ----------- | --------- | ---- |
| Unit        | ❌        | —    |
| Integration | ❌        | —    |
| E2E         | ❌        | —    |

### Coverage

- Available: ❌
- Command: `—`

### Quality Tools

| Tool         | Available | Command |
| ------------ | --------- | ------- |
| Linter       | ❌        | —       |
| Type checker | ❌        | —       |
| Formatter    | ❌        | —       |

### Notes

- No package.json, tsconfig, or config files exist yet
- strict_tdd is disabled because no test runner is installed
- Once Vitest is configured, update `openspec/config.yaml` `strict_tdd` to `true` and fill in the runner/tool details
- Monorepo convention uses pnpm, Vitest, TypeScript strict mode
