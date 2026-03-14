---
name: feature-completer
description: Use when you want to finish incomplete features, implement TODOs, or work through the project plan. Reads the implementation plan and completes remaining work systematically.
---

## What This Skill Does

Reads `.lovable/plan.md`, identifies incomplete features, and implements them one at a time in priority order for the smitetrade-secure-growth project.

## Steps

1. **Read the plan**
   - Read `.lovable/plan.md` in full
   - List all features/tasks marked as incomplete, TODO, or not yet implemented

2. **Triage by impact**
   Categorize each item:
   - **Blocking** — prevents core functionality (fix first)
   - **High** — affects user-facing flows
   - **Low** — polish, compliance text, minor UI tweaks

3. **For each incomplete feature (highest priority first)**:
   a. Read all files related to the feature before touching anything
   b. Implement the minimum required to complete the feature
   c. Do not over-engineer — implement exactly what the plan describes
   d. After each feature, briefly confirm what was done

4. **Known incomplete items to work through**:
   - SS-ID auto-generation (CreditContext)
   - ID number privacy masking integration throughout UI (`maskIdNumber()` exists in utils.ts but not used)
   - Supplier contact details consolidation
   - Order tracking time windows (dynamic ranges, not hardcoded minutes)
   - Lender portal compliance disclaimers
   - Credit review alignment between customer & lender portals
   - Color palette restoration (if mentioned in plan)

5. **After each feature is done**, update the task status by adding a `[DONE]` marker in the plan notes (do not modify the plan structure).

6. **Report** what was completed and what remains.

## Notes

- Read `.lovable/plan.md` first — it is the source of truth for what needs to be done
- If a feature requires the build to be passing first, invoke `/bug-fixer` before proceeding
- Do not refactor unrelated code while implementing features
- Keep changes minimal and focused — tonight's goal is completion, not perfection
- If $ARGUMENTS is provided, treat it as the specific feature to implement (skip triage)
