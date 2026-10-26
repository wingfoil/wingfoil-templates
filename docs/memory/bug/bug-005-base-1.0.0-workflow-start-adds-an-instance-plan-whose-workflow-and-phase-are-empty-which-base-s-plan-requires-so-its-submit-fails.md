---
id: bug-005-base-1.0.0-workflow-start-adds-an-instance-plan-whose-workflow-and-phase-are-empty-which-base-s-plan-requires-so-its-submit-fails
type: bug
title: "base 1.0.0: workflow start adds an instance plan whose workflow and phase are empty, which base's plan requires, so its submit fails"
status: draft
severity: "major"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","base","workflow"]
---

## Observed

Found by the session running plan-047 (a composition of `base`, `software` and a draft
methodology, `sw-life-cycle` run on WingFoil 0.3.0), and reproduced here on 2026-10-26 on the
composition of `base` 1.0.0, `software` and the fixture methodology (task-047's defaults), committed
in a scratch repository, with WingFoil 0.3.0 (`cc31d7a8`):

```
$ wingfoil workflow start retrospective-periodic
Error: plan plan-001-retrospective-periodic was added but not submitted: run wingfoil memory submit plan-001-retrospective-periodic
  missing required field on submit: workflow, phase
```

`workflow start` adds the instance's plan from `base`'s `plan` template, whose `workflow` and
`phase` are empty, and commits it (`wf(plan): add plan-001-retrospective-periodic`); its own
`submit` then fails, since `base`'s `plan` requires `[title, workflow, phase]` (charter
`pack-foundation-base`, dl-023, plan-043 ruling 6). The plan stays `draft` until edited by hand.
Every adopter of `base` 1.0.0 that starts a `main` workflow meets it. WingFoil's own `plan` requires
the same three fields at `cc31d7a8`, so the requirement was taken from it; an instance plan spans
the workflow, so it has no `phase`.

## Expected

`workflow start <main>` on a composition with `base` records the instance as an `active` plan with
no hand edit, as WingFoil documents for `workflow start` ("record it as an active plan element").
Which side changes is the triage's: `base`'s `plan` requiring fewer fields (a patch of `base`), or
WingFoil filling them at `start` (a feedback note), or both.

## Reproduction

1. Compose `base` with `npm run compose` (any of `base`'s README examples' parameters) into an
   empty directory; `git init`, commit.
2. With WingFoil 0.3.0: `wingfoil workflow start retrospective-periodic` (or any `main` of `base`,
   e.g. `decision-log-ingest`): the error above, exit 0, the plan committed as `draft` with
   `workflow: ""` and `phase: ""`.

## Execution Notes
