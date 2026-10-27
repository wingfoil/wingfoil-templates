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
`methodology/scrum` as step 3 says, the four `directives/custom/` stubs removed as step 4 says:

```
$ wingfoil workflow list --format json
{"error":"E_WORKFLOW_DUPLICATE_NAME name (workflows/custom/sw-life-cycle.yaml): duplicate workflow
name 'sw-life-cycle' (already declared in workflows/built-in/sw-life-cycle.yaml)", …}
```

(exit 1, wrapped here). Without re-adding the `custom/` workflows' `include` entries, the same
project's `workflow list` exits 0 with no diagnostic. Step 4 tells the adopter to remove the
`init` directive stubs that carry a pack directive's id; nothing says the same of the workflows.
0.3.1's own "Upgrading from 0.3.0" tells a project to copy those `custom/` workflows from a fresh
`init`, which leads to the same duplicate for an adopter of the packs.

## Expected

The install steps say that the workflows `init` wrote under `workflows/custom/` with the name of a
workflow the composition ships (`base`: `decision-log-ingest`; `software`: `sw-life-cycle`,
`adr-ingest`, `bug-ingest`) are removed, with their `include` entries, as the directive stubs are;
the project's own `custom/` workflows of other names are kept and re-included. `workflow list`
then exits 0 on a project initialised by `init` and adopted by the steps. `software`'s and
`methodology/scrum`'s READMEs are fixed before their first release (W9); `base`'s published README
at its next version (its published text frozen, `pack-semver`).

## Reproduction

1. In an empty git repository, `wingfoil init --template Scrum` (WingFoil 0.3.0 or 0.3.1).
2. Compose `base`, `software` and `methodology/scrum` (`npm run compose`, the four required
   parameters); copy the composed `.wingfoil/` into the project's, keeping `custom/`; remove the
   four `directives/custom/` stubs; re-add to `workflows.yaml` the five `include` entries of the
   `custom/` workflows; commit.
3. `wingfoil workflow list --format json`: exit 1, `E_WORKFLOW_DUPLICATE_NAME` for
   `sw-life-cycle`, `bug-ingest`, `decision-log-ingest` and `adr-ingest`. Without step 2's
   re-added entries: exit 0.

## Execution Notes
