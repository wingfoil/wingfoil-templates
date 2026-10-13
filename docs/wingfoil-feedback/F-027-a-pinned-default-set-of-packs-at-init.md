---
id: F-027
title: "A pinned default set of packs at init, read from this repository's catalog"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-027). From this repository's dl-021 R1 (no bundled packs); supersedes F-001's bundled
copy, F-003's `advance-bundled-packs` step and F-005's `--offline` with bundled packs.

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`):

```
$ wingfoil init --help                                      # excerpt
...
Options:
  --template <name>  methodology template, one of: Scrum, Kanban (required
                     without a terminal or with --no-interactive)
  -h, --help         display help for command
...
$ wingfoil pack add base
error: unknown command 'pack'                                                   # exit 2
```

`init` scaffolds WingFoil's own templates; it has no option naming a pack source, a version or an
offline mode, and no command installs a pack. Nothing tells which packs of this repository a new
project starts with.

## Expected

WingFoil dl-138 makes packs template-repository content, not npm content (Action 3), installed by
`pack-install` as a `remote` source pinned by a lock (Q1 (a), Q3). This repository accepts it
(dl-021 R1): no bundled packs; offline use comes from the vendored copy and the lock, so the first
`init` needs the network.

Request, pending WingFoil's v0.4 release-planning and not a commitment, as input for dl-138's
Action 2 tech-spec and dl-164's Initialization Template: the
**default set**, the packs `init` installs when no source or version is given, resolved as
WingFoil's approver recommends in a ruling of 2026-10-13, relayed to this repository and not yet
recorded in dl-138, option (b): each WingFoil release pins a commit of this repository's catalog
that names the default set, `init` uses it unless a source or version is given, and a forward-only
advance step on WingFoil's side moves the pin. Option (a), always the latest default set, is not
proposed: (b) keeps the same configuration for the same WingFoil version and the same answers, as
WingFoil put it on 2026-10-13.

On this side: the catalog commit that resolves a default set is never rewritten (`main` is
protected against force-push), and every published version resolves to an exact commit through its
tag `<catalog pack id>@<version>` and its digest (spec-001 §11, §13). How the catalog names the
default set is fixed with the tech-spec.
