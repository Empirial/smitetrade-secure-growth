---
name: bug-fixer
description: Use when there are build errors, TypeScript errors, broken JSX, missing imports, or runtime crashes. Scans the project for errors and fixes them systematically.
---

## What This Skill Does

Scans the smitetrade-secure-growth project for all build-blocking and TypeScript errors, then fixes them one by one in priority order.

## Steps

1. Run the build to capture current errors:
   ```bash
   npm run build 2>&1
   ```

2. Run TypeScript type checking:
   ```bash
   npx tsc --noEmit 2>&1
   ```

3. Parse the error output and group errors by file.

4. Fix errors in this priority order:
   - **JSX syntax errors** (unclosed tags, malformed elements) — fix first as they block everything
   - **Missing/invalid imports** (wrong icon names, missing modules)
   - **Type errors** (missing required props, wrong types)
   - **Duplicate object properties**
   - **Runtime logic errors**

5. For each file with errors:
   - Read the full file before making any edits
   - Fix ALL errors in that file in one pass
   - Do not introduce new errors while fixing

6. After all fixes, re-run the build to confirm it passes:
   ```bash
   npm run build 2>&1
   ```

7. Report: list every file changed, what was broken, and what was fixed.

## Known Critical Errors (fix these first)

- `src/pages/customer/CustomerCreditApplication.tsx` — broken JSX around line 255, unexpected closing `</div>`
- `src/context/StoreContext.tsx` — duplicate object properties around lines 482-484
- `src/pages/cashier/CashierCheckout.tsx` — `placeOrder()` call missing required `address` field (use `"In-Store"`)
- `src/pages/owner/OwnerLending.tsx` — check for invalid `UserByOrder` lucide-react import, replace with `UserCheck`

## Notes

- Always read a file before editing it
- Fix one file at a time, don't batch edits across multiple files simultaneously
- If a fix introduces a new error, revert and try a different approach
- Do not refactor or clean up code beyond what is needed to fix the error
- Do not add comments, types, or docstrings to code you didn't change
