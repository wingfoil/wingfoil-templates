---
id: F-007
title: "No command updates the configuration after init"
kind: gap
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T7.

## Observed

There is no `update`, `upgrade`, `migrate`, `sync`, `profile` or `stage` command. A second `init` is
refused (`src/core/init.ts:56`): "edit the files under .wingfoil/ and commit them". The automatic
"Sync Process" on `dna set methodology` / `tech-stack` (`docs/01_vision/X_cli-cmds.md:101-108`,
`:155-159`) was specified but never implemented. Nothing re-applies newer built-in directives to an
existing project, and the dogfood project itself was never migrated to its shipped built-ins
(bug-040).

## Expected

Explicit commands rather than side effects of `dna set`:
- `wingfoil pack add <pack>` / `pack remove <pack>` (the "addable afterwards" half of the
  methodology-packs idea in `minor-v0.4.md`);
- `wingfoil upgrade [--dry-run]`: move packs to newer compatible versions, showing the diff first
  and using the lock (F-005) for the three-way merge.

Both build on the existing `built-in/` / `custom/` split. Packs only ever write `built-in/`, and a
`custom/` file with the same id overrides the pack (dl-037, today directives only). Extend that
precedence to workflows (`.wingfoil/workflows/built-in/` exists but is always empty) and to Memory
templates.

Open question (planning, 7): dl-138 Q3 — if a third asset class `remote` is ratified, packs install
there instead of `built-in/`, and this repository's `pack-authoring` directive follows that ruling.

Related: WingFoil dl-138 Q2 (an explicit update command with a three-way merge) and Q3. Suggested
kind in WingFoil: decision-log (explicit commands replace the vision's implicit sync; dl-037
precedence generalized) + tech-spec + tasks.
