# Prokoi — Product Requirements Document (PRD)

**Version:** 1.0
**Status:** Phase 1 in active development
**Stack:** Spring Boot (Java) backend · React frontend · PostgreSQL

---

## 1. Problem Statement

Existing PM tools (Jira, Linear) are over-engineered for a small academic team that needs:
organization → team → project → issue hierarchy, milestone progress tracking, and a place to
log real-world blockers (e.g., "lost 2 days, sick"). Prokoi is a scoped-down, self-hosted
alternative built to satisfy both the lab's grading rubric and genuine team-coordination needs.

## 2. Goals

- Ship a working hierarchy: **Organizations → Teams → Projects → Issues**.
- Give every issue a visible owner and a minimal state machine (`TO_DO → IN_PROGRESS → DONE`).
- Let milestones auto-calculate progress from linked issues — no manually maintained percentage.
- Capture delay/blocker context per issue (not just status), satisfying the teacher's
  "days lost to sickness" requirement.
- Centralize repo/meeting/storage links per project so nobody DMs a Zoom link ever again.

## 3. Non-Goals (v1)

- Real-time collaboration (WebSockets/live cursors) — future.
- File attachments / issue comments beyond progress logs — stubbed for Phase 2+.
- Email notifications — architecture leaves a hook, not implemented in Phase 1.
- Kanban drag-and-drop UI — Phase 1 ships list + status dropdown; board view is a stretch goal.
- Multi-tenant billing / public SaaS concerns — this is a single-deployment academic tool.

## 4. Personas

| Persona | Needs |
|---|---|
| **Org Admin** | Create org, create teams, assign members, see everything. |
| **Team Lead** | Create projects under their team, assign roles, manage resource links. |
| **Member** | See assigned issues, update status, log progress/blockers. |
| **Instructor (indirect)** | Needs milestone progress bars and delay logs to be legible without DB access. |

## 5. Scope by Phase (source of truth: this repo's `/docs`)

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Auth, Organizations, Teams, Projects, Access/Role management, resource links | **Current — must be fully complete before Phase 2 starts** |
| Phase 2 | Milestones, Issues, state machine, assignment, progress/delay logs | Designed, not started |
| Phase 3 | Agent operating docs (this doc set) | In progress |
| Phase 4 | Formal architecture doc | In progress (see `ARCHITECTURE.md`) |
| Future | Comments, attachments, email notifications, Kanban board, real-time updates | Not designed |

## 6. Functional Requirements — Phase 1 (must-ship)

### 6.1 Authentication
- FR-1.1: User can register with `name`, `email`, `password`. Password stored as bcrypt hash, never plaintext.
- FR-1.2: User can log in and receive a JWT.
- FR-1.3: `GET /api/users/me` returns the authenticated user's profile from a valid token.
- FR-1.4: All endpoints below (except register/login) require a valid JWT.

### 6.2 Organizations
- FR-2.1: Authenticated user can create an organization; creator is auto-assigned `ADMIN` role via `organization_members`.
- FR-2.2: User can list organizations they belong to.
- FR-2.3: `ADMIN` can add existing users to the org with a role (`ADMIN` | `MEMBER`).
- FR-2.4: Non-members cannot view an org's detail, teams, or projects (403).

### 6.3 Teams
- FR-3.1: Org `ADMIN` can create a team inside an organization.
- FR-3.2: Team creation requires org membership check, not just JWT validity.
- FR-3.3: User can list teams within an org they belong to.
- FR-3.4: `ADMIN`/team creator can add members to a team with role (`LEAD` | `MEMBER`).

### 6.4 Projects
- FR-4.1: Team `LEAD` can create a project under a team, optionally setting `repo_link`, `meeting_link`, `storage_link` at creation.
- FR-4.2: Any team member can list/view projects belonging to their team.
- FR-4.3: `LEAD` can `PATCH` resource links independently of other project fields.
- FR-4.4: `LEAD` can delete a project (soft constraints: only if no issues exist, once Phase 2 lands — no-op consideration for now).

### 6.5 Access Control (cross-cutting)
- FR-5.1: Role checks are enforced server-side on every mutating endpoint — never trust frontend role display alone.
- FR-5.2: A user with no relationship to an org/team/project gets 403, not 404 (avoid leaking existence... except where enumeration risk is acceptable for an academic tool — document if relaxed).

## 7. Functional Requirements — Phase 2 (designed, deferred)

- Milestones with `due_date`, auto-computed `% complete` from linked issues (no stored percentage column).
- Issues with `type` (BUG/TASK/FEATURE), `status`, `assignee_id`, `milestone_id`.
- `progress_logs` table capturing free-text comment + `delay_days` per issue.
- See `ARCHITECTURE.md §4 Data Model` for full schema (carried over from original design doc).

## 8. Non-Functional Requirements

- **Performance:** List endpoints (orgs/teams/projects) must return in <300ms on seeded data of ~50 orgs / 500 users. Raw SQL / `JdbcTemplate`, not JPA `N+1` traps.
- **Security:** BCrypt (cost ≥ 10) for passwords. JWT expiry ≤ 24h. No secrets in source control — `.env` / Spring profiles.
- **Consistency:** Foreign keys enforced at the DB level (Postgres), not just app-level checks.
- **Auditability:** `created_at` on every table (already in schema) — never delete rows silently; prefer soft-delete flags if deletion is added later.

## 9. Acceptance Criteria for "Phase 1 Complete"

Phase 1 is done when **all** of the following are true:

1. A user can register → log in → create an org → create a team → create a project → set its
   repo/meeting/storage links, entirely through the API (and ideally the React UI), with no
   manual DB edits.
2. Role checks are verified with at least one negative test per endpoint (non-member gets 403).
3. Every endpoint in the API design doc exists, is covered by an integration test, and matches
   the request/response shape documented.
4. `docs/agent/definition-of-done.md` checklist passes for every Phase 1 module.
5. No Phase 2 tables (`milestones`, `issues`, `progress_logs`) are referenced by Phase 1 code —
   keep the phases genuinely decoupled.

## 10. Open Questions

- Should organization membership be invite-based (email invite + accept) or direct-add by
  admin only? **v1 default: direct-add only**, invites are a Phase 2+ candidate.
- Is a user allowed to belong to multiple organizations? **v1 default: yes**, `organization_members`
  is already a junction table so this is free.
