---
name: file-auditor
description: Use when you need to scan all components or files for a specific pattern, issue, or anti-pattern. Returns a summary report without flooding the main context with file contents.
context: fork
agent: Explore
---

## What This Skill Does

Scans all files in the smitetrade-secure-growth project matching a pattern or condition, then returns a structured audit report. Runs on Haiku — fast, cheap, and isolated from main context.

## Task

Audit the codebase for the following:

$ARGUMENTS

If no argument is provided, run the default full audit below.

## Default Full Audit (when no arguments given)

Scan all `.tsx` and `.ts` files in `src/` and report:

1. **Broken imports** — imports from packages that don't exist or wrong named exports
2. **Missing required props** — component calls missing required props
3. **Hardcoded values** — hardcoded URLs, API keys, or magic strings that should be constants
4. **Unused imports** — imported but never used
5. **Console.log statements** — should be removed before production
6. **TODO/FIXME comments** — list them with file and line number
7. **Empty catch blocks** — `catch(e) {}` with no error handling

## Instructions

1. Use Glob to find all `src/**/*.tsx` and `src/**/*.ts` files
2. Use Grep to search for patterns efficiently — do NOT read every file in full
3. Group findings by category
4. Only read a file in full if Grep results are ambiguous

## Return Format

```
## Audit Report

### Broken Imports
- [file:line] — [detail]

### Missing Required Props
- [file:line] — [detail]

### Hardcoded Values
- [file:line] — [detail]

### Console.log Statements
- [file:line]

### TODO/FIXME Comments
- [file:line] — [comment text]

### Empty Catch Blocks
- [file:line]

### Summary
Total issues: [n]
Most critical: [file] — [reason]
```
