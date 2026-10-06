---
id: bug-001-kanban-delivery-runs-tooling-tasks-as-pack-author-without-the-developer-directives
type: bug
title: "kanban-delivery runs tooling tasks as pack-author, without the developer directives"
status: pending
severity: minor
pack: ""
---

## Observed

`memory.yaml` defines a `bug` as a defect of a pack or of this repository's tooling. This one is in
the repository's `.wingfoil/` configuration, which runs the tooling's delivery loop, so it is filed
here rather than in `docs/wingfoil-feedback/`: WingFoil reads the configuration correctly.

`kanban-delivery` (version 2) is included by three workflows:
- `pack-cycle` › `deliver`, for the tasks of a pack;
- `sw-life-cycle` › `tooling`, for the tasks with no pack (dl-005 G7);
- `tooling-change` › `deliver`, for later tooling tasks.

Its `design`, `build` and `deliver` phases all have `role: pack-author`, though the `build`
description reads "Write the pack content (pack-authoring) or the tooling (code-quality, testing)".
The directives loaded for that role do not cover tooling work (`npx wingfoil directives list --role
…`, WingFoil 0.2.2, 2026-10-06):

| Role | Directives |
|---|---|
| `pack-author` | documentation, security, determinism, doc-versioning, pack-authoring, pack-semver, security-secrets, wingfoil-feedback |
| `developer` | code-quality, documentation, security, testing, determinism, doc-versioning, security-secrets, wingfoil-feedback |

A tooling task followed to the letter is built without `code-quality` and `testing`, and with
`pack-authoring` and `pack-semver`, which do not apply to it. `dna.yaml` describes `developer` as
the role that "writes the repository tooling", and no workflow phase uses it.

The `reviewer` role has the pack directives but neither `code-quality` nor `testing`. The `review`
phase says "check against the directives of the roles involved", so a reviewer can load the
developer's directives too; that phase is not affected.

## Expected

The `design`, `build` and `deliver` phases of a tooling task run as `developer`, and those of a pack
task as `pack-author`.

## Reproduction

1. On `main` at `6228faa`: `npx wingfoil workflow list`, and read `kanban-delivery` and the three
   workflows that include it.
2. `npx wingfoil directives list --role pack-author` and `--role developer`.

## Execution Notes

Found on 2026-10-06 while planning `sw-life-cycle` › `tooling` (plan-015). Until it is fixed, the
tooling tasks follow the approver's instruction of 2026-10-06: builds load the `developer`
directives.

Fix options, for the approver's triage. A phase has one role in WingFoil 0.2.2, so it cannot depend
on the element.
- **(a) A `tooling-delivery` sub-workflow, recommended.** The same loop as `kanban-delivery`, with
  `developer` in `design`, `build` and `deliver`. `sw-life-cycle` › `tooling` and `tooling-change`
  include it; `kanban-delivery` stays for `pack-cycle`, and its `build` description loses the
  tooling clause. Cost: two loops to keep in step (states, WIP, gates). The review of every change
  to either file checks that the two differ only in roles and descriptions; a lint rule (task 9 of
  plan-015) can automate it.
- **(b) `developer` everywhere,** with `pack-authoring` and `pack-semver` added to `developer`'s
  assignments in `roles.yaml`. Cost: blurs the two roles of `dna.yaml`, and pack authors get
  `code-quality` and `testing`.
- **(c) No change,** documented in the plans. Cost: the declared role keeps being wrong, which is
  what this repository exists to avoid in its packs (WingFoil benchmark note N1).

The fix is a configuration change, applied with the follow-ups of plan-015 step 2, with a
`version:` bump of every changed file and a new `include` in `workflows.yaml`.

- 2026-10-06: the approver ruled **fix (a)** in chat ("ok fix (a)"), and asked for this bug to be
  amended while `pending` after an independent review (plan-015 Execution Notes): the scope of a
  configuration defect as a `bug`, and how the two loops are kept in step. The fix is applied with
  the configuration follow-ups of plan-015 step 2.
