---
id: bug-015-methodology-scrum-a-sprint-field-naming-no-sprint-is-accepted-and-the-element-is-never-selected
type: bug
title: "methodology/scrum: a sprint field naming no Sprint is accepted, and the element is never selected"
status: draft
severity: "minor"        # critical | major | minor
pack: "pack-methodology-scrum"
tags: ["packs","feedback"]
---

## Observed

Reported by WingFoil UI after adopting `methodology/scrum` 1.0.0 by hand (2026-11-02). A task's
`sprint` field naming a Sprint that does not exist is accepted at `memory submit`. `scrum`'s
`sprint` workflow selects a Sprint's work by that field: `development` iterates over the tasks
`where: { …, sprint: "{sprint.id}" }` and `release` over the releases with the same key
(`packs/methodology/scrum/workflows/sprint.yaml`). A task or a release whose `sprint` is misspelt,
or names a Sprint never created, is therefore never selected by any Sprint, with no message. The
field is written by editing (`sprint-planning` writes it into the tasks, `plan-release` into the
release's draft); no action of the pack sets it. WingFoil 0.3.2 checks no reference, and a pack
cannot add a check: a `checks.post` token resolves only through a project's `bindings.yaml`, which
packs do not ship (spec-001 O4), and an unbound token is a `workflow list` warning
`pack-compatibility` does not allow.

## Expected

`scrum`'s `sprint-planning` and `plan-release` name the risk and ask that the field be checked
against the Sprint's id when written, and the `sprint` directive or `backlog-item`'s description
says that an element whose `sprint` names no Sprint is never selected. WingFoil's side, a
frontmatter field declared as a reference to an element of a type and checked, is a feedback note
(plan-064 point 3 (d)).

## Reproduction

1. WingFoil 0.3.2 (`6de2e13c`), `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0
   composed from the tree at the tag `methodology/scrum@1.0.0` (`6373282`) with `npm run compose --
   --tree <tag tree> --out <dir> --param project_name=… --param approver_name=… --param
   approver_email=… --param agent_name=… base software methodology/scrum`; a scratch repository with
   `git init`, `wingfoil init --template Scrum --no-interactive`, the composed `.wingfoil/` copied
   over and `init`'s custom workflows and directives removed (the READMEs' steps); `wingfoil
   workflow list --format json` shows no diagnostic.
2. `wingfoil memory add --type task --title "Repro task"`; add `sprint: sprint-099-does-not-exist`
   to its frontmatter and commit; `wingfoil memory search --type sprint`: no match.
3. `wingfoil memory submit task-001-repro-task`: exit 0, `draft → pending`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: captured under plan-064 (`bug-ingest` › `capture`), from WingFoil UI's adoption
  feedback of 2026-11-02, reproduced on WingFoil 0.3.2 (plan-064 › Execution Notes, step 1).
  Severity `minor`, proposed: the pack can only name the risk; the check is WingFoil's (a feedback
  note); fixed by the next release of `methodology/scrum`.
