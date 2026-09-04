# Context Loading

Loading the wrong context wastes budget and, worse, leaks Phase 2+ ideas into Phase 1 code.
Use this table to decide what to read **before** touching source files.

## Rule of Thumb

Read the minimum needed to do the current task correctly. Prefer this repo's docs over
general Spring Boot / React knowledge when they conflict — this repo's conventions
(`coding-rules.md`) are deliberate, not defaults.

## By Task Type

| Task type | Read | Skip |
|---|---|---|
| **New backend endpoint (Phase 1 module)** | `PRD.md` (relevant FR section), `ARCHITECTURE.md §2–3, §6, §8`, `coding-rules.md`, the sibling module's existing controller/service/repository as a pattern reference (e.g. copy `teams/` structure when building `projects/`) | `PRD.md §7` (Phase 2 FRs), any `issues`/`milestones` code |
| **New frontend feature (Phase 1)** | `PRD.md` (relevant FR), `ARCHITECTURE.md §5` (state mgmt), `coding-rules.md` (frontend section), a sibling `features/` folder as pattern reference | Backend internals beyond the API contract — you need the DTO shape, not the SQL |
| **Bug fix** | `current-task.md`, the specific module's existing code, the relevant test file | The full PRD/Architecture unless the bug reveals a spec mismatch |
| **Schema change** | `ARCHITECTURE.md §4` (data model), existing Flyway migrations (never edit applied ones — see `coding-rules.md`) | — read everything relevant here; schema changes are high-stakes, under-reading is worse than over-reading |
| **"Is this in scope for Phase 1?"** | `PRD.md §3` (Non-Goals), `PRD.md §5` (Scope by Phase) | Don't guess from the original planning PDF's Phase 2/3 sections — those are superseded by `PRD.md` as source of truth |
| **Writing/updating docs** | The specific doc being changed + `README.md` (this folder) for cross-reference consistency | Don't rewrite `ARCHITECTURE.md §11` trade-offs without flagging the change per `decision-framework.md` |
| **Onboarding / first session in this repo** | This file → `docs/agent/README.md` → `PRD.md` → `ARCHITECTURE.md` → `current-task.md`, in that order | Don't read every source file up front — pull specific files once you know the task |

## What to Never Load Unless the Task Explicitly Requires It

- Phase 2/3/4 planning content beyond what's needed to confirm something is *out* of scope.
- The original planning PDF/notes that predate this doc set — `PRD.md` and `ARCHITECTURE.md`
  supersede it. If they ever conflict, these docs win; flag the conflict, don't silently
  follow the older source.
- Unrelated feature modules' internals (e.g. don't read `auth/` internals in depth when
  building `projects/` — you only need `auth`'s public contract: how to get the current
  user ID from the security context).

## Token-Budget Discipline

For a typical single-endpoint task, target reading: 1 PRD section + 2–3 architecture sections
+ 1 sibling module (3–5 files) + coding-rules.md. If you find yourself opening more than
~10 files before writing any code, stop and re-check whether the task is actually well-scoped
— it may need to be broken down (see `decision-framework.md`).
