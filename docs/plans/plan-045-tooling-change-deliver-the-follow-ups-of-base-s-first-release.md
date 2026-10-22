---
id: plan-045-tooling-change-deliver-the-follow-ups-of-base-s-first-release
type: plan
title: "tooling-change deliver: the follow-ups of base's first release"
status: draft
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
  refuses a type without it); a lint rule enforces it, so the lint stops such a pack before the
  matrix does. The amendment is approved by the task's merge OK, as in plan-032.
- **H.** Three feedback notes, one `kind` each (WingFoil dl-163 R4): F-032 (`request`): suspending
  a workflow instance, which `base`'s `plan` cannot express since dl-023 D1 dropped `parked`;
  F-033 (`gap`): no designed way to close a plan that is not an instance started by
  `workflow start`; F-034 (`gap`): the command WingFoil offers for a `memory.add(...)` action reads
  only its `type`, so `tags` and the other arguments are dropped. WingFoil's v0.3 retrospective
  (`19a66000`) covers none of them (plan-043).
- **I.** One task for the two test defects.

The configuration changes are this plan's own step, as plan-028 changed `pack-semver`:
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
2. **Configuration** (on `main`): `config(directives): pack-semver …` and
   `config(memory): v6 …`, each reviewed independently before it is pushed; `npm run -s wingfoil --
   workflow list` and `directives list` with no warning after them.
3. **task-041, the feedback notes** F-032, F-033 and F-034 in `docs/wingfoil-feedback/`, in
   dl-163's format with their ledger rows, each reproducible with WingFoil 0.3.0 alone (command,
   output, version), written `open`; `tests/feedback-note.test.ts` passes.
4. **task-042, `template.frontmatter`:** spec-001 §7.5 amended in place (its table's row and the
   prose; an Execution Note lists the change and its approval); a lint rule refusing a Memory type
   defined by a pack without `template.frontmatter.required`; red first (dl-018); `base` and the
   fixtures pass.
5. **task-043, the tests that depend on their environment:** `tests/publish.test.ts`'s identity
   test passes with `GIT_AUTHOR_*` and `GIT_COMMITTER_*` set; `tests/check-packs.test.ts` copies a
   fixture `compat.yaml`, held equal to the real one as task-040 holds the catalog, so that a
   WingFoil intake does not move it; red first (dl-018).
6. Each task through `tooling-delivery`: its body reviewed and accepted into the backlog, its
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
