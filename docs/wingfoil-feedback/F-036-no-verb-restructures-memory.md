---
id: F-036
title: "No verb moves, renames or supersedes an element, and nothing lists the elements that cite one"
kind: request
status: open
wingfoil_version: 0.3.0
answered_by: []
---

New note (task-063). At the approver's request: long-lived projects restructure their Memory, and
WingFoil offers no verb for it.

## Observed

WingFoil 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`, then `wingfoil init --template
Kanban --no-interactive`):

```
$ wingfoil memory --help                                    # excerpt: the commands
  add, amend, approve, deprecate, history, park, reject, search, submit, help
$ wingfoil memory move x
error: unknown command 'move'                                                   # exit 2
$ wingfoil memory rename x
error: unknown command 'rename'                                                 # exit 2
$ wingfoil memory search --help                             # excerpt: the options
  --tag <tag>, --status <status>, --type <type>
$ grep -c superseded .wingfoil/memory.yaml
0
```

An element's id, path and type cannot change through a verb: a move or a rename is a hand edit of
the file, of its frontmatter and of every element that cites it, with no audited transition.
`memory search` matches text and metadata, so the elements that cite a given id can be found only
by a keyword search on the id, which also matches unrelated text. `superseded` is an archived
status (WingFoil dl-028), but no type of the scaffold reaches it, and no verb records which
element supersedes which.

## Expected

Request, for WingFoil's release planning and not a commitment. Long-lived projects consolidate
their Memory: several decision-logs become one, errata are folded back into a specification,
elements are moved or renamed when the structure changes. It asks WingFoil for:

1. a verb that moves or renames an element (new id, path or type) in one audited commit, updating
   the references to it in the other elements, or reporting those it cannot update;
2. a read of the elements that cite a given id (frontmatter fields and body links), for example a
   `memory search` option or a verb of WingFoil dl-200's family;
3. a verb that records a supersession: the superseding element names the superseded ones, which
   move to `superseded` in the same commit, on any type that declares the state.

WingFoil dl-187 (adopt, rekey, transfer) may cover part of 1 for workflow provenance. A
decision-log on WingFoil's side is welcome, not required.
