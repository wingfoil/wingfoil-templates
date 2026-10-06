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
   `--role product-owner`. Fixtures live under `test/fixtures/`, never under `packs/`.

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
