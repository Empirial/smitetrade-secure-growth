---
name: firebase-validator
description: Use when you want to validate Firebase security rules, check Firestore structure, verify auth configuration, or confirm Firebase is correctly set up before going live.
context: fork
agent: Explore
---

## What This Skill Does

Audits the Firebase setup in smitetrade-secure-growth — security rules, auth config, Firestore data structure, and environment config. Runs on Haiku in isolation. Does not make any changes.

## Instructions

1. **Read Firestore security rules**
   - Read `firestore.rules`
   - Flag any rules that are dangerously open:
     - `allow read, write: if true` — CRITICAL, anyone can access
     - `allow read: if true` — WARNING, public read access
     - Missing rules for sensitive collections (credits, orders, payments)
   - Confirm rules exist for all 6 user roles
   - Check rules use `request.auth != null` for authenticated routes
   - Check rules use `request.auth.uid` for user-specific data

2. **Check Firebase config**
   - Read `src/lib/firebase.ts` (or wherever Firebase is initialized)
   - Confirm all required fields are present: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`
   - Flag if any values appear to be placeholder/example values
   - Confirm config reads from environment variables, not hardcoded

3. **Check `.env.example`**
   - Read `.env.example`
   - List all Firebase-related env vars required
   - Note which ones are critical for the app to function

4. **Check auth usage**
   - Grep for `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `onAuthStateChanged`
   - Confirm auth state is handled for all 6 roles
   - Check for missing sign-out handling

5. **Check Firestore usage patterns**
   - Grep for `collection(`, `doc(`, `getDocs(`, `setDoc(`, `updateDoc(`
   - Flag any direct Firestore calls outside of `src/lib/` (should be centralized)
   - Check for missing error handling on Firestore operations

6. **Check for security anti-patterns**
   - API keys or Firebase config hardcoded in non-env files
   - Admin SDK usage in frontend code (should never happen)
   - User role stored only on client side without Firestore verification

## Return Format

```
## Firebase Validation Report

### Security Rules — [PASS / CRITICAL / WARNING]
- [finding]
- [finding]

### Firebase Config — [PASS / WARNING]
- [finding]

### Auth Setup — [PASS / WARNING]
- [finding]

### Firestore Usage — [PASS / WARNING]
- [finding]

### Security Anti-patterns — [NONE FOUND / ISSUES]
- [finding]

### Critical Issues (fix before going live)
1. [issue] — [file:line] — [how to fix]

### Warnings (fix soon)
1. [issue] — [file:line]

### Overall: SAFE TO DEPLOY / DO NOT DEPLOY
```
