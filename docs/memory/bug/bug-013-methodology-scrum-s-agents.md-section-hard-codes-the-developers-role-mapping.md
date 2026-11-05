---
id: bug-013-methodology-scrum-s-agents.md-section-hard-codes-the-developers-role-mapping
type: bug
title: "methodology/scrum's AGENTS.md section hard-codes the Developers' role mapping"
status: draft
severity: "minor"        # critical | major | minor
pack: "pack-methodology-scrum"
tags: ["packs","feedback"]
---

## Observed

Reported by WingFoil UI after adopting `methodology/scrum` 1.0.0 by hand (2026-11-02). `scrum`'s
AGENTS.md section (`packs/methodology/scrum/agents/section.md`) states by value: "**Roles:** the
Product Owner is `product-owner`, the Scrum Master `facilitator`, the Developers `developer` with
`architect`, `reviewer`, `qa` and `tech-lead`." The mapping lives in the workflows' phase `role:`
fields (`sprint` uses `product-owner` and `facilitator`, `backlog-item` `developer` and `reviewer`)
and in the roles `dna.yaml` declares; `roles.yaml` binds directives to roles and holds no mapping. A
project that changes those roles in its workflows or its `dna.yaml` gets a generated region that
contradicts its configuration (as bug-012 for `software`'s section).

## Expected

The section names the mapping as `scrum`'s default and points to the workflows' roles and `dna.yaml`
› `team` for the project's own, or takes the mapping from parameters with defaults (spec-001 §8).

## Reproduction

1. WingFoil 0.3.2 (`6de2e13c`), `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0
   composed from the tree at the tag `methodology/scrum@1.0.0` (`6373282`: `git worktree add <dir>
   methodology/scrum@1.0.0`, then `npm ci` and `npm run build` there) with `npm run compose --
   --tree <tag tree> --out <dir> --param project_name=… --param approver_name=… --param
   approver_email=… --param agent_name=… base software methodology/scrum`; a scratch repository with
   `git init`, `wingfoil init --template Scrum --no-interactive`, the composed `.wingfoil/` copied
   over and `init`'s custom workflows and directives removed (the READMEs' steps); `wingfoil
   workflow list --format json` shows no diagnostic.
2. The composer's `AGENTS.region.md` holds the sentence above.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: captured under plan-064 (`bug-ingest` › `capture`), from WingFoil UI's adoption
  feedback of 2026-11-02, reproduced on WingFoil 0.3.2 (plan-064 › Execution Notes, step 1).
  Severity `minor`, proposed: as bug-012; fixed by the next release of `methodology/scrum`.
- 2026-11-05: independent review: approve after amendments, nothing blocking; applied: where the
  mapping lives (the workflows' roles and `dna.yaml`, not `roles.yaml`), how to get the tag's tree.
- 2026-11-05: re-review: approve.
