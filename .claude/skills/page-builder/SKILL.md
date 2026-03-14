---
name: page-builder
description: Use when you need to build, complete, or rewrite a specific page or component. Runs in isolation so the heavy implementation work doesn't consume main conversation context.
context: fork
agent: general-purpose
argument-hint: [page-name or description]
---

## What This Skill Does

Builds or completes a page/component for the smitetrade-secure-growth project in an isolated subagent. Returns the finished implementation without bloating the main context.

## Task

Build or complete the following:

$ARGUMENTS

## Instructions

1. **Research first** — before writing any code:
   - Read the existing file if it exists
   - Read 2-3 similar pages in the same role folder for patterns and conventions
   - Check `src/context/` for available context (StoreContext, CreditContext)
   - Check `src/hooks/` for available hooks
   - Check `src/lib/` for Firebase, Paystack, and utility functions

2. **Match existing conventions**:
   - Use shadcn/ui components (from `src/components/ui/`)
   - Use Tailwind CSS for styling
   - Use React Hook Form + Zod for forms
   - Use React Query for data fetching
   - Follow the same import order and component structure as sibling pages

3. **Implement completely** — no placeholders, no TODOs, no `// implement later`

4. **Do not**:
   - Create new utility files unless absolutely necessary
   - Change shared context or hooks
   - Modify other pages

## Return Format

```
## Page Built: [name]

### File
[file path]

### What Was Implemented
- [feature 1]
- [feature 2]

### Dependencies Used
- [component/hook/util and why]

### Notes
[anything the main conversation should know]
```

Then output the complete file contents.
