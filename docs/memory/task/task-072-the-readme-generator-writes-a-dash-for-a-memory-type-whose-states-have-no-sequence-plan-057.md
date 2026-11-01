---
id: task-072-the-readme-generator-writes-a-dash-for-a-memory-type-whose-states-have-no-sequence-plan-057
type: task
title: "The README generator writes a dash for a Memory type whose states have no sequence (plan-057)"
status: approved
pack: ""            # tooling task (tooling-delivery, plan-057 ruling 8)
depends_on: ["task-067", "task-068", "task-069"]
tags: ["tooling","index","kanban"]
---

## Context

plan-057 ruling 8 (asked by the approver on 2026-11-01, on task-067's review): after task-068 and
task-069, before `kanban`'s first release. The README's generated section 5, "What it adds", lists
each Memory type a pack declares with its states and gates (spec-002 §2.1). `memoryLines`
(`src/readme-generate.ts`) writes a type whose fragment has its own `states` as
`` - `<type>`: <sequence><gates> ``, one that has none but whose pack has `defaults` as
`` - `<type>`: defaults, <sequence><gates> ``, and one with neither as `` - `<type>`: — ``. A
tightening whose `states` holds no `sequence`, as `methodology/kanban`'s `task` (only `limits`),
gets an empty sequence: `` - `task`: `` with a trailing space and nothing after it; a pack that
tightens `defaults` with only `gates`, `limits` or `waiting` (spec-001 §7.5) would get
`` defaults, `` the same way (no pack has one today). The row of `docs/owed-items.md` left by
task-067's review asks for the fix before `kanban`'s first tag.

**Why a dash.** The README is written from the pack's own files, not from a composition with the
foundation (spec-002 §2.2), so the effective machine of a tightened type cannot be shown. A type
whose `states` has no `sequence` is a tightening (spec-001 §7.5: a defining pack's `states` must
have one), and whether the tightened type derives from `defaults` depends on the foundation
(`base`'s `task` has its own machine), so `defaults, …` would mislead; a `defaults` key in the
same pack does not change it. A dash for the missing sequence matches the existing convention
(`scrum`'s `` - `task`: — ``). Limits are not shown: spec-002 §2.1 lists states and gates only.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **The lines:** `sequenceOf` writes `—` for a missing or empty `sequence`, so a type whose own
   `states` has none is written `` - `<type>`: — ``, followed by its gates when it has some
   (`` - `<type>`: —; gates … ``), and a type deriving from a `defaults` with none
   `` - `<type>`: defaults, — ``; a type with a `sequence` and a type with no `states` are written
   as today. Section 4's `states:` line (`declaredStates`, `sequence` entries only) is unchanged.
2. **Red first** (dl-018 R1–R3), the red run recorded with its command and failing count: in
   `tests/readme-generate.test.ts`, `generatedSections` on `withPackTree` trees whose pack's memory
   fragment holds (a) a type with `states` holding only `limits`: its "What it adds" line exactly ``
   - `task`: — `` (red on `main`: `` - `task`: `` with a trailing space); (b) a type with `gates`
   and no `sequence`: `` - `task`: —; gates … `` (red: `` - `task`: ; gates … ``); (c) an empty
   `sequence: []`, as (a); (d) a `defaults` with only `gates`, and a type deriving from it: `` -
   `<type>`: defaults, —; gates … `` (red: `` defaults, ; gates … ``); each with section 4's
   `states:` line as on `main`. Red for behaviour.
3. **The READMEs:** on this branch, from `main` with task-067 merged, `npm run index` rewrites only
   `packs/methodology/kanban/README.md`, and only its line `` - `task`: `` to `` - `task`: — ``;
   `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged, the golden tree's expected outputs
   unchanged, `index -- --check` passing. `kanban` has no tag yet, so its README changes with no
   version bump and no CHANGELOG entry.
4. **The owed row** moves to Closed, settled by task-072 (plan-057).
5. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`,
   `npm audit`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
   `validate:publication`, the overlays `software-exit`, `scrum-exit` and `kanban-exit`,
   `index -- --check`, `check:runs` and `workflow list` exit 0; `packs/` unchanged but that line,
   `.wingfoil/` and the fixtures' expected outputs unchanged; the branch CI `success`, recorded;
   the privacy check of the branch's diff recorded; after the merge, `main`'s CI read.

## Design

Branch `task/task-072-memory-type-dash` from `main` (`a06f032`, with task-067 … task-069).

**`src/readme-generate.ts`:** `sequenceOf` returns `—` when `states.sequence` is missing or empty;
`memoryLines` unchanged otherwise, so its three forms become `<sequence or —><gates>`,
`defaults, <sequence or —><gates>` and `—`.

**Tests, red first** (one commit, on `main`'s code): in `tests/readme-generate.test.ts`, the four
cases of Acceptance 2 on `withPackTree` trees, each asserting the exact "What it adds" line and
section 4's `states:` line. Then the fix; `npm run index` rewrites `kanban`'s README line; the owed
row moved to Closed.

## Execution Notes

- 2026-11-01: written under plan-057 (ruling 8).
- 2026-11-01: independent review: approve after amendments, one blocking finding (Acceptance 3 and
  5 followed task-070's order, not ruling 8's: this task runs with `kanban` on `main`). Applied:
  the order and `depends_on`; the same defect in the `defaults` branch, fixed in `sequenceOf`; the
  dash's rationale; section 4 pinned unchanged; both red outputs named, an empty sequence tested.
- 2026-11-01: focused re-review: approve; its nit applied. Submitted.
- 2026-11-01: Design written; `backlog → in-progress`.
- 2026-11-01, red first (dl-018 R1), the tests only, on `main`'s `src/readme-generate.ts`:
  `node --test --test-name-pattern=task-072 dist/tests/readme-generate.test.js`: 4 tests, 0 pass,
  4 fail, for behaviour: `` - `task`: `` with a trailing space (only `limits`, and an empty
  `sequence`), `` - `task`: ; gates … `` and `` - `note`: defaults, ; gates … ``.
- 2026-11-01, the fix: `sequenceOf` writes `—` for a missing or empty `sequence`. Green:
  `readme-generate` and `index` tests 31 of 31. `npm run index` rewrote one file,
  `packs/methodology/kanban/README.md`, its line `` - `task`: `` to `` - `task`: — `` and nothing
  else; `index -- --check` 7 files; the golden tree's `validate` (11 index files, 26 runs, 0
  failed) unchanged. The owed row moved to Closed.
- 2026-11-01: independent review of the build: approve, nothing blocking; it reran the red commit
  (4 tests, 0 pass, 4 fail, the outputs above) and found no other fragment whose `states` lack a
  `sequence`, in `packs/` or the golden tree.
- 2026-11-02, checks at `be9e54d` (Acceptance 5), from clean clones on Node.js 22.21.0 then
  22.12.0, one after the other: `npm ci`, `npm audit` (0), `npm test` (1043 of 1043), `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `validate`, `validate:publication`, the overlays
  `software-exit`, `scrum-exit` and `kanban-exit`, `index -- --check` (7 files), `check:runs` (46
  runs, 0 failed) and `workflow list`, each exit 0, no Node.js warning. Branch CI run 41354951330
  on `be9e54d`: `success`. `.wingfoil/` and the fixtures' expected outputs unchanged; in `packs/`
  only `kanban`'s README line. Privacy check of the branch's diff against `main`: no local or
  scratch path, no private repository or project, no intermediary session.
  `in-progress → in-review`.
- 2026-11-02: approved by the approver (`in-review → approved`) with the merge OK; merged into
  `main` with `--no-ff` (`35ebf97`); `index -- --check` (7 files) and the `readme-generate` tests on the
  merged tree. `approved → done`.
