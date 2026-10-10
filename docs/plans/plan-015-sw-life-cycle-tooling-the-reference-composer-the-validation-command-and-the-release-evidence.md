---
id: plan-015-sw-life-cycle-tooling-the-reference-composer-the-validation-command-and-the-release-evidence
type: plan
title: "sw-life-cycle tooling: the reference composer, the validation command and the release evidence"
status: active
workflow: "sw-life-cycle"
phase: "tooling"
tags: ["tooling"]
---

## Context

Third phase of `sw-life-cycle`, sequencer milestone M1 (waves W5–W7). The approver approved the
specification phase on 2026-10-06 (plan-012, merge `6228faa`): spec-001 (pack format 1),
`schema/*.schema.json`, dl-008, adr-001 (a reference composer in this repository) and adr-002
(TypeScript on Node.js ≥ 22.12, compiled with `tsc`, dependencies pinned exact).

The phase runs one `kanban-delivery` iteration per task with no pack (`iterate_over: task`,
`where: { pack: "" }`, dl-005 G7). It produces the repository tooling:
- the reference composer (F3.2), the determinism check (F3.4) and one validation command (F3.1):
  W5;
- the compatibility matrix (F3.3), the lint rules (F3.5, spec-001 §18) and CI (F3.6): W6;
- the release evidence (F5.1), the feedback notes on publication (F5.4) and the line policy (F5.3):
  W7.

The phase has no `approval` key of its own: each task has its gates in `kanban-delivery`, and the
approver closes the phase in chat.

Inputs: spec-001 (§7 merge, §8 parameters, §12 range, §13 digest and its test vector, §17 composer,
§18 lint, §16 open points O7, O10, O12), adr-001, adr-002, `docs/01_vision/06_features.md` F3 and
F5, `07_sequencer.md` M1, the uncommitted notes (feedback T15, T17).

Out of scope:
- dl-007 (phase methods) stays `pending`, and plan-010 stays `active`. The tooling implements no
  `method` entry.
- `base` (M2) waits for the approver's gate on the final WingFoil v0.3 formats, and is published
  only after v0.3 is released.

Ruled by the approver on 2026-10-06, when this plan was presented:
- the plan, the backlog below and its order;
- governance elements (plans, DLs, ADRs, bugs, tasks and their states) are committed on `main`;
  every piece of work runs on its own branch (`task/<id>`, `config/<name>`) merged with `--no-ff`;
- the decisions of step 1 and the bug of step 2 are captured with the recommendations presented,
  the options staying recorded in each element for the approver's ruling;
- the remote is `https://github.com/wingfoil/wingfoil-templates` (private, empty on 2026-10-06).

## Steps

1. **Decisions before the tasks they affect** (facilitator and architect, claude):
   - through `decision-log-ingest` › `capture`, one plan for both:
     - dl-009, O10: how the matrix validates before a released WingFoil accepts `format:`.
       Proposed: tolerate exactly `unknown field(s) ignored: format`, in the tooling's self-test
       mode only, for a release `compat.yaml` marks `format_key: false`; never in publication.
       Blocks task 8;
     - dl-010: the real `catalog.yaml` (axes, slots, `packs: []`) and `compat.yaml` (0.2.2,
       `format_key: false`) are written by the tooling tasks that first read them (tasks 4 and 8).
   - through `adr-ingest` › `capture`, its own plan: adr-003, the libraries (YAML parser, JSON
     Schema 2020-12 validator, test runner, semver), with the vulnerability review of the
     `security` directive. Blocks task 1.
2. **Configuration follow-ups** (facilitator, then developer, claude):
   - bug-001 through `bug-ingest` › `capture`: `kanban-delivery` gives the `design`, `build` and
     `deliver` phases the role `pack-author`, whose directives do not include `code-quality` and
     `testing`, which tooling tasks need;
   - once bug-001 and adr-003 are approved, one plan of actions (as plan-011) on branch
     `config/tooling-followups` applies the actions of approved elements, each changed file with a
     `version:` key bumped once:
     - spec-001 §1: `pack-authoring`, "a type and a default" → "a type, and a default unless the
       parameter is required";
     - spec-001 §4: `pack-semver`, the example tag `base@0.1.0`;
     - dl-003: `dna.yaml`, the `packs` module names the `governance` axis;
     - adr-002, adr-003: `dna.yaml` `stacks.technologies` declares TypeScript and the libraries;
     - bug-001: the fix the approver rules.
3. **Tasks**, in this order, one `kanban-delivery` iteration each (WIP: one in-progress, one
   in-review). The product-owner creates each task when the previous one leaves in-progress; the
   approver accepts each one into the backlog. Builds load
   `npx wingfoil directives list --role developer`, reviews `--role reviewer`, task planning
   `--role product-owner`. Fixtures live under `tests/fixtures/` (`dna.yaml` `paths.tests`),
   never under `packs/`.

   | # | Wave | Task | Source |
   |---|---|---|---|
   | 1 | W5 | TypeScript set-up: `tsconfig`, `tsc` build, test runner, lockfile with exact pins, `.gitattributes` `packs/** -text` | adr-002, adr-003, spec-001 §13 |
   | 2 | W5 · F3.1 | YAML loading and schema checks against `schema/*` | spec-001 §5, §6, §17.2 |
   | 3 | W5 · F3.2 | Digest and computed range | spec-001 §12, §13 |
   | 4 | W5 · F3.2 | Resolution: ranges, requires and conflicts, cardinalities, slots, inventories, order; the real `catalog.yaml` | spec-001 §3, §6.3, §6.4, §7.1, §9; dl-010 |
   | 5 | W5 · F3.2 | Fragment merge (add or tighten) and parameters | spec-001 §7.2–§7.5, §8 |
   | 6 | W5 · F3.2 | Output: assets, `workflows.yaml`, AGENTS region, `compose` command | spec-001 §7.6, §7.7, §10, §17 |
   | 7 | W5 · F3.4, F3.1 | Determinism check and one validation command | F3.1, F3.4 |
   | 8 | W6 · F3.3 | Compatibility matrix, oldest and newest release, each pinned and isolated; the real `compat.yaml` | F3.3, dl-009, dl-010 |
   | 9 | W6 · F3.5 | Lint rules | spec-001 §18, F3.5 |
   | 10 | W6 · F3.6 | CI on pull requests and tags | F3.6 |
   | 11 | W7 · F5.1 | Release evidence and catalog entry, dry-run | F5.1 |
   | 12 | W7 · F5.4 | Feedback note on publication and schema change | F5.4 |
   | 13 | W7 · F5.3 | Line policy | F5.3, `pack-semver` |

4. **Phase gate.** An independent review of the phase by another session. The approver approves
   the phase in chat; this plan goes `active → done`.

## Handoff

- **claude:** every step above as the agent `claude`. It never runs `memory approve` or
  `memory reject`.
- **Approver:**
  - approves dl-009, dl-010, adr-003 and bug-001 (one chained command);
  - accepts each task into the backlog, and approves each reviewed task;
  - approves the phase in chat.
- A rejected element goes back to `draft`, is corrected under its plan and submitted again.
- Done when the thirteen tasks are `done`, the W7 exit criterion holds (a dry-run publication of a
  fixture pack produces tag, catalog entry, digest and note) and the approver has approved the
  phase.

## Execution Notes

- 2026-10-06: the approver gave the remote and asked to register it and push `main`. The push from
  the agent session was blocked by its permission settings; the approver runs it.
- Step 1: plan-016 captured dl-009 and dl-010; plan-017 captured adr-003, after a vulnerability
  review of the libraries. All three `pending`.
- Step 2: bug-001 captured through `bug-ingest` › `capture` (`bc715a3`, `4a32d04`), `pending`, with
  three fix options; (a), a `tooling-delivery` sub-workflow, recommended.
- bug-001 was captured directly under this plan's step 2, with no `bug-ingest` plan of its own:
  one element, with nothing to plan beyond the workflow's `capture` phase.
- 2026-10-06: an independent review (a subagent with its own context) of dl-009, dl-010, adr-003
  and bug-001 found nothing blocking and requested changes: five should-fix and nine nits, mostly
  in dl-009 and adr-003. One should-fix applied here: fixtures live under `tests/fixtures/`, the
  `dna.yaml` `paths.tests` folder, not `test/fixtures/`. The elements are `pending`; amending them
  waits for the approver's choice.
- 2026-10-06: the approver asked for the four elements to be amended while `pending`, and ruled
  bug-001 fix (a), a `tooling-delivery` sub-workflow. Every should-fix and nit of the review is
  applied: dl-009 (empty compatible set fails publication, the caller fixes the mode, evidence
  refuses self-test results, exact tolerated line, `pack-compatibility` scope sentence as a
  configuration follow-up), dl-010 (`tests/fixtures/`, `foundation` with no `base` entry), adr-003
  (Node.js floor tested in task 1 and CI, range subset scope, fixed YAML output options, two more
  alternatives, T15 uncommitted), bug-001 (scope, keeping the two loops in step, the ruling).
- Step 2 follow-ups gain the `pack-compatibility` scope sentence (dl-009).
- 2026-10-06: the same reviewer re-reviewed the amendment (`4a9390f`): verdict approve, every
  finding resolved. dl-009, dl-010, adr-003 and bug-001 handed to the approver.
- 2026-10-06: dl-009, dl-010, adr-003 and bug-001 approved by the approver (`0efa37a`, `9ba87a5`,
  `8491378`, `ae338be`); plan-016 and plan-017 done. The approver registered the remote and pushed.
  Step 2 runs under plan-018. Once merged, the tasks of step 3 run through `tooling-delivery`
  (bug-001), not `kanban-delivery`.
- 2026-10-06: plan-018 done; the configuration follow-ups are on `main` (`8ccdc45`).
- Task 1: task-001 created (`tooling-delivery` › `plan`, product-owner directives), committed and
  submitted, `pending` for the approver's acceptance into the backlog.
- **`where: { pack: "" }`, first real case:** `workflow list` accepts the clause, but nothing in
  WingFoil 0.2.2 evaluates it: `memory search` cannot filter on `pack` and does not print it, and no
  command lists a phase's iteration. The task is selected by reading its frontmatter. Recorded as
  feedback note T18 (uncommitted).
- 2026-10-07: task-001 (TypeScript set-up) done, merged `ba4757d`. Open for the approver: a linter
  (the `code-quality` directive mentions one; adr-003 chose none).
- 2026-10-07: the approver chose ESLint in minimal form (type-aware and determinism rules, no
  style). adr-004 captured under plan-019, `pending`. The backlog gains a task, **4b, ESLint
  set-up (adr-004)**, between task 4 and task 5, so that the fragment merge is written under lint:
  fourteen tasks in all. From task 4b on, every tooling task's Acceptance includes `npm run lint`.
- 2026-10-07: task-002 (YAML loading and schema checks) done, merged `f2b62ba`.
- 2026-10-07: task-003 (digest and computed range) done, merged `2df2bb7`.
- 2026-10-07: task-004 (resolution, real catalog) done, merged `843c4c0`.
- 2026-10-07: task-005 (task 4b, ESLint) done, merged `f1040d3`. From task 5 on, Acceptance includes `npm run lint`.
- 2026-10-07: task-006 (task 5, fragment merge and parameters) done, merged `7ea0312`.
- 2026-10-07: task-007 (task 6, composer output and compose command) done, merged `5e62e09`. The reference composer of adr-001 is complete; the golden composition is accepted by WingFoil 0.2.2 with only the O10 warnings.
- 2026-10-07: task-008 (task 7, determinism check and `npm run validate`) done, merged `f236df9`.
  **Wave W5 is closed:** its exit criterion holds on `main` (`npm run validate -- --tree
  tests/fixtures/compose/tree --param project_name=Golden` composes the golden preset twice into
  18 byte-identical files). As the approver ruled, work stops here before W6: the session
  "Meccanismo feedback wingfoil" is notified, and its changes to `docs/wingfoil-feedback/` and the
  `wingfoil-feedback` directive come through task elements. Pending with them: the feedback note
  on the copy of WingFoil's built-in directive ids (task-006).
- 2026-10-07: the approver pushed `main` through this session (`origin/main` at `3f2e929`) and
  confirmed step M1 of the WingFoil feedback loop
  (`wingfoil/wingfoil` dl-163, R1–R8),
  between W5 and W6, as two tooling tasks: task-009 versions `docs/wingfoil-feedback/`
  (S1, R1; the approver lifts his rule of 2026-10-05 "non committare le note" for this folder;
  `docs/notes/` stays untracked); task-010 splits the notes into one file per note with a ledger
  (S4a, R4) and replaces the `wingfoil-feedback` directive with `wingfoil-cli` (S4b). W6 resumes
  after them.
- 2026-10-07: task-009 (inbox versioned, M1 S1) done, merged `ceffa55`, pushed.
- 2026-10-08: task-010 (dl-163 notes, ledger, `wingfoil-cli`; M1 S4a, S4b) done, merged `59e1b45`,
  pushed. Step M1 of the feedback loop is complete; the coordinating session is told what was done
  and where it departs from its request. W6 is not started: the approver asked to wait.
- 2026-10-09: W6 started at the approver's request. task-011 (plan-015 task 8: compatibility
  matrix, real `compat.yaml`; F3.3, dl-009, dl-010) done, merged `b57bdc9`, pushed.
  `npm run validate` runs the matrix in self-test mode and `npm run validate:publication` in
  publication mode; each release is installed from a committed lockfile under `src/matrix/`.
  Configuration follow-ups owed, each through its own element: `wingfoil-cli` W-12, and
  `wingfoil-release-intake` › `record` adding the release's lockfile. Next: plan-015 task 9 (lint).
- 2026-10-10: task-012 (plan-015 task 9: lint rules over the whole tree; spec-001 §18, F3.5) done,
  merged `302f3de`, pushed. `npm run check:packs` runs the lint alone and `validate` runs it as a
  step; the composer applies the same rules to the packs it composes. As the approver ruled on
  2026-10-09, the catalog rules that need a git tag (version entry against the tagged pack.yaml,
  pack and transition digests, the `wingfoil` range) move to plan-015 task 11. Next: plan-015
  task 10 (CI).
- 2026-10-10: task-013 (plan-015 task 10: CI; F3.6, dl-009) done, merged `ef07021`, pushed. CI
  runs on every pushed branch (self-test) and on release tags `**@*` (publication), with no pull
  requests, as the approver ruled. Its real runs validate the golden fixture against
  `wingfoil@0.2.2`: **wave W6 is closed** (tasks 8–10). Before it, plan-021 applied dl-014 D6 and
  plan-023 closed the follow-ups of task-011 and dl-014 (publish skips the index until W14). Next:
  W7, plan-015 task 11 (release evidence, dry run), which also takes the catalog rules that need a
  tag (moved from task-012).
- 2026-10-10: task-014 (plan-015 task 11: release evidence, `publish:pack`, the tag-dependent
  catalog rules; F5.1, dl-009) done, merged `05140d4`, pushed. The dry run of W7 runs in the tests
  against a fictional release with `format_key: true` in a fixture `compat.yaml` (the approver's
  ruling); a real dry run on the golden tree stops at `no compatible release (publication)` until
  WingFoil v0.3. Next: plan-015 task 12 (feedback note on publication and schema change, F5.4).
