---
id: F-040
title: "A produces entry naming a directory without a trailing slash is never satisfied, and nothing says so"
kind: gap
status: open
wingfoil_version: 0.3.1
answered_by: []
---

New note (task-064). From this repository's bug-006 (`base` 1.0.0's `retrospective` › `explore`
and `governance-evolution` › `apply`, fixed in `base` 2.0.0 with the slash): WingFoil reads a
`produces` entry as a file unless it ends with `/` (spec-017 §4.3: "a pattern ending in `/` matches
when a committed file lies under it"), so an entry naming a directory without the slash can never be
satisfied, and the step cannot be passed by hand either. No earlier note covers it.

## Observed

WingFoil 0.3.1 (`870bd440`) and 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfiles
`src/matrix/wingfoil-0.3.1/` and `src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`,
`wingfoil init --template Kanban --no-interactive`), with one custom workflow included in
`workflows.yaml` and committed:

```yaml
# .wingfoil/workflows/custom/report.yaml
name: report
kind: main
description: "Write the reports"
version: 1
format: 1
phases:
  - name: write
    description: "Write the reports into docs/out."
    role: developer
    produces:
      - "docs/out"
  - name: publish
    description: "Publish them."
    role: developer
    actions:
      - agent.execute
```

Both releases give the same result:

```
$ wingfoil workflow list --format json                     # excerpt
"diagnostics":[]                                                                 # exit 0
$ wingfoil workflow start report                           # exit 0
$ git add docs/out/a.md && git commit -m "a report"        # docs/out/a.md written first
$ wingfoil workflow next                                   # excerpt
next step: report.write
  evidence missing: produces                                                     # exit 0
$ wingfoil workflow finalize --step report.write
error: phase 'report.write' completes from its evidence: produces                # exit 1
$ wingfoil workflow end report-1-plan
error: workflow 'report' is not complete: current step report.write
hint: wingfoil memory deprecate report-1-plan abandons it                        # exit 1
```

With the entry changed to `"docs/out/"` and committed, `wingfoil workflow next` moves on to
`report.publish` (exit 0).

## Expected

A diagnostic where the mistake can still be fixed: at load (`workflow list`), a warning for a
`produces` entry without `/` that names a directory in `HEAD`'s tree; or, at run time, `workflow
next` saying that the missing file is a directory. Alternatively, an entry that names an existing
directory is read as one.
