---
id: task-070-the-readme-generator-reads-a-pack-s-raw-fragments-with-no-node.js-warning-for-an-unquoted-parameter-plan-057
type: task
title: "The README generator reads a pack's raw fragments with no Node.js warning for an unquoted parameter (plan-057)"
status: draft
pack: ""            # tooling task (tooling-delivery, plan-057 ruling 6)
depends_on: ["task-066"]
tags: ["tooling","index","kanban"]
---

## Context

plan-057 ruling 6 (asked by the approver on 2026-10-31, on a finding of task-067, dl-019).
task-066 removed the Node.js warning "Keys with collection values will be stringified" from the
secret rules. With `packs/methodology/kanban` in the tree (task-067's branch), the same warning is
still printed once by `npm run index`, and by `validate` and `validate:publication`, which run the
index's check: `--trace-warnings` shows `yamlIn` (`src/index-data.ts`, the `yaml` package's
`parse`) called by `readPack` in `src/readme-generate.ts`, which reads a pack's fragments and
workflows as written, before substitution, to write the README's generated sections. Unquoted,
`{{wip_in_progress}}` parses as a flow map whose key is a flow map, and turning it into JavaScript
values warns. The index's `memoryTypes` (`src/index-model.ts`) reads a published version's
`fragments/memory.yaml` the same way, through `yamlAt`, for `catalog-index.json`: `publish:pack`
(`rootOutputs`) would warn at `kanban`'s publication. The review of this body checked every YAML
parse in `src/`: these two are the only reads of a pack's raw YAML; every other reader substitutes
first or reads files that hold no `{{name}}`. The packs use `{{name}}` only in paths, id patterns,
the DNA's names and `kanban`'s limits, none of which the index reads.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **No warning:** the README generator and the index read a pack's raw fragments and workflows
   with no Node.js warning for an unquoted `{{name}}`. In a clone of the repository at task-067's
   branch head with this task's change merged (the index needs the tags), `npm run index --
   --check`, `npm run validate` and `npm run validate:publication` exit as on that branch and print
   nothing on stderr; recorded.
2. **Scope:** one helper of `src/index-data.ts` reads a pack file parsed before substitution (a
   pack's `fragments/*.yaml` and `workflows/*.yaml`) with the `yaml` package's warnings off
   (`logLevel: 'error'`); its comment says why, that it also silences the package's other
   parse-time warnings for these files, and that errors still throw. Both callers use it:
   `readPack` and `partOf` in `src/readme-generate.ts`, and `memoryTypes` in `src/index-model.ts`.
   A parse error still refuses the file (`does not parse`), and a file that is not a mapping still
   refuses it (`is not a mapping`). `catalog.yaml`, `compat.yaml`, `pack.yaml` and presets keep
   today's reader; `src/yaml-load.ts` and `src/secret-rules.ts` are unchanged. The generated
   READMEs, `CATALOG.md`, `catalog-index.json` and `llms.txt` are byte-identical to `main`'s.
3. **Tests**, red first where they test the warning (dl-018 R1–R3), each red run recorded in the
   Execution Notes with its command and failing count; the warning cases use a
   `process.on('warning')` listener removed in a `finally`, and await
   `new Promise((r) => setImmediate(r))` before asserting no warning:
   - in a new `tests/index-data.test.ts`, the helper on an unquoted `{{name}}` limit: its value as
     today and no warning (red on `main`, where the helper's callers use `yamlIn`: the case is
     written against `yamlIn` until the helper exists, as task-058's minimal type change); and the
     helper refusing a file that does not parse and one that is not a mapping (green on `main`'s
     `yamlIn` and after, pinning the kept behaviour);
   - in `tests/readme-generate.test.ts`, `generatedSections` on a temporary tree whose pack's
     `fragments/memory.yaml` has `limits` with an unquoted `{{name}}`: no warning, and the
     sections as for a quoted value;
   - in `tests/index-model.test.ts`, with `TestRepo` and a published version whose tagged
     `fragments/memory.yaml` has an unquoted `{{name}}` limit: the index's `memory_types` unchanged
     and no warning;
   - in `tests/index.test.ts`, on a `withCopy` of the fixture tree whose `base` or `software`
     `fragments/memory.yaml` gains an unquoted `{{name}}` limit on an existing type (no new
     fragment, no new parameter, so the generated sections do not move), the index's CLI spawned
     with `spawnSync` and `--tree <copy> --check`: exit 0, stderr empty.
   Red for behaviour, not for compilation; every tree in the system's temporary directory, removed
   after its case.
4. **The owed row:** task-066's Closed row for the warning is completed: its item names both sites
   (the secret rules, and the index's reads of a pack's raw files), its Source adds plan-057
   ruling 6, and its "Settled by" names task-066 and task-070 (plan-057).
5. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`,
   `npm test`, `lint`, `check:packs`, `validate`, `validate:publication`, the overlays
   `software-exit` and `scrum-exit`, `index -- --check`, `check:runs` and `workflow list` exit as
   on `main` (`validate:publication` included); `packs/`, `.wingfoil/` and the fixtures' expected
   outputs unchanged; the branch CI `success`, recorded; the privacy check of the branch's diff
   recorded; after the merge, `main`'s CI read.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-31: written under plan-057 (ruling 6).
- 2026-10-31: independent review: approve after amendments, nothing blocking; it checked every YAML
  parse in `src/` (two sites only) and the fix on a scratch build. Applied: `validate:publication`
  and `publish:pack` named and checked; a test of `memoryTypes`; the tests placed in existing or
  new files that fit, the kept refusals pinned green, the CLI case on the fixture tree; the clone
  with tags; the helper's comment; the owed row's Source.
