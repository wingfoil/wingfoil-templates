---
id: bug-005-base-1.0.0-workflow-start-adds-an-instance-plan-whose-workflow-and-phase-are-empty-which-base-s-plan-requires-so-its-submit-fails
type: bug
title: "base 1.0.0: workflow start adds an instance plan whose workflow and phase are empty, which base's plan requires, so its submit fails"
status: approved
severity: "major"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","base","workflow"]
---

## Observed

Found by the session running plan-047 (`methodology/scrum`'s charter, on its own branch; a
composition of `base`, `software` and a draft methodology, its `sw-life-cycle` run on WingFoil
0.3.0), and reproduced here on 2026-10-26 on `base` 1.0.0 composed on its defaults, committed in a
scratch repository, with WingFoil 0.3.0 (`cc31d7a8`):

```
$ wingfoil workflow start retrospective-periodic
Error: plan plan-001-retrospective-periodic was added but not submitted: run wingfoil memory
submit plan-001-retrospective-periodic
  missing required field on submit: workflow, phase
```

(WingFoil prints the first line as one; it is wrapped here.) It exits 1, leaving the plan committed
(`wf(plan): add plan-001-retrospective-periodic`) as `draft` with `workflow: ""` and `phase: ""`.
`base`'s `plan` requires `[title, workflow, phase]` (dl-023, plan-043 ruling 6), but WingFoil
0.3.0's `workflow start` fills only the tokens the plan type's `id_pattern` or `path` declares
(`planTokens`, `dist/core/workflow-start-end.js`; its spec-017 §7.1): `{workflow}` as the workflow's
name, `{phase}` as the element's id or `1`, `{scope}` as the name. WingFoil's own `plan`
(`{workflow}-{phase}-plan`, path `docs/05_plans/{scope}/{id}.md`) declares them, so its required
list is filled; `base`'s defaults (`plan_id` `plan-{n}-{slug}`, `plan_path` `docs/plans/{id}.md`)
declare none. The requirement was taken from WingFoil without the `id_pattern` it relies on (the
charter notes that WingFoil and UI set `{workflow}-{phase}-plan`). WingFoil behaves as its
specification says: the defect is `base`'s. Every adopter of `base`'s defaults meets it at every
`main` start, `software`'s included.

Workarounds: edit the plan's `workflow` and `phase` by hand, then `memory submit`; or compose with
`plan_id` set to `{workflow}-{phase}-plan`, which `start` then fills (checked: plan
`retrospective-periodic-1-plan`, `active`, exit 0). `workflow start` refuses `--set workflow=…`
("workflow start sets only phase and scope", exit 2).

## Expected

`workflow start <main>` on a composition with `base` on its defaults records the instance as an
`active` plan with no hand edit. The options, for the triage: `plan_id`'s default carrying
`{workflow}` and `{phase}`, WingFoil's own convention (it changes the ids of new plans only, ids
being immutable; `pack-semver` judges whether a patch may do it); or `base`'s `plan` requiring
fewer fields; or, optionally, a request to WingFoil that `start` fill the declared fields whatever
the `id_pattern` (not a defect of WingFoil's).

## Reproduction

1. Compose `base` with `npm run compose` on its defaults (`project_name`, `approver_name`,
   `approver_email`, `agent_name` given) into an empty directory; `git init`, commit.
2. With WingFoil 0.3.0, as the agent: `wingfoil workflow start retrospective-periodic` (or any
   `main` of `base`, e.g. `decision-log-ingest`): the error above, exit 1, the plan committed as
   `draft` with `workflow: ""` and `phase: ""`.
3. Composed with `plan_id={workflow}-{phase}-plan` instead: `start` exits 0 and the plan is
   `active`.

## Execution Notes
- 2026-10-26: independent review: request changes, two blocking: the cause (WingFoil fills
  `workflow` and `phase` only for tokens the `id_pattern` or `path` declares, `base`'s defaults
  declare none) and the exit code (1, not 0). Applied, with the non-blocking ones: the options for
  the triage, `plan_id`'s default first; the workarounds; plan-047's place; a long line.
- 2026-10-26: re-review: approve; its nit applied (the wrapped output line marked). Submitted.
- 2026-10-27: fixed on `main` by the merge `52db4dc` (task-054, plan-049); to be released in
  `base` 2.0.0 (plan-049 step 8). task-053's `check:runs` drives it on WingFoil 0.3.0.
