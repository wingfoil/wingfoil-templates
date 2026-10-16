---
id: plan-040-spec-amendment-fold-back-plan-039-s-rulings-into-spec-001-and-spec-002
type: plan
title: "spec amendment: fold back plan-039's rulings into spec-001 and spec-002"
status: active
workflow: "sw-life-cycle"
phase: "specification"
tags: ["spec","base"]
---

## Context

The element plan-039 named at its close (the approver's option (a), 2026-10-16, dl-020 R2): it
folds back into spec-001's and spec-002's bodies the rulings recorded under plan-039, before wave
W8, which builds on both (dl-020 R3). Opened on the approver's request in chat on 2026-10-16.
Hosted by `sw-life-cycle` › `specification`, the phase that produces tech-specs, as plan-031 was;
the phase reopens only for this amendment.

**How.** As plan-031 and plan-038: spec-001 and spec-002 are amended **in place**, the body edited
under this plan, their Execution Notes listing the changes, the approver's merge OK the approval of
the edited text. No code, test or generated file changes: the tooling (task-031 … task-034)
already implements the text this plan writes. No errata were found under plan-039.

The rulings it folds back (plan-039's Context, each given by the approver in chat):
- **R3** (2026-10-15): the conditional part in the index (spec-002 §3.3), and the Summary mark in
  `CATALOG.md` (§3.2) and on the search page (§5); recorded in spec-002's Execution Notes by
  task-033 (that note is dated 2026-10-15 by mistake: task-033 wrote it on 2026-10-16);
- **R7** (2026-10-15): an empty conditional part is refused (spec-001 §6.5, §18);
- **R8** (2026-10-15): sections 4 and 5 of a pack's README mark the conditional part's files
  (spec-002 §2.1); recorded in spec-002's Execution Notes with R3;
- **R9** (2026-10-16): a repeated entry of `not_applicable_allowed` or `lists` changes nothing
  (spec-001 §7.5);
- **R10** (2026-10-16): a later pack may introduce `waiting` or `limits` on a type whose defining
  pack declared none, under the same rules (spec-001 §7.5).

The approver also ruled on 2026-10-16, on this plan's proposal: the host above; and plan-039's R6
(a publication fails without a leg with `software` that ran) is not written into spec-001 §15,
which already defers to `pack-compatibility`, where it is stated.

Not in this plan: the readings recorded in task-031 … task-034 (the `[+software]` label, deep
equality, key orders, the propagation through `defaults`, and task-032's reading that "requires
`software`" means through `requires`, directly or transitively), which stay in those elements and
are not the approver's rulings; a later amendment may fold back the last one, which touches
§6.5; R2, R5 and R6, which concern `npm run validate` and `pack-compatibility`; wave W8 (another
session, on the approver's OK).

## Steps

All work happens on branch `spec/plan-040-fold-back`, from `main`, one commit per row.

| # | File | Change | Source |
|---|---|---|---|
| 1 | spec-001 §6.2, §6.5, §18 | the conditional part's `contents` lists at least one workflow or directive: §6.2's `conditional` row ("its `contents` non-empty, §6.5"), §6.5's `contents` bullet, and §18's `conditional` check refusing an empty one | R7 |
| 2 | spec-001 §7.5, §18 | the row of `not_applicable_allowed` and `lists`, and the failure list: a repeat of an entry already in the set, with the field in the fragment's `required`, changes nothing; §18's check reads "name only fields of the fragment's own `required`; the merge judges that a tightening adds them, a repeat changing nothing (§7.5)" | R9 |
| 3 | spec-001 §7.5 | the rows of `waiting` and `limits`, and "Waiting, returns and limits": a later pack may introduce them on a type whose defining pack declared none, under the same rules | R10 |
| 4 | spec-002 §3.3 | a version object's `conditional`: a list of one `{ with }`, copied from the tag's `pack.yaml` as the catalog version entry copies it, after `conflicts` and before `readme_url`, only for a pack that carries one; a pack object's `conditional_workflows` and `conditional_directives`, each a sorted list of names, right after `workflows` and `directives`, always present; `workflows` and `directives` are what is always composed | R3 |
| 5 | spec-002 §3.2, §5 | the Summary of a pack with a conditional part is its first sentence followed by the part's workflows, or its directives when it has none, sorted, in code spans, and the layer the latest version's `with` names: `` <first sentence> (`delivery`, `flow-delivery` only with `software`) ``; the search page's table shows the same | R3 |
| 6 | spec-002 §2.1 | section 4, under "Declares": `` workflows only with `software`: … `` and `` directives only with `software`: … ``, one line each, when non-empty; section 5: each of the part's workflows and directives on its own line ending `` , only with `software` ``, a directive's roles cell `—` (nothing always composed assigns it, spec-001 §6.5); rows 4 and 5 of the table use one wording | R8 |
| 7 | spec-001, spec-002 Execution Notes | the note of this amendment; spec-002's note of R3 and R8 marked as folded back, its date corrected to 2026-10-16 | dl-020 R2 |

Then:
- **Checks:** `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
  `npm run check:packs`, `npm run index -- --check` and `npm run validate` exit 0
  (`tests/catalog.test.ts` included: §11 does not change).
- **Coherence:** a read of the amended sections against the tooling (`src/pack-rules.ts`,
  `src/pack-files.ts`, `src/memory-merge.ts`, `src/index-model.ts`, `src/index-render.ts`,
  `src/readme-generate.ts`, `src/site.ts`): any difference is reported to the approver, not
  edited silently.
- **Scope:** `git diff --name-only main...` shows only spec-001, spec-002 and this plan, and the
  diff of each spec only the table's sections and its Execution Notes.
- **Privacy:** the diff names no non-software project, local path or private repository.
- **Review:** an independent review of the branch by a subagent (dl-017), its findings fixed, a
  re-review when a fix changes a rule.
- **Branch close:** push, the real CI run's conclusion recorded here; on the approver's merge OK,
  `--no-ff` merge into `main`, push, the branch removed; plan-039's Execution Notes record the
  fold-back.

## Handoff

- **claude (architect):** the rows above, the checks, the review hand-off, the merge once
  approved.
- **Approver:** the merge OK, which approves spec-001's and spec-002's edited text.
- Done when the branch is merged and pushed. The plan then goes `active → done`, and W8's opening
  plan (another session) can start.

## Execution Notes

- 2026-10-16: written; `workflow` and `phase` filled by editing the draft (W-02). The approver
  approved the proposal in chat, with the host and R6 left out of spec-001.
- 2026-10-16: independent review: approve after amendments (R9 also in §18; R7 also in §6.2; the
  exact forms of R3's fields and mark and of R8's lines, taken from the tooling; task-032's
  transitive reading named as left out; the date of spec-002's note; the scope and privacy checks;
  `src/pack-files.ts` and `src/site.ts` in the coherence read). No finding changes a ruling, so no
  re-review. Plan submitted.

- 2026-10-16, rows 1–7 applied (`26d3c77` … `8ac0d85`). Independent review of the branch: approve
  after minor amendments, none changing a ruling (§7.5's failure list carries R9's condition; the
  §3.2 example taken from spec-001 §6.2's kanban; §3.3's `conditional` per version; §2.1 rows 4
  and 5 name both lines and mark only a workflow's or directive's own line; the R3/R8 note marked
  as folded back). Fixed in the next commit; no re-review.
- 2026-10-16, checks on Node.js 22.21.0 at `8ac0d85` (the later commit changes spec text outside
  §11 only; `tests/catalog.test.ts` re-run green at `a3d3bf1`): 915 of 915 tests, `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and `workflow list`
  exit 0. Scope: the branch changes only spec-001, spec-002 and this plan. Privacy: the diff names
  no non-software project, local path or private repository.
- 2026-10-16, branch pushed: CI run 38943478966 on `eeb1980`, conclusion `success` (`validate
  (22.12.0)` and `validate (22.21.0)` both `success`). Waiting for the approver's merge OK.
