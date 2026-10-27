---
id: bug-007-the-readmes-install-steps-keep-the-custom-workflows-wingfoil-s-init-writes-under-the-packs-workflow-names-so-workflow-list-fails-with-e-workflow-duplicate-name
type: bug
title: "The READMEs' install steps keep the custom/ workflows WingFoil's init writes under the packs' workflow names, so workflow list fails with E_WORKFLOW_DUPLICATE_NAME"
status: draft
severity: "major"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","base","software","scrum","readme"]
---

## Observed

Found on 2026-10-27 by plan-051's `recheck` (the install steps on a project initialised by WingFoil
0.3.1), and reproduced on 0.3.0, which behaves the same. Every README of this repository's packs
gives the same "Install and update" step 3 (`packs/base/README.md`, `packs/software/README.md`,
`packs/methodology/scrum/README.md`): copy the composed `.wingfoil/` files "keeping its `custom/`
folders", then re-add to `workflows.yaml` "the `include` entries of its `custom/` workflows".

WingFoil's `init` (0.3.0 and 0.3.1, `--template Scrum` and `--template Kanban`) writes five
workflows under `.wingfoil/workflows/custom/` and includes them: `sw-life-cycle`, `bug-ingest`,
`decision-log-ingest`, `adr-ingest` and `scrum-delivery` (or `kanban-delivery`). Four carry the
name of a workflow the packs ship: `decision-log-ingest` (`base`), `sw-life-cycle`, `adr-ingest`
and `bug-ingest` (`software`). A project initialised by `init` that adopts `base`, `software` and
`methodology/scrum` as step 3 says, the four `directives/custom/` stubs removed as `base`'s and
`software`'s step 4 say:

```
$ wingfoil workflow list --format json
{"error":"E_WORKFLOW_DUPLICATE_NAME name (workflows/custom/sw-life-cycle.yaml): duplicate workflow
name 'sw-life-cycle' (already declared in workflows/built-in/sw-life-cycle.yaml)", …}
```

(exit 1, wrapped here); `workflow next` fails the same way, so every workflow command of the
project is blocked. Without re-adding the `custom/` workflows' `include` entries, the same
project's `workflow list` exits 0 with no diagnostic. Step 4 tells the adopter to remove the
`init` directive stubs that carry a pack directive's id; nothing says the same of the workflows.
0.3.1's "Upgrading from 0.3.0" tells a project to copy those `custom/` files from a fresh `init`;
the copies are harmless unless they are also included, which step 3's "re-add … the `include`
entries of its `custom/` workflows" leads to (a project initialised by 0.3.0 already includes
them). `init`'s delivery workflow (`scrum-delivery`, `kanban-delivery`) collides with no name,
but once re-included it is a second loop nothing points to: `init`'s own `sw-life-cycle` included
it, the composed one includes the methodology's `delivery`. `software`'s step 4 also names
"WingFoil 0.3.0's `init`" for the `determinism` stub, which 0.3.1 writes too.

## Expected

The install steps say that the workflows `init` wrote under `workflows/custom/` with the name of a
workflow the composition ships (`base`: `decision-log-ingest`; `software`: `sw-life-cycle`,
`adr-ingest`, `bug-ingest`) are removed, with their `include` entries, as the directive stubs are,
and that `init`'s delivery workflow (`scrum-delivery`, `kanban-delivery`) is removed with its
entry, the methodology's `delivery` replacing it (in `methodology/scrum`'s README); only the
project's own `custom/` workflows are kept and re-included. `software`'s step 4 names `init`
without a release. `workflow list` then exits 0 on a project initialised by `init` and adopted
by the steps. `software`'s and `methodology/scrum`'s READMEs, not published, are fixed before
their first release (W9), with no release of their own; `base`'s published README in a patch
(`pack-semver`: a change to the pack's own README), `base` 2.0.1, or folded into its next version
if one comes first.

## Reproduction

1. In an empty git repository, `wingfoil init --template Scrum` (WingFoil 0.3.0 or 0.3.1).
2. Compose `base`, `software` and `methodology/scrum` (`npm run compose`, the four required
   parameters); copy the composed `.wingfoil/` into the project's, keeping `custom/`; remove the
   four `directives/custom/` stubs; re-add to `workflows.yaml` the five `include` entries of the
   `custom/` workflows (the fifth, the delivery workflow, collides with no name); commit.
3. `wingfoil workflow list --format json`: exit 1, `E_WORKFLOW_DUPLICATE_NAME` for
   `sw-life-cycle`, `bug-ingest`, `decision-log-ingest` and `adr-ingest`. Without step 2's
   re-added entries: exit 0.

## Execution Notes
- 2026-10-27: independent review: approve after amendments. Applied: `init`'s delivery workflow
  removed too in Expected; the 0.3.1 CHANGELOG's upgrade note stated exactly (harmless unless
  included); every workflow command blocked, not only `list`; `base`'s README fix a patch
  (`pack-semver`); the two step 4s; `software`'s "0.3.0's `init`"; the fifth entry harmless.
