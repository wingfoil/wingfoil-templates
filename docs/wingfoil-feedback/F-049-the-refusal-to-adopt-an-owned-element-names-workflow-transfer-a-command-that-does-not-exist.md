---
id: F-049
title: "The refusal to adopt an owned element names workflow transfer, a command that does not exist"
kind: defect
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-092). From this repository's plan-073, which ran a draft pack's routing workflow on
0.3.2: an element created at one workflow's step could not be adopted by the workflow that owns
its later life, and the refusal told the user to move it with a command 0.3.2 does not have.
`workflow adopt` implements WingFoil dl-187, titled "adopt, rekey, transfer" (spec-017 §7.11);
0.3.2 ships `adopt` and `rekey`, not `transfer`, yet the refusal names it. Nothing else moves the
element: ending or deprecating the owning run leaves the refusal unchanged. Distinct from F-036 (no
verb moves, renames or supersedes an element), which points to dl-187 for a transfer in general:
this note is the shipped refusal's message and the element it leaves stuck; and from F-032 (no
suspend).

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git
identity). Written by hand and committed: `.wingfoil/workflows/custom/bug-report.yaml`, a main
workflow (`format: 1`, no `element`) with one phase `report` (role `developer`, action
`'memory.add(type: bug)'`), included in `workflows.yaml`; `workflow list` lists it, startable.

Excerpts: omitted lines shown as `…`, long lines wrapped; every command exits 0 unless noted.

```
$ wingfoil workflow start bug-ingest
started bug-ingest as bug-ingest-1-plan (active)
$ wingfoil workflow start bug-report
started bug-report as bug-report-1-plan (active)
$ wingfoil memory add --type bug --title "Reported bug" --workflow bug-report-1-plan
    --step bug-report.report
$ wingfoil workflow status
open workflows: 2
* bug-report-1-plan (bug-report) — active, complete
    element: bug:bug-001-reported-bug (draft)
    phases: report complete
  bug-ingest-1-plan (bug-ingest)
    element: (none)
    phases: capture current, approve pending
    frontier:
      - bug-ingest.capture (developer; missing: produces)
$ wingfoil workflow adopt bug-ingest-1-plan --element bug:bug-001-reported-bug
    --reason "captured by bug-ingest"
error: bug:bug-001-reported-bug is already owned by bug-report-1-plan bug-report.report; move it
with workflow transfer                                  # exit 1
$ wingfoil workflow --help
…
  adopt [options] <ref>     record which step of an open workflow an existing
…
  rekey [options] <ref>     remap the records of an open workflow from a renamed
…
$ wingfoil workflow transfer
error: unknown command 'transfer'                       # exit 2
$ wingfoil workflow end bug-report-1-plan
ended bug-report (bug-report-1-plan)
active: bug-ingest (bug-ingest-1-plan)
$ wingfoil workflow adopt bug-ingest-1-plan --element bug:bug-001-reported-bug
    --reason "captured by bug-ingest"
error: bug:bug-001-reported-bug is already owned by bug-report-1-plan bug-report.report; move it
with workflow transfer                                  # exit 1
```

`workflow --help` lists `adopt`, `create`, `end`, `finalize`, `list`, `next`, `rekey`, `remove`,
`show`, `start` and `status`; no `transfer`. On a copy of the project taken before `workflow end`,
`wingfoil memory deprecate bug-report-1-plan --reason abandoned` (`active → deprecated`, exit 0)
leaves the same refusal (exit 1).

## Expected

The refusal names a command the release has: either `workflow transfer` ships with it (dl-187), or
the message says how to proceed with what exists. And an element owned by a run that has ended or
been deprecated can be adopted, or moved, by an open one.
