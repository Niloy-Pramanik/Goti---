# Decision Framework

Guidance for when to just proceed, and when to stop and ask the human. Defaulting to "ask
about everything" is as much a failure mode as "ask about nothing" — this file draws the line.

## Proceed Without Asking

- Implementing something already fully specified in `PRD.md` / `ARCHITECTURE.md` /
  `implementation-checklist.md` — just build it.
- Following an established pattern from a sibling module (e.g. `projects/` mirroring
  `teams/`'s structure) — consistency doesn't need sign-off.
- Writing tests for existing, unambiguous behavior.
- Fixing a bug where the correct behavior is clear from the spec or from surrounding code.
- Naming/formatting decisions that `coding-rules.md` already covers.
- Minor refactors that don't change behavior (extracting a method, renaming for clarity) —
  do these, but call them out in your summary so the human isn't surprised by an unrequested
  diff.

## Stop and Ask

- **A task seems to require a Phase 2+ concept while Phase 1 is still active** (e.g. "add a
  progress endpoint" implies `issues`/`milestones` don't exist yet). Don't quietly build the
  dependency — flag the scope conflict and ask whether to expand scope or defer.
- **The spec is genuinely ambiguous or self-contradictory.** E.g. PRD §10's open questions
  (invite-based org membership vs. direct-add) — if a task depends on the unresolved answer,
  ask rather than picking arbitrarily and hoping it sticks.
- **A schema change** — adding/removing/renaming a column or table. This is expensive to
  reverse once other code depends on it; get explicit confirmation of the exact change before
  writing the migration.
- **A security-relevant decision not already covered by `coding-rules.md`** — e.g. how long
  should JWTs live, should refresh tokens exist, should failed-login attempts be rate-limited.
  These have real consequences and aren't "just pick something reasonable" territory.
- **Adding a new third-party dependency** not already in the stack — flag it, explain why it's
  needed, let the human approve before it lands in `pom.xml`/`package.json`.
- **A request conflicts with an explicit rule in `coding-rules.md` or `ARCHITECTURE.md`**
  (e.g. someone asks for a JPA repository). Point out the conflict and the documented
  rationale before proceeding — don't silently comply, and don't silently refuse either.
- **You're about to delete or overwrite data-bearing code/migrations** with no clear rollback.

## How to Ask

Keep it short and concrete — state the conflict or ambiguity, give the options, state which
option you'd default to and why, and let the human pick or override.

> Example: "PRD §10 leaves org membership as invite-vs-direct-add unresolved. The task you
> gave me (add-member endpoint) needs to pick one. Defaulting to direct-add (matches the v1
> default noted in the PRD) unless you want invite-based — let me know."

## Escalation Is Not Failure

Stopping to ask on a genuinely ambiguous or high-stakes point is the correct outcome, not a
sign the agent couldn't figure it out. The cost of a wrong guess on a schema change or a scope
boundary is much higher than the cost of one clarifying question.
