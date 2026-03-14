---
name: parallel-worker
description: Use when multiple independent tasks need to run at the same time to save time and tokens. Spawns isolated subagents to work on separate tasks in parallel without consuming the main conversation context.
context: fork
agent: general-purpose
---

## What This Skill Does

Runs $ARGUMENTS as an isolated task in a subagent. This keeps the main conversation context clean and saves tokens by offloading heavy work to a separate agent.

## When to Use This

Invoke this when you want to parallelize independent work, for example:
- Fix bugs in multiple unrelated files simultaneously
- Research multiple parts of the codebase at once
- Run checks and implement features at the same time

## How to Invoke

```
/parallel-worker [task description]
```

Example:
```
/parallel-worker Fix the JSX error in CustomerCreditApplication.tsx and confirm the build passes
```

## Task

Execute the following task completely and return a full report of what was done, what files were changed, and the final state:

$ARGUMENTS

## Rules

- Complete the task fully before returning
- Read files before editing them
- Do not ask clarifying questions — use best judgement based on the codebase
- Return a structured report:
  ```
  ## Task: [task name]
  ### Files Changed
  - [file]: [what changed]
  ### Result
  [outcome]
  ### Issues Found
  [anything blocking or unexpected]
  ```
