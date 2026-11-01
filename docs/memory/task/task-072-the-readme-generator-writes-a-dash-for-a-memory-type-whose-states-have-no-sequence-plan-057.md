---
id: task-072-the-readme-generator-writes-a-dash-for-a-memory-type-whose-states-have-no-sequence-plan-057
type: task
title: "The README generator writes a dash for a Memory type whose states have no sequence (plan-057)"
status: draft
pack: ""            # tooling task (tooling-delivery, plan-057 ruling 8)
depends_on: ["task-067"]
tags: ["tooling","index","kanban"]
---

## Context

plan-057 ruling 8 (asked by the approver on 2026-11-01, on task-067's review). The README's
generated section 5, "What it adds", lists each Memory type a pack declares with its states and
gates (spec-002 §2.1). `memoryLines` (`src/readme-generate.ts`) writes a type whose fragment has
its own `states` as `` - `<type>`: <sequence><gates> ``, and one with no `states` as
`` - `<type>`: — ``. A tightening whose `states` holds no `sequence`, as `methodology/kanban`'s
`task` (only `limits`), gets the first form with an empty sequence: `` - `task`: `` with a trailing
space and nothing after it. The row of `docs/owed-items.md` left by task-067's review asks for the
fix before `kanban`'s first tag.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **The line:** a type whose fragment `states` has no `sequence` is written `` - `<type>`: — ``,
   followed by its gates as today when it has some (`` - `<type>`: —; gates … ``); a type with a
   `sequence` and a type with no `states` are written as today. No other generated line changes.
2. **Red first** (dl-018 R1–R3), the red run recorded with its command and failing count: in
   `tests/readme-generate.test.ts`, `generatedSections` on a `withPackTree` tree whose pack's
   memory fragment tightens a type with `states` holding only `limits`: its "What it adds" line is
   `` - `task`: — ``, with no trailing space; and one with `gates` but no `sequence`: `—` then its
   gates. Red on `main` for behaviour.
3. **The READMEs:** `npm run index` on `main` changes no file (no pack on `main` has such a type);
   on task-067's branch, after this task is merged into `main` and `main` into that branch, it
   rewrites `packs/methodology/kanban/README.md`'s line to `` - `task`: — ``, and `index --
   --check` passes there (task-067's or task-068's branch records it). `CATALOG.md`,
   `catalog-index.json` and `llms.txt` unchanged.
4. **The owed row** moves to Closed, settled by task-072 (plan-057).
5. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`,
   `npm audit`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
   `validate:publication`, the overlays `software-exit` and `scrum-exit`, `index -- --check`,
   `check:runs` and `workflow list` exit 0; `packs/`, `.wingfoil/` and the fixtures' expected
   outputs unchanged; the branch CI `success`, recorded; the privacy check of the branch's diff
   recorded; after the merge, `main`'s CI read.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-11-01: written under plan-057 (ruling 8).
