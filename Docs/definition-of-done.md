# Definition of Done

A feature is **not done** because the code compiles and the happy path works once manually.
It's done when every applicable item below is true. Use this before checking anything off in
`implementation-checklist.md`.

## For a Single Endpoint / Feature

- [ ] **Matches the spec.** Request/response shape matches `PRD.md` / `ARCHITECTURE.md` exactly
      — field names, types, status codes. If you deviated, the docs were updated to match, with
      the human's sign-off (see `decision-framework.md`).
- [ ] **Validated.** Invalid input (missing required field, wrong type, malformed email) returns
      a 400 with a clear error body, not a 500.
- [ ] **Authorized correctly.** At minimum: one test proving an authorized user succeeds, one
      test proving an unauthorized/non-member user gets 403.
- [ ] **No SQL injection surface.** All queries parameterized. Grep for string concatenation
      into SQL as a final check.
- [ ] **Tested.** Unit test(s) for service-layer logic, integration test for the actual HTTP
      endpoint (Testcontainers Postgres, not mocked DB, for the integration layer).
- [ ] **No dead code left behind.** Remove commented-out attempts, `console.log`/`System.out`
      debug statements, unused imports.
- [ ] **Consistent errors.** Errors flow through `GlobalExceptionHandler` (backend) or a shared
      error-handling pattern (frontend) — not ad hoc `try/catch` with inconsistent shapes.
- [ ] **Frontend, if applicable:** loading and error states are handled in the UI, not just the
      success case. A failed request doesn't leave the UI silently stuck.
- [ ] **Checklist updated.** The corresponding line in `implementation-checklist.md` is checked,
      and `current-task.md` reflects what's next.

## For "Phase 1 Complete" (see also PRD §9)

- [ ] Every item in `implementation-checklist.md` Phase 1 sections is checked.
- [ ] A full manual run-through works: register → login → create org → create team → create
      project → edit resource links — no manual DB intervention at any step.
- [ ] Postman/Newman collection runs green against a freshly seeded local environment.
- [ ] Zero references to Phase 2 tables/entities/endpoints anywhere in the codebase.
- [ ] `README.md` at repo root (if present) has accurate setup instructions that a fresh
      clone can follow to get the app running.

## Explicitly NOT Required for Phase 1 Done

- 100% test coverage — aim for meaningful coverage of business logic and permission checks,
  not coverage-for-its-own-sake on trivial getters.
- CI/CD pipeline — noted as future work in `ARCHITECTURE.md §10`, not blocking Phase 1.
- Kanban board / drag-and-drop UI — explicitly out of scope per PRD §3.
