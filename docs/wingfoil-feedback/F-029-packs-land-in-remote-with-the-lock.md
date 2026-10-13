---
id: F-029
title: "Packs land in the remote asset class, mapped by pack-install and pinned by the lock"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-027). From this repository's dl-021 R3; supersedes F-005's lock request and F-007's
"packs only ever write `built-in/`".

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`):

```
$ ls .wingfoil/directives .wingfoil/workflows
.wingfoil/directives:
built-in  custom

.wingfoil/workflows:
built-in  custom
```

Two asset classes exist: `built-in/`, written by `init` from WingFoil's npm package, and
`custom/`, the project's own. No folder, lock or command exists for content installed from a
template repository.

## Expected

WingFoil dl-138 decides a third class, `remote`, vendored under its own folder with its own
removability and override rules (Q3), pinned by a lock entry with the source URL and exact commit
(Q1 (a)); folder, layout and lock are left to its Action 2 tech-spec. This repository accepts it
(dl-021 R3): `built-in/` stays WingFoil's own; packs use paths relative to each kind and never name
an install folder, and `pack-install` maps them into `remote/`; this repository's reference
composer follows the tech-spec once it fixes the folder, the layout and the lock. dl-138's lock
covers F-005's request.

Requests, pending WingFoil's v0.4 release-planning, not commitments: that the tech-spec keeps the
mapping in `pack-install` (a pack is installable without knowing its folder), states the lock's
location and format, and that WingFoil tells this repository when they are fixed.
