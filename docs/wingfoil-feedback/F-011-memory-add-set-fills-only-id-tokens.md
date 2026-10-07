---
id: F-011
title: "memory add --set fills only id tokens, so required fields cannot be set at creation"
kind: defect
status: open
wingfoil_version: 0.2.2
answered_by: []
---

Formerly T11.

## Observed

WingFoil 0.2.2 (npm, pinned exact), 2026-10-05. A Memory type `pack` requires `axis` and
`pack_path` in its frontmatter. Running

```
npx wingfoil memory add --type pack --title Scrum --set pack=methodology-scrum \
  --set axis=methodology --set pack_path=packs/methodology/scrum
```

exits 1 with `--set axis: memory type 'pack' has no token {axis} in its id_pattern or path`. A
field can be set at creation only if it is also a token of the id. For a type whose required fields
do not belong in its id, the only way is to edit the file by hand before `submit`, which benchmark
note N13 already flags as committed silently.

Also observed: `memory add` reads the **committed** `memory.yaml`, so a just-edited id pattern is
not seen until it is committed. That is consistent with REQ-SYS-03, but the error does not say so.

## Expected

`--set` writes any frontmatter field the type's template declares, or the error explains why not.
When the working-tree `memory.yaml` differs from the committed one, the error says so.

Suggested kind in WingFoil: bug, or a decision-log on `--set`'s scope.
