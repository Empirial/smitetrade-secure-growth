# Scenario 2 Implementation Roadmap

## Goal
Prepare SmiteTrade for a polished retail-core launch covering:

- Owner
- Cashier
- Customer
- Admin

Out of launch scope:

- Driver portal
- Lender portal
- Advanced credit features that are still gated or not production-ready

## Target Outcome
Deliver a stable, presentable, launch-ready retail platform with:

- reliable role-based access
- stable retail workflows
- production-safe tenant isolation
- fewer dead ends and placeholder experiences
- stronger QA confidence

## Timeline
Estimated duration: 5 to 8 weeks

## Workstreams

### 1. Scope Lock And Launch Definition
Duration: 2 to 3 days

Tasks:

- confirm retail-core launch scope
- formally exclude Driver and Lender from launch
- identify every credit feature to disable, hide, or postpone
- define launch-critical vs post-launch features
- align owner expectations around phased rollout

Deliverables:

- approved launch scope
- deferred features list

### 2. Product Audit And Blocker Triage
Duration: 3 to 5 days

Tasks:

- audit Owner, Cashier, Customer, and Admin routes
- trace major user journeys end to end
- identify broken flows, placeholder screens, and weak UX states
- classify issues into P0, P1, and P2
- verify role and route protection behavior

Deliverables:

- launch blocker register
- route and workflow audit summary

### 3. Core Workflow Hardening
Duration: 2 to 3 weeks

Tasks:

- stabilize owner inventory, orders, staff, suppliers, reports, and expenses
- stabilize cashier POS, checkout, receipts, shifts, and inventory
- stabilize customer browse, cart, checkout, payment, profile, and order history
- stabilize admin oversight flows for stores, users, alerts, audit logs, and analytics
- remove dead actions and partial states from launch scope
- improve error handling and user feedback

Deliverables:

- stable retail-core workflows
- reduced launch risk across live portals

### 4. Permissions, Security, And Data Integrity Validation
Duration: 4 to 7 days

Tasks:

- verify store-level data isolation
- verify role access for launch portals
- validate Firestore rule assumptions against actual app behavior
- verify cross-role actions on products, orders, staff, and expenses
- test store switching and multi-tenant behavior

Deliverables:

- permission validation checklist
- security confidence summary

### 5. UX Polish And Content Cleanup
Duration: 4 to 6 days

Tasks:

- clean labels, copy, and placeholder text
- remove unfinished launch-scope visuals
- improve empty states, loading states, and error states
- remove or soften references to unavailable advanced credit features
- make live portals feel consistent and intentional

Deliverables:

- launch-ready UI pass
- cleaner owner demo experience

### 6. QA, UAT, And Regression Fixing
Duration: 1 to 2 weeks

Tasks:

- run role-based test passes
- test key journeys by portal
- verify payment success and cancel flows
- identify regressions caused by shared context logic
- fix high-priority bugs found during testing

Deliverables:

- UAT candidate
- regression fix log

### 7. Release Preparation
Duration: 2 to 4 days

Tasks:

- verify environment configuration
- confirm release checklist
- prepare deployment and rollback notes
- prepare owner signoff summary

Deliverables:

- release package
- deployment checklist
- signoff summary

## Success Criteria

- all launch-scope portals complete their main workflows
- no critical route or permission failures in retail-core scope
- no obvious placeholder or broken UI in live areas
- launch scope is clearly separated from deferred scope
- owners can confidently present a phased product strategy

## Recommended Delivery Strategy

Phase 1:
- launch retail-core

Phase 2:
- complete Driver portal

Phase 3:
- complete Lender and advanced credit workflows

## Estimated Team Requirement
Best case:

- 1 strong full-stack developer
- 1 part-time tester or business reviewer
- fast owner feedback on scope decisions

Higher confidence setup:

- 1 developer
- 1 QA/UAT support person
- 1 product owner contact for weekly decisions
