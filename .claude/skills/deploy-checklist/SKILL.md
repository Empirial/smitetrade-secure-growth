---
name: deploy-checklist
description: Use when ready to deploy, ship, or go live. Runs the full build, checks environment variables, validates the output, and confirms the app is production-ready.
---

## What This Skill Does

Runs a full deployment readiness check for smitetrade-secure-growth and reports what is ready, what is broken, and what must be fixed before going live.

## Steps

1. **Check environment variables**
   - Read `.env.example` to see all required vars
   - Check if a `.env` file exists with actual values
   - Flag any missing or placeholder values (especially Firebase and Paystack keys)

2. **Run the production build**
   ```bash
   npm run build 2>&1
   ```
   - If build fails, stop and report errors — invoke `/bug-fixer` to resolve them first

3. **Verify build output**
   ```bash
   ls -la dist/
   ```
   - Confirm `dist/index.html` exists
   - Confirm JS/CSS bundles are present
   - Check bundle sizes (warn if any chunk > 500KB)

4. **Check routing config**
   - Confirm `public/_redirects` exists (required for Netlify/Vercel SPA routing)
   - Confirm React Router routes are not hardcoded to localhost

5. **Check Firebase security rules**
   - Read `firestore.rules`
   - Flag any rules that are overly permissive (e.g., `allow read, write: if true`)

6. **Run linting**
   ```bash
   npm run lint 2>&1
   ```
   - Report any errors (warnings are acceptable)

7. **Run tests**
   ```bash
   npm run test 2>&1
   ```
   - Report pass/fail

8. **Final report**
   Output a checklist in this format:

   ```
   ## Deploy Readiness Report

   ### PASS
   - [ ] Build succeeds
   - [ ] dist/ output exists
   - [ ] _redirects present
   ...

   ### FAIL (must fix before deploying)
   - [ ] [item] — [reason]

   ### WARNINGS (can deploy but should fix soon)
   - [ ] [item] — [reason]

   ### Ready to deploy: YES / NO
   ```

## Notes

- Do not deploy automatically — only report readiness
- If the build fails, stop the checklist at step 2 and report the errors
- Firebase keys and Paystack keys must be real values, not the `.env.example` placeholders
