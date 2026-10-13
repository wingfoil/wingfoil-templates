---
id: F-028
title: "Stage changes as pack updates of the stage overlay, with no stage set verb"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-027). From this repository's dl-021 R2; supersedes F-008's `wingfoil stage set`.

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`):

```
$ wingfoil --help                                           # excerpt: the commands
Commands:
  init, mcp, directive, directives, dna, memory, paths, workflow, help
$ wingfoil stage set production
error: unknown command 'stage'                                                  # exit 2
$ wingfoil upgrade
error: unknown command 'upgrade'                                                # exit 2
```

No command changes a project's lifecycle stage or updates its configuration after `init` (F-007).

## Expected

WingFoil plans no stage axis and no `stage set` verb (confirmed by WingFoil on 2026-10-13). This
repository withdraws the request of F-008 (dl-021 R2): a lifecycle stage (`prototype`, `mvp`,
`production`, `maintenance`, `sunset`) is a `stage/*` overlay pack; changing a project's stage is a
pack update that replaces one `stage/*` overlay with another, through `pack-install` and its update
command (WingFoil dl-138 Q2 (i), as relayed by WingFoil on 2026-10-13); the transition is a workflow
the project runs, shipped by the overlay. Nothing here depends on a `stage set` verb.

Request, pending WingFoil's v0.4 release-planning and not a commitment: when WingFoil specifies how
a configuration changes after `init` (dl-164's governance-change, with origin template-update, as
relayed by WingFoil on 2026-10-13), let replacing an overlay of an exclusive axis be one update, not
a removal followed by an addition, so that a project is never left without a stage. A decision-log
on WingFoil's side is welcome, not required.
