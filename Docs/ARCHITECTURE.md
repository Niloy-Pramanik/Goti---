# Prokoi — Architecture Document

**Version:** 1.0 · **Scope:** Full system design, Phase 1 implementation is the current target.

---

## 1. System Architecture (High Level)

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────────┐        JDBC        ┌──────────────┐
│   React SPA      │ ───────────────────────▶ │  Spring Boot API      │ ──────────────────▶│  PostgreSQL   │
│  (Vite + RTQ)     │ ◀─────────────────────── │  (REST, stateless)    │ ◀──────────────────│  (single DB)  │
└─────────────────┘        JWT in header      └──────────────────────┘   raw SQL/JdbcTemplate└──────────────┘
```

- **Stateless API**: no server-side session. Every request carries a JWT; the server verifies
  and derives identity/roles per-request. This lets you horizontally scale the backend later
  with zero session-affinity concerns.
- **Single Postgres instance** for v1 — no read replicas, no caching layer. Add Redis only if a
  real bottleneck shows up (it won't, at this scale).
- **No API gateway / BFF** — the React app talks directly to Spring Boot. Justified because
  there's one frontend consumer; add a gateway only if a second client (mobile) appears.

## 2. Module Boundaries

Boundaries are drawn around the **domain nouns from the PRD**, not around technical layers.
Each module owns its controller, service, repository, and DTOs — a "package by feature" backend.

| Module | Owns | Depends on |
|---|---|---|
| `auth` | Registration, login, JWT issuance/validation, password hashing | `users` |
| `users` | User CRUD (mostly read: `/me`) | — |
| `organizations` | Org CRUD, `organization_members` | `users` |
| `teams` | Team CRUD, `team_members` | `organizations`, `users` |
| `projects` | Project CRUD, resource links | `teams` |
| `milestones` *(Phase 2)* | Milestone CRUD, progress calculation | `projects` |
| `issues` *(Phase 2)* | Issue CRUD, state machine, assignment | `projects`, `milestones`, `users` |
| `progresslogs` *(Phase 2)* | Delay/blocker logging | `issues`, `users` |

**Rule:** a module may call another module's *service* interface, never reach into another
module's repository or entity directly. This keeps the Phase 1 ↔ Phase 2 boundary real, not
just documented — `organizations`/`teams`/`projects` must compile and run with zero knowledge
of `issues` existing.

## 3. Folder Structure

### Backend (`/backend`, Maven, package-by-feature)

```
backend/
├── src/main/java/com/prokoi/
│   ├── auth/
│   │   ├── AuthController.java
│   │   ├── AuthService.java
│   │   ├── JwtProvider.java
│   │   └── dto/ (RegisterRequest, LoginRequest, AuthResponse)
│   ├── users/
│   │   ├── UserController.java
│   │   ├── UserService.java
│   │   ├── UserRepository.java      # JdbcTemplate-based
│   │   ├── User.java                 # entity/record
│   │   └── dto/
│   ├── organizations/
│   │   ├── OrganizationController.java
│   │   ├── OrganizationService.java
│   │   ├── OrganizationRepository.java
│   │   ├── OrganizationMemberRepository.java
│   │   ├── Organization.java
│   │   └── dto/
│   ├── teams/            # same pattern
│   ├── projects/         # same pattern
│   ├── common/
│   │   ├── exception/    # GlobalExceptionHandler, custom exceptions
│   │   ├── security/     # SecurityConfig, JwtFilter, role-check annotations
│   │   └── response/     # ApiResponse<T> wrapper, pagination envelope
│   └── ProkoiApplication.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   └── db/migration/     # Flyway: V1__init_phase1.sql, V2__phase2_issues.sql ...
└── src/test/java/com/prokoi/...     # mirrors main structure
```

### Frontend (`/frontend`, Vite + React + TypeScript)

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts              # axios/fetch instance, JWT interceptor
│   │   └── endpoints/             # organizations.ts, teams.ts, projects.ts, auth.ts
│   ├── features/
│   │   ├── auth/            (LoginForm, RegisterForm, useAuth hook)
│   │   ├── organizations/   (OrgList, OrgDetail, CreateOrgModal)
│   │   ├── teams/
│   │   └── projects/
│   ├── store/
│   │   └── authStore.ts           # Zustand — current user, token
│   ├── components/                # shared/dumb UI: Button, Modal, RoleBadge
│   ├── routes/                    # React Router route tree, guarded routes
│   ├── lib/                       # queryClient setup, validation schemas (zod)
│   └── main.tsx
└── vite.config.ts
```

**Rule:** `features/*` may import from `api/`, `components/`, `lib/` — never from another
`features/*` directory. Cross-feature composition happens at the route level.

## 4. Data Model

Full schema (Phase 1 + Phase 2, carried from the original design) — see table definitions
below. Phase 1 implements only `users`, `organizations`, `organization_members`, `teams`,
`team_members`, `projects`. Phase 2 adds `milestones`, `issues`, `progress_logs`.

```
users ──< organization_members >── organizations ──< teams >── team_members ──> users
                                                        │
                                                        └──< projects >──< milestones (P2) >──< issues (P2) >──< progress_logs (P2)
                                                                                                     └──> assignee (users, P2)
```

Column-level definitions are unchanged from the original design doc (see `db/migration/`
Flyway scripts as the executable source of truth once written — this markdown is descriptive,
not authoritative, after migrations exist).

**Indexing plan (Phase 1):**
- `organization_members(org_id, user_id)` — composite PK, also serves the "is member" check.
- `team_members(team_id, user_id)` — composite PK, same reasoning.
- `teams(org_id)`, `projects(team_id)` — FK columns indexed for list-endpoint performance.
- `users(email)` — unique index, doubles as login lookup index.

## 5. State Management (Frontend)

**Decision:** React Query (`@tanstack/react-query`) for all server state (orgs/teams/projects/
issues) + Zustand for pure client/UI state (current auth token, active org context, modal
open/closed).

**Why not Redux Toolkit:** RTK Query duplicates what React Query already does well, and adds
boilerplate (slices, reducers) for state that's fundamentally a cache of server data, not
client-owned state. Zustand covers the small amount of genuinely local state without ceremony.

**Rule:** if data comes from an API, it lives in a React Query cache keyed by
`['orgs']`, `['orgs', orgId, 'teams']`, etc. — never copied into Zustand. Zustand only holds
things the server doesn't know about (UI toggles, selected-org-in-sidebar).

## 6. Communication Flow

1. **Login:** `POST /api/users/login` → JWT returned → stored in memory (Zustand) + optionally
   `localStorage` for refresh-on-reload (accepted tradeoff for v1; XSS risk noted, mitigated by
   React's default escaping and no `dangerouslySetInnerHTML` usage anywhere in the app).
2. **Every subsequent request:** `Authorization: Bearer <token>` header, attached via an axios
   request interceptor in `api/client.ts`.
3. **Server-side:** `JwtFilter` (Spring Security filter chain) validates the token, populates
   the security context with `userId` before the request reaches any controller.
4. **Authorization:** controllers call service-layer methods that re-check membership (e.g.
   "is this userId in `organization_members` for this `orgId`?") — this is not delegated to
   annotations alone, because role checks here are relational (scoped to a specific org/team),
   not global (`hasRole('ADMIN')` doesn't capture "admin of *which* org").
5. **Errors:** `GlobalExceptionHandler` maps domain exceptions (`NotFoundException`,
   `ForbiddenException`, `ValidationException`) to consistent JSON error bodies:
   `{ "error": "FORBIDDEN", "message": "..." }`.

## 7. Storage Strategy

- **Relational data:** PostgreSQL, single schema, Flyway-managed migrations. No ORM
  (Hibernate/JPA) — `JdbcTemplate` with hand-written SQL per the user's stated preference for
  raw, predictable JOINs. This is a deliberate tradeoff: more boilerplate mapping `ResultSet`
  → DTOs, in exchange for full query visibility and no N+1 surprises.
- **Files/attachments:** out of scope for Phase 1–2. When added, plan is object storage
  (S3-compatible, e.g. MinIO for local dev) referenced by URL in a new `attachments` table —
  never store binary blobs in Postgres.
- **Secrets/config:** Spring profiles (`application-dev.yml`, `application-prod.yml`) +
  environment variables for anything sensitive (`JWT_SECRET`, `DB_PASSWORD`). Never committed.

## 8. Security Model

| Concern | Approach |
|---|---|
| Password storage | BCrypt, cost factor 10+ |
| Session/auth | Stateless JWT, short expiry (24h), signed with `HS256` + server-held secret |
| Authorization | Relational role checks in service layer (org/team scoped), not just global roles |
| Transport | HTTPS assumed in deployment; local dev over HTTP is acceptable |
| Input validation | Bean Validation (`jakarta.validation`) on all request DTOs; reject before hitting service layer |
| SQL injection | Parameterized queries only — `JdbcTemplate` with `?` placeholders, never string concatenation |
| CORS | Explicit allow-list of the frontend origin(s) in `SecurityConfig`, not `*` |
| Role escalation | A user can only assign roles ≤ their own level within a scope (e.g. a `MEMBER` cannot promote themself to `ADMIN`) — enforce in service layer |

## 9. Testing Strategy

| Layer | Tool | What it covers |
|---|---|---|
| Backend unit | JUnit 5 + Mockito | Service-layer logic, role-check branches, edge cases (empty org, duplicate email) |
| Backend integration | `@SpringBootTest` + Testcontainers (Postgres) | Full request → DB round trip per endpoint, including 403 paths |
| Frontend unit | Vitest + React Testing Library | Component behavior, form validation, hook logic |
| Frontend integration | RTL + MSW (mock service worker) | Feature flows (create org → see it in list) without a live backend |
| API contract | Postman/Newman collection (exported to repo) | Smoke-tests the documented endpoints against a running instance in CI |

**Rule tied to Definition of Done:** no Phase 1 endpoint is "complete" without at least one
integration test proving the happy path and one proving the 403/permission-denied path.

## 10. Deployment Architecture

**v1 target: single-VM Docker Compose**, appropriate for an academic project's scale.

```
docker-compose.yml
├── postgres        (official image, named volume for persistence)
├── backend          (multi-stage Dockerfile: Maven build → JRE runtime image)
└── frontend         (multi-stage: Vite build → static files served via Nginx)
```

- `backend` reads DB connection + JWT secret from environment variables injected by Compose
  (`.env` file, gitignored).
- `frontend`'s Nginx config reverse-proxies `/api/*` to the `backend` service, so the SPA and
  API appear same-origin in production (avoids CORS entirely in prod; CORS config in
  `SecurityConfig` is only exercised in local dev where frontend runs on a different port).
- Flyway migrations run automatically on backend container startup (`spring.flyway.enabled=true`).
- **Future (not v1):** CI pipeline (GitHub Actions) running backend + frontend test suites on
  every PR, and a separate deploy step. Not required to satisfy Phase 1 scope, but the folder
  structure above (`src/test/...`, Postman collection) is already CI-ready when you get there.

## 11. Key Architectural Trade-offs (Explicit)

| Decision | Trade-off accepted |
|---|---|
| `JdbcTemplate` over JPA/Hibernate | More boilerplate, but full SQL visibility and no N+1/lazy-loading surprises — matches stated preference and keeps query cost predictable for grading demos. |
| React Query + Zustand over Redux Toolkit | Less "standard enterprise" boilerplate; slightly less familiar to some reviewers, but faster to build and reason about at this scope. |
| No API gateway | Simpler for one client; would need revisiting if a mobile app or second frontend is added. |
| JWT in `localStorage` | Simplicity over XSS-hardening; acceptable given no `dangerouslySetInnerHTML` and controlled dependency surface. Revisit with httpOnly cookies if the project ever handles real user data. |
| Single Postgres, no cache layer | Fine at academic-project scale; would need Redis/read-replicas only under real concurrent load. |
| Package-by-feature (not layer-by-type) | Keeps Phase 1/Phase 2 boundaries enforceable; slightly less familiar than `controllers/`, `services/`, `repositories/` top-level split some Spring tutorials use. |
