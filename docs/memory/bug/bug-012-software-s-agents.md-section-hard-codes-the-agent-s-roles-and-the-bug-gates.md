---
id: bug-012-software-s-agents.md-section-hard-codes-the-agent-s-roles-and-the-bug-gates
type: bug
title: "software's AGENTS.md section hard-codes the agent's roles and the bug gates"
status: draft
severity: "minor"        # critical | major | minor
pack: "pack-foundation-software"
tags: ["packs","feedback"]
---

## Observed

Reported by WingFoil UI after adopting `software` 1.0.0 by hand (2026-11-02). `software`'s AGENTS.md
section (`packs/software/agents/section.md`) states by value: "**{{agent_name}} acts as developer,
reviewer, qa and architect** … A `bug` at `triaged` or `planned`, including one parked back to
`planned`, moves only by the approver's `approve`." The roles are a copy of `software`'s `dna.yaml`
fragment (`executes_as: [developer, reviewer, qa, architect]`), and the section names two of the
`bug` type's five gates (`triaged`, `planned`; also `open`, `in-review`, `resolved`) by value. The
default composition already disagrees: `team.agents` merges `executes_as` as a set (spec-001 §7.3),
`base` gives `[facilitator, product-owner]`, so the composed agent holds six roles, while the region
says four and `base`'s section names none. A project whose `dna.yaml` gives the agent other roles,
or whose `memory.yaml` tightens or changes the `bug` gates, gets a generated region that contradicts
its own configuration, and must correct it outside the region (spec-001 §10: the project owns only
the rest of the file).

## Expected

The section names where the facts live instead of copying them: the agent's roles are those
`dna.yaml` › `team.agents` gives it, and a `bug` moves through its gates as `memory.yaml` declares
them, only by the approver's `approve`; or, if a value is kept, it comes from a parameter with a
default (spec-001 §8), so that a project's choice reaches the region.

## Reproduction

1. WingFoil 0.3.2 (`6de2e13c`), `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0
   composed from the tree at the tag `methodology/scrum@1.0.0` (`6373282`: `git worktree add <dir>
   methodology/scrum@1.0.0`, then `npm ci` and `npm run build` there) with `npm run compose --
   --tree <tag tree> --out <dir> --param project_name=… --param approver_name=… --param
   approver_email=… --param agent_name=… base software methodology/scrum`; a scratch repository with
   `git init`, `wingfoil init --template Scrum --no-interactive`, the composed `.wingfoil/` copied
   over and `init`'s custom workflows and directives removed (the READMEs' steps); `wingfoil
   workflow list --format json` shows no diagnostic.
2. The composer's `AGENTS.region.md` reads "`<agent_name>` acts as developer, reviewer, qa and
   architect" and names the `bug` gates at `triaged` and `planned`, whatever the project's
   `dna.yaml` and `memory.yaml` later say; the composed `.wingfoil/dna.yaml` ›
   `team.agents[0].executes_as` lists six roles: `facilitator`, `product-owner`, `developer`,
   `reviewer`, `qa`, `architect`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: captured under plan-064 (`bug-ingest` › `capture`), from WingFoil UI's adoption
  feedback of 2026-11-02, reproduced on WingFoil 0.3.2 (plan-064 › Execution Notes, step 1).
  Severity `minor`, proposed: a generated text that can disagree with the project's configuration,
  with no failing command; fixed by the next release of `software`.
- 2026-11-05: independent review: approve after amendments, nothing blocking; applied: two of the
  five gates named, the default composition's six roles against the region's four (reproduced),
  `<agent_name>`, how to get the tag's tree.
- 2026-11-05: re-review: approve (its nit applied). bug-011, bug-013, bug-014 and bug-015 likewise
  approved by the re-review.
