---
name: code-researcher
description: Use when you need to find where something is implemented, understand how a feature works, or answer questions about the codebase without loading files into the main context. Fast and token-efficient.
context: fork
agent: Explore
---

## What This Skill Does

Researches the smitetrade-secure-growth codebase to answer a specific question, then returns a concise summary. Runs on Haiku in an isolated context — does not consume main conversation tokens.

## Task

Research the following question about the codebase:

$ARGUMENTS

## Instructions

1. Use Glob and Grep to locate relevant files
2. Read only what is necessary to answer the question
3. Do not read entire files if only a section is needed
4. Do not make any edits

## Return Format

```
## Research: [question]

### Answer
[direct answer in 2-5 sentences]

### Relevant Files
- [file:line] — [why it's relevant]

### Key Details
- [specific function/variable/pattern names]
- [any important context]

### Anything Unexpected
[flag anything surprising or broken found during research]
```

Keep the response concise. Do not dump raw file contents — summarize only.
