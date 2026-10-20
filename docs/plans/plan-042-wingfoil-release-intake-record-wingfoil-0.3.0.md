---
id: plan-042-wingfoil-release-intake-record-wingfoil-0.3.0
type: plan
title: "wingfoil-release-intake record: WingFoil 0.3.0"
status: draft
workflow: "wingfoil-release-intake"
phase: "record"
tags: ["compat","wingfoil","intake"]
---

## Context

WingFoil 0.3.0 was released on 2026-10-19: tag `v0.3.0` on `wingfoil/wingfoil@cc31d7a8`, on npm as
`latest`. `wingfoil-release-intake` records it, on the approver's request in chat on 2026-10-20,
right after plan-041 accepted the charters of `base` and `software`, which need it:
- both charters declare 0.3.0 the oldest release of their matrix and
  `requires_capabilities: [workflow-engine]` (plan-041 ruling 17, J; dl-003 D3), and their
  publication (W9) waits for this intake: until a release listed in `compat.yaml` provides the
  capability, a version's computed range is empty and it must not be published (spec-001 §12);
- `compat.yaml` lists 0.2.2 only, with `format_key: false` and no capability.

**What 0.3.0 provides**, read at `v0.3.0` under plan-041 (step 2) and to be checked by running it:
- every file kind at format 1, an absent key reading as 1; the `format:` key accepted (WingFoil
  dl-149), so `format_key: true` if no file this repository ships draws a warning;
- `reads`: format 1 for the seven kinds of `compat.yaml` (`bindings.yaml` and adapter manifests are
  kinds packs do not ship, spec-001 §12);
- capabilities, recorded only when the CHANGELOG names the feature or command behind one (dl-021
  R4): `workflow-engine`, since 0.3.0's CHANGELOG names `workflow start`, `end`, `next` and
  `finalize` and the engine that deduces instances; not `pack-install`, which is WingFoil v0.4
  (WingFoil dl-138).

**Why a tooling task.** `tests/compat.test.ts` holds `compat.yaml` byte-equal to spec-001 §12's
example and to the compose fixture's `compat.yaml` (dl-010), and asserts its releases. Recording a
release therefore changes spec-001 §12, the fixture and the tests together, as task-028 did for the
vocabulary under plan-032. One task, task-035, hosted by this plan, does the whole `record` phase
through `tooling-delivery` v2, because `record`'s artefacts are code-checked files. Two more
effects are expected and belong to the same task:
- **The matrix runs a release with `format_key: true` for the first time.** spec-001 O10 (no
  released WingFoil had it before v0.3) and dl-009's self-test tolerance read again: `npm run
  validate` and `validate:publication` against 0.3.0, on the golden tree and the fixtures, with no
  warning allowed. A warning 0.3.0 raises on a fixture is fixed in the fixture; one that needs a
  rule changed goes to the approver (dl-019).
- **spec-001 is amended in place** for §12's example and O10, as plan-032 did; the approver's merge
  OK approves the text.

`recheck` and `plan-migrations`: no pack is published (`catalog.yaml` › `packs` is empty), so no
range is recomputed and no migration task opens; this plan records it.

Not in this plan: the `author` phase of the two foundation packs (the next plans); WingFoil's
`bindings.yaml` and adapter manifests as kinds (spec-001 O4, settled); the vocabulary's final
names (WingFoil dl-177).

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`).
2. **task-035**, through `tooling-delivery` v2 as `developer`, on branch `task/task-035-<slug>` from
   `main`:
   1. its body (Context, Acceptance), reviewed independently and amended while `pending`; the
      approver accepts it into the backlog;
   2. its Design committed on `main`, then `backlog → in-progress`;
   3. the build, red first (dl-018), every test written before the change it checks:
      - `compat.yaml`: release 0.3.0 with `format_key`, `reads` and `capabilities` as verified;
      - `src/matrix/wingfoil-0.3.0/package.json` pinning `wingfoil` exactly, and its lockfile
        (`npm install --package-lock-only --ignore-scripts`); `npm run check:pins`; `npm audit`
        0 vulnerabilities on the new lockfile; no new dependency of this repository (adr-003);
      - spec-001 §12's example and the compose fixture's `compat.yaml` equal to the real file;
        §16's O10 settled, and an Execution Note;
      - `tests/compat.test.ts` and any test or fixture whose expectations the new release changes
        (computed ranges, the matrix's runs);
      - `npm run index`: `CATALOG.md` and `catalog-index.json` regenerated (`install` stays empty,
        no release providing `pack-install`);
   4. an independent review of the branch; findings fixed, a re-review when a fix changes
      behaviour (dl-017 R2);
   5. the checks: `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
      `npm run check:packs`, `npm run index -- --check`, `npm run validate` and
      `npm run validate:publication` (expected to fail only where no publishable pack exists),
      from a clean clone on Node.js 22.21 and the floor 22.12.0;
   6. the branch pushed, the real CI run's conclusion recorded, `in-progress → in-review`; the
      approver accepts it and gives the merge OK, which approves spec-001's edited text;
   7. `deliver`: `--no-ff` merge into `main`, `approved → done` with the delivery notes, `main`
      pushed, the branch removed.
3. **`recheck` and `plan-migrations`:** recorded as empty (no published pack).
4. **Close:** this plan goes `active → done`; the `author` phase of the foundation packs can start.

## Handoff

- **claude:** steps 1–4, except the approver's gates.
- **Approver:** task-035's backlog acceptance, its acceptance after the build, the merge OK.
- Done when `compat.yaml` on `main` lists WingFoil 0.3.0, pushed.

## Execution Notes

- 2026-10-20: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to this plan's outline in chat.
