---
id: F-030
title: "Selecting a preset of this repository's catalog at init, pinned like the default set"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-030). From plan-036 and this repository's dl-021 R1; refines F-006's `--preset`
request.

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
$ wingfoil init --preset startup-mvp
Error: unknown option '--preset'                                                # exit 2
$ ls -a
.  ..  .git                                                                     # nothing written
```

`init` chooses among WingFoil's own templates only; no option selects a preset, a curated
combination of packs.

## Expected

This repository's catalog lists presets (`catalog.yaml` › `presets`, `presets/<id>.yaml`,
this repository's spec-001 §11 and §15): named combinations of packs, each with a profile. F-006,
written before WingFoil dl-138, asks for `wingfoil init --preset <name>` among other `init`
options. Since then WingFoil installs packs from this repository through `pack-install`, as a
`remote` source pinned by a lock (dl-138), and F-027 proposes that `init` read a default set of
packs from a catalog commit that each WingFoil release pins.

Request, pending WingFoil's v0.4 release-planning and not a commitment, as input for WingFoil
dl-138's Action 2 tech-spec and dl-164's Initialization Template: `init` selects a preset of this
repository's catalog by its id and resolves it like the default set of F-027, inheriting its rule
(the catalog commit the WingFoil release pins, unless a source or a version is given); an explicit
preset replaces the default set. F-006's other options (one flag per axis, a wizard) are not
changed by this note.
