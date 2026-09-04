# Prokoi — Documentation Set

Jira-inspired PM tool. Spring Boot backend, React frontend, PostgreSQL. Built to fully ship
**Phase 1** (Organizations → Teams → Projects → Access Control) before any Phase 2 work starts.

## Contents

| Doc | What it's for |
|---|---|
| [`PRD.md`](./PRD.md) | Product requirements — goals, scope by phase, functional/non-functional requirements, acceptance criteria |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System architecture — module boundaries, folder structure, data model, security, testing, deployment |
| [`docs/agent/`](./docs/agent/README.md) | How an AI coding agent should operate in this repo — start there if you're an agent |

## Quick Orientation

- **What are we building right now?** `PRD.md §5` (Scope by Phase) + `docs/agent/current-task.md`.
- **What's the exact API/data model?** `ARCHITECTURE.md §4` (data model) and the API tables
  carried over from the original design.
- **How should code be written?** `docs/agent/coding-rules.md`.
- **When is a feature actually finished?** `docs/agent/definition-of-done.md`.

## Phase Status

- ✅ Phase 1 scope defined (`PRD.md §6`)
- ⏳ Phase 1 implementation — see `docs/agent/implementation-checklist.md`
- 📋 Phase 2 designed, not started
- ✅ Phase 3 — this agent doc set
- ✅ Phase 4 — `ARCHITECTURE.md`
