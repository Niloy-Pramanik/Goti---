# Agent Operating Docs — `docs/agent/`

This folder is the **operating manual for any AI coding agent** (Claude Code, Cursor, Copilot
Workspace, etc.) working in this repository. If you are an agent starting a session here,
read this file first, then follow the routing below.

## Read Order

1. **This file** — orientation, don't skip.
2. **`context-loading.md`** — tells you exactly which files to load for the task type you've
   been given. Do this *before* opening source files.
3. **`current-task.md`** — the single source of truth for what's being worked on right now.
   If it conflicts with what the human just told you in chat, the chat instruction wins, but
   update this file to reflect it.
4. Task-specific docs as routed by `context-loading.md` (`../PRD.md`, `../ARCHITECTURE.md`,
   relevant module code).
5. **`coding-rules.md`** — before writing any code.
6. **`definition-of-done.md`** — before declaring anything finished.
7. **`decision-framework.md`** — whenever you're unsure whether to proceed or ask.

## What This Folder Is For

- Keeping agent behavior consistent across sessions and across different agent tools.
- Preventing scope creep — Phase 1 must ship before Phase 2 code exists (see PRD §5).
- Giving a cheap way for the human to redirect the agent by editing a markdown file instead of
  re-explaining context in every prompt.

## What This Folder Is NOT For

- Not a replacement for `PRD.md` (product intent) or `ARCHITECTURE.md` (system design) — those
  live one level up and are referenced, not duplicated, here.
- Not a changelog. Don't log completed work here — that belongs in commit messages / PR
  descriptions.

## File Index

| File | Purpose |
|---|---|
| `current-task.md` | What's being worked on right now, and its checklist |
| `implementation-checklist.md` | Full Phase 1 feature checklist, module by module |
| `coding-rules.md` | Backend/frontend conventions, non-negotiables |
| `definition-of-done.md` | The bar a feature must clear before it's "done" |
| `context-loading.md` | What to read (and skip) for a given task type |
| `decision-framework.md` | When to proceed autonomously vs. stop and ask |

## Hard Rules (apply regardless of task)

- **Never implement Phase 2+ tables or endpoints while `current-task.md` scopes work to
  Phase 1.** If a Phase 1 task seems to require a Phase 2 concept, stop — see
  `decision-framework.md`.
- **Never invent an API shape** not documented in the PRD/Architecture docs without flagging
  it as a proposed addition and getting confirmation.
- **Always use `JdbcTemplate` with parameterized SQL** for the backend — no JPA/Hibernate
  entities, no string-concatenated queries. See `coding-rules.md`.
- **Always update `implementation-checklist.md`** when a checklist item is completed and
  verified (not just written — verified per `definition-of-done.md`).
