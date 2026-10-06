---
id: plan-018-config-actions-tooling-follow-ups-of-spec-001-dl-003-dl-009-adr-002-adr-003-and-bug-001
type: plan
title: "config actions: tooling follow-ups of spec-001, dl-003, dl-009, adr-002, adr-003 and bug-001"
status: done
workflow: "sw-life-cycle"
phase: "tooling"
tags: ["config"]
---

## Context

Step 2 of plan-015 (`sw-life-cycle` › `tooling`): the configuration changes implied by approved
elements, applied before the first tooling task. Like plan-011, no workflow phase hosts this work:
the changes are actions of the approved elements, and the `tooling-delivery` loop that would host
tooling tasks is itself one of them (bug-001). The approver asked on 2026-10-06 to proceed.

Sources, all `approved`:
- spec-001 §1 (S4b): required parameters have no default; spec-001 §4: the first published version
  is ≥ 1.0.0;
- dl-003: the `governance` axis;
- dl-009: `pack-compatibility` states its scope, the catalog's packs;
- adr-002 and adr-003: TypeScript and the tooling libraries;
- bug-001, fix (a) as ruled: a `tooling-delivery` sub-workflow running tooling tasks as
  `developer`.

## Steps

All work happens on branch `config/tooling-followups`, one commit per source. Every changed file
with a `version:` key is bumped once; directives have no such key.

1. **spec-001:**
   - `pack-authoring`: parameters "with a type and a default" → "with a type, and a default unless
     the parameter is required (spec-001 §8.1)";
   - `pack-semver`: the example tag `base@0.1.0` → `base@1.0.0`.
2. **dl-009:** `pack-compatibility` applies to the packs of this repository's catalog; fixtures
   under `tests/fixtures/` are the tooling's self-tests (dl-009).
3. **dl-003, adr-002, adr-003:** `dna.yaml` (version 2 → 3): the `packs` module names the
   `governance` axis; `stacks.technologies` declares TypeScript 6.0.3 and the libraries `yaml`,
   `ajv`, `semver`.
4. **bug-001:**
   - new sub-workflow `tooling-delivery` (version 1): the loop of `kanban-delivery`, with
     `developer` in `design`, `build` and `deliver`, and a `review` that names the developer's
     directives;
   - `kanban-delivery` (2 → 3): the `build` description loses the tooling clause; its header says
     it serves pack tasks;
   - `sw-life-cycle` › `tooling` (2 → 3) and `tooling-change` (1 → 2) include `tooling-delivery`;
   - `workflows.yaml` (2 → 3) includes the new file;
   - `memory.yaml` (2 → 3): the `task` comment names both loops.
5. **Checks:** `npx wingfoil workflow list`, `dna show` and `directives list` exit 0 with no
   warning; every `include` resolves to a declared workflow, checked by hand because `workflow list`
   does not (WingFoil bug-145); `tooling-delivery` and `kanban-delivery` differ only in roles and
   descriptions.
6. **Review and merge:** an independent review by another context, then the approver approves the
   merge in chat; `--no-ff` into `main`; this plan goes `active → done`.

## Handoff

- **claude:** steps 1–5 and the review hand-off.
- **Approver:** the merge of `config/tooling-followups`, in chat.
- Done when the branch is merged and the checks of step 5 pass on `main`.

## Execution Notes

- 2026-10-06: steps 1–4 on `config/tooling-followups`: `fe4c942` (spec-001), `397d747` (dl-009),
  `b0291ad` (dl-003, adr-002, adr-003), `67b1b78` (bug-001).
- Step 5 checks, WingFoil 0.2.2: `workflow list`, `dna show` and `directives list` exit 0 with empty
  stderr; the nine `include`s resolve (checked by hand, WingFoil bug-145); `tooling-delivery` and
  `kanban-delivery` differ only in name, version, descriptions and roles.
- Step 6: an independent review (a subagent with its own context, on a separate worktree) approved,
  with two should-fix, both applied in `a29f8b0`:
  - `b0291ad` had also added a `tooling` module at `src` to `dna.yaml`, beyond this plan and with no
    approved element fixing the path. Dropped; the first tooling task, which creates `src/`, adds it;
  - the `memory.yaml` task comment rewrapped within 100 columns.
- Left for later, out of this plan's scope (review nits):
  - `pack-semver` ("`0.x` … only while spec-001 is not approved") and `pack-cycle` › `first-release`
    ("or 0.x while spec-001 is a draft") are dead clauses now that spec-001 is approved. A later
    configuration change, from spec-001, removes them;
  - bug-001's Observed names `pack-cycle` › `deliver`; the phase is `author`. bug-001 is approved,
    so the slip is recorded here rather than amended.
- 2026-10-06: the approver approved the merge in chat ("si approvo il merge"). Merged into `main`
  with `--no-ff` (`8ccdc45`); the step 5 checks pass on `main`. Plan done.
