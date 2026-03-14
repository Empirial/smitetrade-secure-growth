---
name: error-scanner
description: Use when you want a clean list of all current build errors, TypeScript errors, or lint errors without running the full bug-fixer. Fast diagnostic that returns only what's broken.
context: fork
agent: Explore
---

## What This Skill Does

Runs build and type checks in isolation, parses the output, and returns a clean prioritized error list. Runs on Haiku — fast, cheap, does not consume main context.

## Instructions

1. Run the TypeScript compiler check:
   ```bash
   npx tsc --noEmit 2>&1 | head -100
   ```

2. Run the linter:
   ```bash
   npm run lint 2>&1 | head -100
   ```

3. Parse all errors and group them:
   - **Critical** — syntax errors, broken JSX, missing modules (block the build)
   - **Type errors** — wrong types, missing props, type mismatches
   - **Lint errors** — ESLint rule violations
   - **Warnings** — non-blocking but should fix

4. Sort within each group: most-referenced files first (errors in shared files affect more of the app)

## Return Format

```
## Error Scan Report

### Critical (fix first — blocks build)
1. [file:line] — [error message]

### Type Errors
1. [file:line] — [error message]

### Lint Errors
1. [file:line] — [error message]

### Warnings
1. [file:line] — [message]

### Summary
- Total errors: [n]
- Total warnings: [n]
- Estimated fix order: [file1] → [file2] → [file3]
```

Keep output clean. Do not include raw compiler output — only the parsed, grouped list.
