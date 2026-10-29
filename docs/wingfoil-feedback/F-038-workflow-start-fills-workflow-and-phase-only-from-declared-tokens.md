---
id: F-038
title: "workflow start fills a plan's workflow and phase only from the tokens its type's id_pattern or path declares"
kind: request
status: open
wingfoil_version: 0.3.1
answered_by: []
---

New note (task-064). From this repository's bug-005 (plan-049, plan-054's retrospective): a project
whose plan type keeps a numbered id (`plan-{n}-{slug}`) and requires `workflow` and `phase` cannot
start a workflow without editing the plan by hand. WingFoil's spec-017 §7.1 derives `workflow` and
`phase` as tokens of the plan type's `id_pattern` or `path` (the scaffold's
`{workflow}-{phase}-plan`) and does not say what `start` does for a type that declares neither; this
is a request. Distinct from F-011 (`memory add --set` fills only id tokens): here the verb is
`workflow start`.

## Observed

WingFoil 0.3.1 (`870bd440`) and 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfiles
`src/matrix/wingfoil-0.3.1/` and `src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`,
`wingfoil init --template Kanban --no-interactive`), the `plan` type edited and committed to
`path: docs/memory/plan/{id}.md`, `id_pattern: "plan-{n}-{slug}"`, its `required` list unchanged
(`[id, type, title, status, workflow, phase]`). Both releases give the same result:

```
$ wingfoil workflow start decision-log-ingest
error: plan plan-001-decision-log-ingest was added but not submitted: run wingfoil memory submit plan-001-decision-log-ingest
  missing required field on submit: workflow, phase                              # exit 1
$ grep -E "^(status|workflow|phase):" docs/memory/plan/plan-001-decision-log-ingest.md
status: draft
workflow: ""
phase: ""
$ wingfoil workflow start decision-log-ingest --set workflow=decision-log-ingest
error: invalid flag value: --set workflow: workflow start sets only phase and scope   # exit 2
$ wingfoil workflow start adr-ingest --set phase=capture
error: --set phase: memory type 'plan' has no token {phase} in its id_pattern or path # exit 1
```

The plan is committed (`wf(plan): add plan-001-decision-log-ingest`) and left `draft`. With the
scaffold's own `plan` type (`{workflow}-{phase}-plan`, path `docs/memory/plan/{scope}/{id}.md`),
`wingfoil workflow start bug-ingest` exits 0 and the plan reads `workflow: "bug-ingest"`, `phase:
"1"`: `phase` is filled when the token is declared (here `1`, §7.1's value when no element is bound
or in context).

## Expected

Request, for WingFoil's release planning and not a commitment: `workflow start` fills the started
plan's `workflow` field, and its `phase` field when the plan type requires it, whether or not the
type's `id_pattern` or `path` declares the tokens; or accepts `--set workflow=…` and `--set
phase=…` for a type that requires them. Today a numbered plan id and a required `workflow` cannot
be combined without a hand edit at every start.
