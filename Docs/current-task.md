# Current Task

> Update this file whenever the active task changes. This is the first thing an agent should
> trust over its own assumptions about "what we're doing right now." Keep it short — this is a
> pointer, not a spec (specs live in `PRD.md`).

---

**Phase:** Phase 1 — Core Foundation
**Status:** Not started / In progress / Blocked *(edit as work proceeds)*
**Last updated:** *(set on first real task)*

## Active Goal

Get Phase 1 fully working end-to-end: register → login → create org → create team →
create project → set resource links, with role-based access enforced at every step.

## Current Sub-task

*(Fill in before starting work, e.g.:)*
> Implementing `POST /api/organizations` — org creation + auto-assigning creator as `ADMIN`
> in `organization_members`.

## Immediate Checklist for This Sub-task

- [ ] Entity/DTO defined
- [ ] Repository method(s) written (raw SQL, `JdbcTemplate`)
- [ ] Service-layer logic + role/permission check
- [ ] Controller endpoint wired up
- [ ] Request validation (Bean Validation annotations)
- [ ] Unit test(s): happy path + at least one failure/permission path
- [ ] Integration test against the actual endpoint
- [ ] Matches the exact request/response shape in the API design (PRD/Architecture)
- [ ] Corresponding item checked off in `implementation-checklist.md`

## Blockers / Open Questions

*(List anything that stopped you and needs a human decision — cross-reference
`decision-framework.md` for what counts as "needs a human.")*

- None currently.

## Next Up (after this sub-task)

*(Agent should pull the next unchecked item from `implementation-checklist.md`, in the order
listed there, unless the human redirects.)*
