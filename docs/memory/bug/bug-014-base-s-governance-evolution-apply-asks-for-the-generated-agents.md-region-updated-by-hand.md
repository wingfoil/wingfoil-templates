---
id: bug-014-base-s-governance-evolution-apply-asks-for-the-generated-agents.md-region-updated-by-hand
type: bug
title: "base's governance-evolution apply asks for the generated AGENTS.md region updated by hand"
status: draft
severity: "minor"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","feedback"]
---

## Observed

Reported by WingFoil UI after adopting `base` 2.0.1 by hand (2026-11-02). `base`'s workflow
`governance-evolution` › `apply` says: "Apply the change, CLI verbs first, with version bumps and
AGENTS.md updated." The part of AGENTS.md that the packs write is the generated region (spec-001
§10), built from the packs' sections and parameters, not from the project's `.wingfoil/`: a local
change of governance does not change it, a hand edit inside it is lost at the next regeneration, and
it is regenerated only by running the composer again with the packs and parameters, then pasted by
hand, until WingFoil exports AGENTS.md (spec-001 §10).

## Expected

`apply` asks for AGENTS.md updated outside the generated region (the project's part, spec-001 §10),
and says that the region changes only with a pack version, a parameter value or the composition (a
pack added or removed), regenerated (pasted by hand until WingFoil exports AGENTS.md).

## Reproduction

1. WingFoil 0.3.2 (`6de2e13c`), `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0
   composed from the tree at the tag `methodology/scrum@1.0.0` (`6373282`: `git worktree add <dir>
   methodology/scrum@1.0.0`, then `npm ci` and `npm run build` there) with `npm run compose --
   --tree <tag tree> --out <dir> --param project_name=… --param approver_name=… --param
   approver_email=… --param agent_name=… base software methodology/scrum`; a scratch repository with
   `git init`, `wingfoil init --template Scrum --no-interactive`, the composed `.wingfoil/` copied
   over and `init`'s custom workflows and directives removed (the READMEs' steps); `wingfoil
   workflow list --format json` shows no diagnostic.
2. The composed `.wingfoil/workflows/built-in/governance-evolution.yaml` › `apply` holds the
   sentence above; the composer's region is the separate output `AGENTS.region.md`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: captured under plan-064 (`bug-ingest` › `capture`), from WingFoil UI's adoption
  feedback of 2026-11-02, reproduced on WingFoil 0.3.2 (plan-064 › Execution Notes, step 1).
  Severity `minor`, proposed: a phase's instruction that leads to an edit the region forbids, with
  no failing command; fixed by the next release of `base`.
- 2026-11-05: independent review: approve after amendments, nothing blocking; applied: regeneration
  by the composer, the composition as a cause, how to get the tag's tree.
