# Portal Blocker List

## Purpose
This document summarizes the likely blockers to a polished retail-core launch based on source review of the current codebase.

Launch scope reviewed:

- Owner
- Cashier
- Customer
- Admin

Deferred from launch:

- Driver
- Lender
- advanced credit product

## Executive View

### Stronger Areas

- route structure is broad and well-organized
- role-based separation is clear
- store, product, order, and staff foundations are present
- Firestore rules and tenancy thinking are stronger than average

### Higher-Risk Areas

- lending and credit journeys are only partially open
- Driver and Lender are still intentionally gated
- shared business logic is concentrated in large context files
- production readiness needs stronger verification than file presence alone

## Blockers By Portal

## Owner

### Status
Mostly built, but not fully polished.

### Likely blockers

- some credit-facing owner experiences are still gated
- shared context complexity raises regression risk
- reports and analytics need business validation, not just code presence
- launch-scope pages need a focused QA pass for broken actions and empty states

### Actions needed

- verify every owner route and action
- disable or hide unfinished credit features
- validate inventory, staff, supplier, order, and expense flows
- confirm multi-store switching works cleanly

## Cashier

### Status
Operationally promising and close to launch value.

### Likely blockers

- credit-related cashier flows are still gated
- POS and checkout flows need strong transaction and edge-case testing
- receipt, scanner, and shift workflows need real-world validation
- cashier role permissions need full regression testing

### Actions needed

- validate POS and checkout start to finish
- confirm cashier cannot access owner/admin-only features
- test receipt generation and shift workflows
- remove or hide unfinished credit touchpoints

## Customer

### Status
Broad feature coverage, but not all customer-facing value is truly launch-ready.

### Likely blockers

- multiple customer credit screens are still gated
- checkout and payment need full validation
- product browsing and order history need edge-case QA
- some profile and credit-status experiences are present but not ready for open launch

### Actions needed

- focus launch on browse, cart, checkout, payment, orders, support, and profile basics
- hide or defer credit application and lender registration flows
- test payment success and cancel flows
- verify customer order access and store-specific ordering logic

## Admin

### Status
Useful oversight layer exists, but polish and confidence checks are still needed.

### Likely blockers

- some admin credit and revenue areas are gated
- reporting and platform analytics need source-of-truth validation
- admin powers must be tested carefully because of high privilege
- launch presentation quality may still vary between screens

### Actions needed

- validate admin access to stores, users, alerts, disputes, and audit logs
- hide or defer unfinished credit-revenue views
- confirm audit and oversight workflows behave correctly
- polish any owner-demo-facing admin surfaces

## Cross-Cutting Blockers

### 1. Driver and Lender are not launch-ready

- both are gated behind a Coming Soon mechanism in routing
- they should be treated as deferred phases, not near-term launch promises

### 2. Advanced credit is not fully open

- credit logic exists in code
- many credit user experiences are intentionally blurred and locked
- this area should be considered partially implemented, not complete

### 3. Shared logic concentration

- major operational logic is centralized in shared context files
- that speeds development but increases bug and regression risk
- changes in one area can ripple across multiple portals

### 4. Build and QA confidence still need clean verification

- source review shows meaningful implementation
- source review alone is not enough to certify release readiness
- full launch confidence needs successful build, lint, tests, and workflow checks in a working runtime environment

## Priority Matrix

### P0

- broken retail-core journey
- permission failure
- incorrect tenant isolation
- payment failure
- order workflow failure

### P1

- unfinished launch-scope UX
- inconsistent portal behavior
- broken analytics or reporting view needed by owners
- unclear error handling

### P2

- copy cleanup
- visual polish
- secondary admin/reporting improvements
- post-launch refinements

## Recommendation
Do not market the full six-portal vision as complete yet.

Recommended owner position:

- launch the retail-core first
- present Driver as Phase 2
- present Lender and advanced credit as Phase 3
