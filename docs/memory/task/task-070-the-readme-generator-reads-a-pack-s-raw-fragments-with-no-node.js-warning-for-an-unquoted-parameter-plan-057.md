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
still printed once by `npm run index` and by every `validate`, which runs `index -- --check`:
`--trace-warnings` shows `yamlIn` (`src/index-data.ts`, the `yaml` package's `parse`) called by
`readPack` in `src/readme-generate.ts`, which reads a pack's fragments and workflows as written,
before substitution, to write the README's generated sections. Unquoted, `{{wip_in_progress}}`
parses as a flow map whose key is a flow map, and turning it into JavaScript values warns. The
index's `memoryTypes` (`src/index-model.ts`) reads a published version's `fragments/memory.yaml`
the same way, through `yamlAt`, for `catalog-index.json`: it would warn at `kanban`'s publication.
The index reads only names from those files (types, states, roles, workflows and phases), never a
value built from a `{{name}}`. The composer, the lint and `check:runs` print nothing (task-066 and
task-067's checks).

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **No warning:** the README generator and the index read a pack's raw fragments and workflows
   with no Node.js warning for an unquoted `{{name}}`; with `packs/methodology/kanban` of
   task-067's branch in a scratch copy of the tree, `npm run index -- --check` and
   `npm run validate` print nothing on stderr.
2. **Scope:** the pack files read before substitution (a pack's `fragments/*.yaml` and
   `workflows/*.yaml`, by `src/readme-generate.ts` and by `memoryTypes` in `src/index-model.ts`)
   are parsed with the `yaml` package's warnings off (its `logLevel: 'error'`), through one helper
   of `src/index-data.ts` whose comment says why; a parse error still refuses the file, as today
   (`does not parse`), and a file that is not a mapping still refuses it. `catalog.yaml`,
   `compat.yaml`, `pack.yaml` and presets keep today's reader; `src/yaml-load.ts` and
   `src/secret-rules.ts` are unchanged. The generated READMEs, `CATALOG.md`, `catalog-index.json`
   and `llms.txt` are byte-identical to `main`'s.
3. **Red first** (dl-018 R1–R3), each red run recorded in the Execution Notes with its command and
   failing count:
   - in `tests/readme-generate.test.ts`, an async case calling `generatedSections` on a temporary
     tree holding a pack whose `fragments/memory.yaml` has `limits` with an unquoted integer
     parameter, with a `process.on('warning')` listener removed in a `finally`, awaiting
     `new Promise((r) => setImmediate(r))` before asserting no warning; and its generated sections
     naming the type, as for a quoted value;
   - a case of the helper of Acceptance 2 (`tests/index-source.test.ts` or the index-data tests)
     refusing a fragment that does not parse, as today;
   - in `tests/index.test.ts`, the index's CLI spawned with `spawnSync` on such a tree: exit 0,
     stderr empty.
   The warning cases red on `main` for behaviour, not for compilation; the tree built in the
   system's temporary directory and removed after each case.
4. **The owed row:** the Closed row of task-066 for the warning is completed: its cause names both
   sites (the secret rules, settled by task-066; the index's reads of a pack's raw files, settled
   by task-070), with both ids in "Settled by".
5. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`,
   `npm test`, `lint`, `check:packs`, `validate`, the overlays `software-exit` and `scrum-exit`,
   `index -- --check`, `check:runs` and `workflow list` exit 0; `packs/`, `.wingfoil/` and the
   fixtures' expected outputs unchanged; the branch CI `success`, recorded; the privacy check of
   the branch's diff recorded; after the merge, `main`'s CI read.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-31: written under plan-057 (ruling 6).
