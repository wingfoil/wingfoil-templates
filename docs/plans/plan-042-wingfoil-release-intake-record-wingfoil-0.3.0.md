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

The plan is filed under `record`, the phase that carries the work; it also records the outcome of
`recheck` and `plan-migrations`. Its roles (tech-lead, reviewer, product-owner) are run by claude;
`record`'s `approval: { by_role: approver }` is the approver's acceptance of the tasks and the
merge OK.

**What 0.3.0 provides**, read at `v0.3.0` (plan-041 step 2) and to be checked by running it:
- every file kind at format 1, an absent key reading as 1, a newer format refused; the `format:`
  key accepted (WingFoil dl-149), so `format_key: true` if no file this repository ships draws a
  warning;
- `reads`: format 1 for the seven kinds of `compat.yaml` (`bindings.yaml` and adapter manifests are
  kinds packs do not ship, spec-001 §12);
- capabilities, recorded only when the CHANGELOG names the feature or command behind one (dl-021
  R4): `workflow-engine`, since 0.3.0's CHANGELOG names `workflow start`, `end`, `next` and
  `finalize`, with which WingFoil "deduces where every started workflow stands"; the release's
  `notes` say so, the vocabulary's wording ("WingFoil executes workflows") being provisional and
  WingFoil's to name (dl-177). Not `pack-install`, which is WingFoil v0.4 (WingFoil dl-138).

**Why tooling, and why two tasks.** `tests/compat.test.ts` holds `compat.yaml` byte-equal to
spec-001 §12's example and to the compose fixture's `compat.yaml` (dl-010), so recording a release
changes the spec, the fixture and the tests together, as task-028 did under plan-032. Running 0.3.0
also breaks the compatibility matrix itself (read at `v0.3.0` by this plan's review):
- 0.3.0's `--version` prints `<version> (<sha>)`, where the matrix expects the version alone;
- 0.3.0 answers from what is committed at `HEAD`, and the matrix's scratch repository has no
  commit, so `workflow list` would see no workflow;
- the tests' WingFoil stub answers 0.2.2 for every release; the fixture's fictitious release 9.0.0
  (`tests/support/published-repo.ts`) is appended to the real file, so with 0.3.0 listed the
  computed ranges become `>=0.3.0 <=9.0.0` and the `publish`, `feedback-note` and `evidence` tests
  move; `compat.test.ts` uses 0.3.0 itself as its sample second release.

The approver ruled on 2026-10-20, on this plan's review:
- **K:** two tasks, as dl-018 asks of a task too large for red first: **task-035** makes the matrix
  run WingFoil 0.3.0, tested on a fixture `compat.yaml`, without touching the real file;
  **task-036**
  records 0.3.0, the intake proper.
- **L:** for 0.3.0, a "warning" the zero-warning matrix refuses (`pack-compatibility`) is any
  diagnostic of severity warning or error, whether on stderr (`Warning: …`) or in the
  `diagnostics` array `workflow list` prints on stdout.

`recheck` and `plan-migrations`: no pack is published (`catalog.yaml` › `packs` is empty), so no
range is recomputed and no migration task opens.

Not in this plan: this repository's own WingFoil (`devDependencies.wingfoil: 0.2.2`) and its move to
0.3.0, which also meets 0.3.0's breaking `include:` and `HEAD` rules on this repository's
configuration (W9, its adoption of the packs); `src/wingfoil-builtins.ts`, whose built-in ids are
unchanged at 0.3.0 (plan-041 step 2); the `author` phase of the foundation packs (the next plans);
the vocabulary's final names (WingFoil dl-177).

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver, and the plan is
   reviewed again.
2. **Each task**, through `tooling-delivery` v2 as `developer`, on its own branch
   `task/<task id>` from `main`, task-035 then task-036:
   1. its body (Context, Acceptance), reviewed independently and amended while `pending`; the
      approver accepts it into the backlog;
   2. its Design committed on `main`, then `backlog → in-progress`;
   3. the build, red first (dl-018), every test written before the change it checks;
   4. an independent review of the branch; findings fixed, a re-review when a fix changes
      behaviour (dl-017 R2);
   5. the checks, from a clean clone on Node.js 22.21 and the floor 22.12.0: `npm test`,
      `npm run lint`, `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
      `npm run index -- --check` and `npm run validate` exit 0; no new dependency of this
      repository (adr-003);
   6. the branch pushed, the real CI run's conclusion recorded, `in-progress → in-review`; the
      approver accepts it and gives the merge OK;
   7. `deliver`: `--no-ff` merge into `main`, `approved → done` with the delivery notes, `main`
      pushed, the branch removed.
3. **task-035 — the matrix runs WingFoil 0.3.0:**
   - the version check accepts `<version>` or `<version> (<sha>)`;
   - the composed `.wingfoil/` is committed in the scratch repository before WingFoil's commands;
   - ruling L in the judge: stderr warnings and `workflow list`'s `diagnostics`;
   - the tests' stub answers per release; `fixtureCompat` is built from a frozen 0.2.2-only header,
     so the fixture ranges do not depend on the real `compat.yaml`;
   - a fixture `compat.yaml` with 0.3.0 proves a run against it with the stub; a run of the real
     0.3.0 is proved by the CI's golden fixture step, which installs it.
4. **task-036 — record 0.3.0:**
   - `compat.yaml`: release 0.3.0 with `format_key`, `reads`, `capabilities: [workflow-engine]` and
     its `notes`, as verified by running it;
   - `src/matrix/wingfoil-0.3.0/package.json` pinning `wingfoil` exactly, and its lockfile
     (`npm install --package-lock-only --ignore-scripts`); `npm run check:pins`; `npm audit` 0
     vulnerabilities on the new lockfile, any other result going to the approver (dl-019);
   - spec-001, amended in place as plan-032 did (the merge OK approves the text, so nothing is left
     to fold back under dl-020): §12's example and the compose fixture's `compat.yaml` equal to the
     real file, §12's prose gaining 0.3.0's check (date, commands, result), §16's O10 settled, an
     Execution Note; dl-009's Execution Note: the self-tests now also run a release with
     `format_key: true`, the tolerance applying to 0.2.2 only;
   - `tests/compat.test.ts` (the real file's releases; a sample release other than 0.3.0);
   - `.github/workflows/ci.yml`: its header and the golden fixture step's name;
   - `npm run index`: `CATALOG.md` and `catalog-index.json` expected byte-unchanged, at the root and
     in the fixture tree (`install` stays empty);
   - the expectations after it: `npm run validate` on the golden tree runs 0.2.2 (tolerated) and
     0.3.0 (no warning); `npm run validate:publication` exits 1 on this repository ("publication
     mode with no composition") and passes on the golden tree against 0.3.0 alone; CI and the
     local matrix download 0.3.0 (network).
5. **`recheck` and `plan-migrations`:** recorded as empty.
6. **Close:** this plan goes `active → done`; the `author` phase of the foundation packs can start.

## Handoff

- **claude:** steps 1–6, except the approver's gates.
- **Approver:** rulings K and L (given); each task's backlog acceptance, its acceptance after the
  build and its merge OK, task-036's also approving spec-001's edited text.
- Done when `compat.yaml` on `main` lists WingFoil 0.3.0 and the matrix runs it, pushed.

## Execution Notes

- 2026-10-20: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to this plan's outline in chat.
- 2026-10-20: independent review: request changes. 0.3.0 breaks the matrix itself (`--version`,
  `HEAD`) and moves many test expectations (the stub, the fixture's 9.0.0, `compat.test.ts`); the
  CI's comments, dl-009, spec-001 §12's prose and the out-of-scope list were missing. The approver
  ruled K (two tasks) and L (what counts as a warning); amended. Re-review requested.
