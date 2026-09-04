# Implementation Checklist — Phase 1

Source of truth for scope: `PRD.md` §6. Every item here maps to a PRD requirement ID.
Check an item only when it satisfies `definition-of-done.md`, not just when code compiles.

## 0. Project Setup

- [ ] Spring Boot project scaffolded (`spring init`, Java 21 LTS, Web + Validation + Security + JDBC + PostgreSQL driver)
- [ ] Flyway configured, `V1__init_phase1.sql` written with all Phase 1 tables
- [ ] React project scaffolded (Vite + TypeScript), Tailwind configured
- [ ] `docker-compose.yml` boots Postgres + backend + frontend locally
- [ ] `.env.example` committed, `.env` gitignored

## 1. Authentication (PRD FR-1.x)

- [ ] `POST /api/users/register` — hashes password, inserts user, returns created user (no password hash in response)
- [ ] `POST /api/users/login` — verifies credentials, issues JWT
- [ ] `GET /api/users/me` — returns profile from valid token
- [ ] `JwtFilter` rejects requests with missing/invalid/expired token (401)
- [ ] Duplicate email registration returns a clear 409, not a raw DB error

## 2. Organizations (PRD FR-2.x)

- [ ] `POST /api/organizations` — creates org, inserts creator into `organization_members` as `ADMIN`
- [ ] `GET /api/organizations` — lists only orgs the caller belongs to
- [ ] `GET /api/organizations/{orgId}` — 403 if caller isn't a member, 404 if org doesn't exist
- [ ] `POST /api/organizations/{orgId}/members` — only `ADMIN` of that org can add members
- [ ] Role escalation guarded: a `MEMBER` cannot add someone as `ADMIN` (see coding-rules.md)

## 3. Teams (PRD FR-3.x)

- [ ] `POST /api/organizations/{orgId}/teams` — org `ADMIN` only
- [ ] `GET /api/organizations/{orgId}/teams` — any org member
- [ ] `GET /api/teams/{teamId}` — 403 if caller has no relationship to the parent org
- [ ] `POST /api/teams/{teamId}/members` — assigns `LEAD`/`MEMBER`, restricted appropriately

## 4. Projects (PRD FR-4.x)

- [ ] `POST /api/teams/{teamId}/projects` — team `LEAD` only, accepts optional resource links at creation
- [ ] `GET /api/teams/{teamId}/projects` — any team member
- [ ] `GET /api/projects/{projectId}`
- [ ] `PATCH /api/projects/{projectId}` — updates resource links independently, `LEAD` only
- [ ] `DELETE /api/projects/{projectId}` — `LEAD` only

## 5. Cross-Cutting (PRD FR-5.x)

- [ ] `GlobalExceptionHandler` in place, consistent error JSON shape across all modules
- [ ] Every mutating endpoint has a negative-path test (non-member → 403)
- [ ] Postman/Newman collection covers every endpoint above
- [ ] CORS configured for local dev frontend origin only

## 6. Frontend

- [ ] Auth: login/register forms, token stored via `authStore` (Zustand), redirect on 401
- [ ] Org list + create-org modal, wired to React Query
- [ ] Org detail view: shows teams, member list, add-member form (role-gated in UI, but never
      trust this alone — server enforces it)
- [ ] Team detail view: shows projects, member list, add-member form
- [ ] Project detail view: resource links displayed + editable form for `LEAD`s
- [ ] Route guards: unauthenticated users redirected to `/login`

## 7. Phase 1 Exit Criteria

- [ ] All boxes above checked
- [ ] PRD §9 acceptance criteria pass manually (full flow, no DB edits)
- [ ] No references to `milestones`, `issues`, or `progress_logs` anywhere in Phase 1 code
- [ ] `current-task.md` updated to point at Phase 2 kickoff

---

## Phase 2 (reference only — do not start until Phase 1 exit criteria pass)

- [ ] `milestones` CRUD + progress calculation endpoint
- [ ] `issues` CRUD + state machine + assignment
- [ ] `progress_logs` create/list per issue
- [ ] See `PRD.md` §7 and `ARCHITECTURE.md` §4 for full spec when this phase starts
