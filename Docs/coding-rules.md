# Coding Rules

Non-negotiables first, style preferences after. If a rule here conflicts with a general
best-practice you know, **this file wins** for this repo.

## Non-Negotiables

1. **No JPA/Hibernate entities or repositories.** Backend data access is `JdbcTemplate` with
   hand-written, parameterized SQL. This is a deliberate architectural choice
   (`ARCHITECTURE.md §11`), not an oversight — do not "improve" it by introducing an ORM.
2. **No string-concatenated SQL, ever.** Use `?` placeholders and `JdbcTemplate` parameter
   binding, even for values you believe are safe (enum-like status strings, IDs, everything).
3. **No Phase 2+ code while `current-task.md` scopes to Phase 1.** Don't create `issues`,
   `milestones`, or `progress_logs` tables, entities, or endpoints early "to save time later."
4. **Role checks live in the service layer**, scoped to the specific org/team/project in
   question. Do not rely solely on a global `@PreAuthorize("hasRole('ADMIN')")` — it can't
   express "admin of *this* org," which is what every check in this system actually needs.
5. **Every request DTO gets Bean Validation annotations** (`@NotBlank`, `@Email`, `@Size`,
   etc.). Don't hand-roll null checks in the controller for things validation annotations
   already cover.
6. **Passwords are never logged, returned in responses, or included in DTOs outbound from the
   API.** `User` response DTOs must not contain `password_hash`, full stop.

## Backend Conventions (Spring Boot)

- **Package by feature**, not by layer. See `ARCHITECTURE.md §3` for the exact tree.
- Controllers are thin: parse request → call service → map result to response DTO. No business
  logic, no direct repository calls from a controller.
- Services return domain objects or DTOs, never raw `ResultSet` or JDBC types.
- Repositories return the module's own model type (e.g. `Organization`), constructed via a
  `RowMapper`. Keep `RowMapper`s as static nested classes or separate small classes, not
  inline lambdas repeated across methods.
- Exceptions: throw specific typed exceptions (`OrganizationNotFoundException`,
  `ForbiddenException`) from the service layer; let `GlobalExceptionHandler` translate them to
  HTTP responses. Don't return `ResponseEntity.status(403)` scattered across controllers.
- Naming: `XController`, `XService`, `XRepository`, `X` (model), `XRequest`/`XResponse` (DTOs).
- Migrations: every schema change is a new Flyway file (`V{n}__description.sql`), never edit an
  already-applied migration.

## Frontend Conventions (React + TypeScript)

- Function components + hooks only. No class components.
- Server data access goes through `api/endpoints/*.ts` functions, called from React Query
  hooks (`useOrganizations()`, `useCreateOrganization()`) — components never call `fetch`/
  `axios` directly.
- Forms use a schema-validation library (zod) with the same shape as the backend's request
  DTO — keep these two definitions close enough that a backend DTO change is easy to mirror.
- No prop-drilling more than one level for auth state — pull from `authStore` (Zustand) via
  the `useAuthStore()` hook instead.
- Tailwind utility classes directly in JSX; extract a component (not a `@apply` class) once a
  pattern repeats 3+ times.
- No `any` in TypeScript without a comment explaining why it's unavoidable.

## Commit / PR Hygiene

- One logical change per commit. "Add project resource-link PATCH endpoint" not "backend
  stuff."
- Commit messages reference the PRD requirement ID where applicable (e.g. `FR-4.3`).
- If a commit updates `implementation-checklist.md`, that's expected and fine — don't split it
  into a separate commit.

## Things That Trigger a Second Look, Not Automatic Rejection

- A new third-party dependency — flag it in your response to the human before adding it.
- Any change to `docs/agent/*` files themselves — these should reflect deliberate process
  changes, not incidental edits made while doing something else.
