---
name: portal-checker
description: Use when you want to verify all six role portals are complete, all routes are reachable, and no pages are missing or broken. Scans all portals without consuming main context.
context: fork
agent: Explore
---

## What This Skill Does

Audits all 6 role portals in smitetrade-secure-growth — owner, cashier, customer, driver, admin, lender — and confirms every route, page, and navigation link is wired up correctly. Runs on Haiku in isolation.

## Instructions

1. **Read the router config** — find the main routing file (likely `src/App.tsx` or a routes file) and list every defined route per portal

2. **For each of the 6 portals**, scan `src/pages/[role]/`:
   - List all page files that exist
   - Cross-check each page file has a matching route in the router
   - Check each page imports and renders without obvious broken imports
   - Check navigation links within the portal point to valid routes

3. **Check role-based access**:
   - Confirm each portal has an auth guard or role check
   - Flag any portal pages accessible without authentication

4. **Check for common issues**:
   - Pages that exist as files but have no route
   - Routes that point to non-existent page files
   - Navigation links using hardcoded paths that don't match route definitions
   - Missing index/dashboard pages for any portal

## Portals to Check

| Portal | Folder | Expected entry route |
|--------|--------|----------------------|
| Owner | `src/pages/owner/` | `/owner` or `/owner/dashboard` |
| Cashier | `src/pages/cashier/` | `/cashier` or `/cashier/dashboard` |
| Customer | `src/pages/customer/` | `/customer` or `/customer/dashboard` |
| Driver | `src/pages/driver/` | `/driver` or `/driver/dashboard` |
| Admin | `src/pages/admin/` | `/admin` or `/admin/dashboard` |
| Lender | `src/pages/lender/` | `/lender` or `/lender/dashboard` |

## Return Format

```
## Portal Check Report

### Owner Portal — [PASS / ISSUES FOUND]
- Pages: [n] files, [n] routed, [n] missing routes
- Issues: [list or "none"]

### Cashier Portal — [PASS / ISSUES FOUND]
- Pages: [n] files, [n] routed, [n] missing routes
- Issues: [list or "none"]

### Customer Portal — [PASS / ISSUES FOUND]
...

### Driver Portal — [PASS / ISSUES FOUND]
...

### Admin Portal — [PASS / ISSUES FOUND]
...

### Lender Portal — [PASS / ISSUES FOUND]
...

### Summary
- Total pages: [n]
- Total routes: [n]
- Unrouted pages: [list]
- Unauthenticated routes: [list]
- Overall: READY / NEEDS FIXES
```
