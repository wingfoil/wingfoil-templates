---
id: plan-045-tooling-change-deliver-the-follow-ups-of-base-s-first-release
type: plan
title: "tooling-change deliver: the follow-ups of base's first release"
status: active
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","W8"]
---

## Context

`base` 1.0.0 is published (plan-044, 2026-10-22). Its author and first-release phases left owed
items (plan-043, plan-044 ruling D and task-040's follow-ups), settled here before `software`'s
`author`, so that `software` is written against the corrected rules. None changes `packs/` or
needs a new version of `base`.

The approver's rulings (2026-10-22, the outline approved in chat, as recommended):
- **G.** spec-001 §7.5, amended in place, requires `template.frontmatter` on every Memory type a
  pack defines (today §7.5's table lets the defining pack declare none, while WingFoil 0.3.0
  refuses a type without it); the tooling enforces it, so the lint stops such a pack before the
  matrix does (step 4). The amendment is approved by the task's merge OK, as in task-036.
- **H.** Three feedback notes, one `kind` each (WingFoil dl-163 R4): F-032 (`request`): suspending
  a workflow instance, which `base`'s `plan` cannot express since dl-023 D1 dropped `parked`;
  F-033 (`gap`): no designed way to close a plan that is not an instance started by
  `workflow start`; F-034 (`gap`): the command WingFoil offers for a `memory.add(...)` action reads
  only its `type`, so `tags` and the other arguments are dropped. WingFoil's v0.3 retrospective
  (`19a66000`) covers none of them (plan-043).
- **I.** One task for the two test defects.

The configuration changes are this plan's own step, committed as `pack-semver`'s and
`memory.yaml`'s earlier changes were (`4f74759`, `0425459`):
- the `pack-semver` directive: a pack's first version is `1.0.0`, its `bump` `major` (plan-044
  ruling F);
- `.wingfoil/memory.yaml`, version 6: the `pack-release` type's comment says that `released` is
  the approver's authorization, and that `publish` then tags and updates `catalog.yaml`
  (pack-release-cycle's order; today it says "tag pushed").

Who runs what: claude drafts for the product-owner (`plan`) and is the developer of every task and
of the configuration commits; the reviewer is an independent subagent (dl-017), never the author's
context; claude never runs `memory approve` or `reject` and hands the approver the command.

Not in this plan: `software`'s `author`; WingFoil 0.3.1's intake (when WingFoil publishes it; it
recomputes `base`'s range); the foundation packs' `retrospective`; spec-001 §8.3's fold-back (W8's
close).

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **Configuration** (on `main`, in the form of `4f74759` and `0425459`): the `pack-semver`
   directive's first-version clause; `.wingfoil/memory.yaml` v6, the `pack-release` type's comment
   on `released` and the `pack` type's comment, whose `active` then reads "first version
   published". Each reviewed independently before it is pushed; `npm run -s wingfoil --
   workflow list` and `directives list` with no warning after them.
3. **task-041, the feedback notes** F-032, F-033 and F-034 in `docs/wingfoil-feedback/`, in
   dl-163's format, written `open`:
   - each reproducible with WingFoil 0.3.0 alone, run in a scratch project with 0.3.0 installed
     (this repository's governance pin is 0.2.2, so `wingfoil_version: 0.3.0` is written by hand,
     not by `npm run feedback:note`);
   - each cites and is told apart from the notes and decisions near it: F-032 from 0.3.0's
     `memory park` (a `returns` edge, which does not suspend an instance; dl-023 option (b));
     F-033 continues F-025 (0.2.2: no verb leaves `waiting` but `deprecate`) with what 0.3.0's
     `workflow end` changed; F-034 is distinct from F-011 (`--set` fills only id tokens);
   - the inbox's test (`tests/support/inbox.ts`): contiguous numbering from F-001, the six fields
     in order, the body's opening line naming task-041, `## Observed` and `## Expected`, one
     ledger row per note.
4. **task-042, `template.frontmatter`.** The red step first records what WingFoil 0.3.0 accepts
   (`frontmatter: {}`, `required: []`, or only a non-empty `required`), and the rule and the
   amendment use that form. The rule lives where the definition is known: the merge
   (`src/memory-merge.ts`, beside its `exempt` refusal) refuses a type's first definition without
   it, and the lint reports it through the compositions it already runs (spec-001 §18: the
   composer refuses what the lint rejects); a later pack that restates `path`, `id_pattern` or
   `template.file` is not a definition. spec-001 amended in place, as task-036 did: §7.5's table
   row ("including when the defining pack declared none" goes), its "These fail composition" list,
   and a §18 bullet; an Execution Note lists the change and its approval. What moves, listed in
   the task: the §7.5 example fixtures (`tests/fixtures/merge/example-1` and `example-2`), the
   inline trees of `tests/check-packs.test.ts`, `compose-documents`, `memory-merge`, `output` and
   `readme-generate`, and `tests/memory-merge.test.ts`'s "adds required fields, also when the
   defining pack declared none", which becomes the refusal; `tests/fixtures/compose/expected*` and
   `packs/base` stay byte-identical. Red first (dl-018).
5. **task-043, the tests that depend on their environment:**
   - `tests/publish.test.ts`'s identity test passes with `GIT_AUTHOR_*` and `GIT_COMMITTER_*` set;
     the likely fix site is `isolatedGitEnv` (`tests/support/git-repo.ts`), not `src/`;
   - the tests that copy the real `compat.yaml` (`tests/check-packs.test.ts`,
     `tests/example-rules.test.ts`) take a fixture whose `releases` are frozen (`FROZEN_COMPAT`,
     whose relation to the real file `tests/compat.test.ts` already holds), so that an intake
     moves no test; `tests/readme-rules.test.ts`, which reads it on purpose (the `pack-install`
     mark), stays and is named as such. The failure removed: a release adding a capability such
     as `pack-install` changes those rules' outcome; the red test simulates it.
   - Red first (dl-018).
6. Each task through `tooling-delivery`, one after the other (its WIP limit is one): its body reviewed and accepted into the backlog, its
   Design on `main`, the build on `task/<task id>`, an independent review, the checks from clean
   clones on Node.js 22.21 and 22.12.0, the CI's conclusion recorded, the approver's acceptance and
   merge OK, `done`; this plan's Execution Notes record each.
7. **Close:** the wave's errata and rulings per tech-spec (dl-020): spec-001 §7.5 amended in place
   by task-042, nothing to fold back; `active → done`.

## Handoff

- **claude:** every step but the approver's gates.
- **Approver:** each task's backlog acceptance, its acceptance after the build and its merge OK.
- Done when the two configuration commits and the three tasks are on `main`, pushed, with the CI
  `success`.

## Execution Notes

- 2026-10-22: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to the outline in chat; rulings G–I as recommended.
- 2026-10-22: independent review: approve after amendments; no ruling changed. Applied: the rule in
  the merge, where a type's definition is known, reported by the lint through its compositions
  (ruling G's means made exact); the form 0.3.0 accepts recorded first; the fixtures and tests
  that move listed; the fixture `compat.yaml` with frozen `releases`, every copying test named;
  how 0.3.0 runs for the notes and the notes they must be told apart from; the inbox test's
  constraints; the `pack` type's comment in v6; the commit precedents; the WIP limit.

