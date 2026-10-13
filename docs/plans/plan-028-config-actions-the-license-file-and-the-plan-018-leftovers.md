---
id: plan-028-config-actions-the-license-file-and-the-plan-018-leftovers
type: plan
title: "config actions: the LICENSE file and the plan-018 leftovers"
status: active
workflow: "decision-log-ingest"
phase: "rule"
tags: ["config"]
---

## Context

Two follow-ups with no owner, listed by dl-016 O2 (the debts carried past M1), opened on the
approver's request in chat on 2026-10-13. No workflow phase hosts this work: the changes are
configuration and documents, no tooling task. As plan-026 and plan-027 host dl-016's actions, this
plan is filed under `decision-log-ingest` › `rule`, with dl-016 O2 as its trigger.

1. **The `LICENSE` file.** `package.json` and `dna.yaml` declare MIT, `dna.yaml` lists `LICENSE`
   among the governance paths, and the root README's "License" section says "MIT, as
   `package.json` declares" (task-023, which left the file out of its scope). No `LICENSE` file
   exists, so the license text is not in the public repository and GitHub detects none. The
   approver ruled on 2026-10-13: MIT, copyright holder Roberto Pompermaier, aligned with WingFoil.
   WingFoil's own `LICENSE` (public repository `wingfoil/wingfoil`, the same text in its npm
   package `wingfoil@0.2.2`) is the standard MIT text with "Copyright (c) 2026 Roberto
   Pompermaier"; GitHub detects it as MIT.
2. **The plan-018 leftovers** (plan-018 › Execution Notes, review nits; plan-015's phase gate;
   dl-016 O2):
   - `pack-semver` says "`0.x` versions are allowed only while spec-001 (the pack format) is not
     approved", and `pack-cycle` › `first-release` "normally 1.0.0, or 0.x while spec-001 is a
     draft". spec-001 is `approved` (2026-10-06), and fixes the rule itself: "the first published
     version of every pack is `1.0.0` or later" (§4), and §18: "once this specification is
     approved, `version` is `1.0.0` or later (§4)". The two clauses are replaced by that rule,
     cited from spec-001, not dropped, so that no text reads as allowing `0.x`. No other
     configuration file mentions `0.x` (grep over `.wingfoil/`). task-016's approved body still
     mentions "`pack-semver`'s `0.x` rule"; it stays as approved;
   - bug-001's Observed names `pack-cycle` › `deliver`; the phase is `author`. bug-001 is
     `approved`, so its body stays as approved (precedent: plan-022) and an Execution Note
     records the slip.

Not in this plan: spec-001's own §4 sentence on `0.x`, which cites `pack-semver` as the source of a
rule `pack-semver` no longer states once step 2 lands: an erratum of an approved tech-spec, recorded
in spec-001's Execution Notes by this plan (step 4) and folded back by spec-001's next amendment
(dl-020 R1–R2); the spec-002 amendment; the decision-log on the WingFoil divergences.

## Steps

On the branch `config/license-and-plan-018-leftovers`, from `main` at `caff542`; one commit per
step.

1. **`LICENSE`** at the repository root: the MIT text, word for word as WingFoil's, with
   "Copyright (c) 2026 Roberto Pompermaier". The root README's "License" section links it: "MIT,
   see [`LICENSE`](LICENSE)." (no email address, task-023).
2. **`pack-semver`:** the `0.x` line becomes "Every published version is `1.0.0` or later
   (spec-001 §4, §18)." Directives carry no version key: nothing is bumped.
3. **`pack-cycle`** (`version` 3 → 4) › `first-release`: "Publish the pack's first version, `1.0.0`
   or later (spec-001 §4)."
4. **Notes on approved elements:** bug-001 gets an Execution Note: the Observed's `pack-cycle` ›
   `deliver` is `pack-cycle` › `author` (plan-018 › Execution Notes; plan-028). spec-001 gets an
   Execution Note recording the §4 erratum above (dl-020 R1).
5. **Checks:** `diff LICENSE node_modules/wingfoil/LICENSE` is empty;
   `npm run -s wingfoil -- workflow list` and `directives list` exit 0 with no warning;
   `npm test` (`tests/root-readme.test.ts` checks the README's links), `npm run lint`,
   `npm run check:packs` and `npm run validate` exit 0; after the merge,
   `gh api repos/wingfoil/wingfoil-templates/license` reports MIT.
6. **Review:** an independent review of the change (dl-017), its findings fixed, a re-review when a
   fix changes a rule.
7. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–7, except the merge OK. It never runs `memory approve` or `memory reject`.
- **Approver:** the license choice (given in chat on 2026-10-13); the merge OK.
- Done when the changes are on `main`, pushed, and GitHub reports the license. The plan then goes
  `active → done`.

## Execution Notes

- 2026-10-13: the approver asked in chat for the `LICENSE` file (MIT, their name, aligned with
  WingFoil) and the plan-018 leftovers, and gave the choices above; `memory add --set` not used
  (W-02), `workflow` and `phase` filled by editing the draft.
- 2026-10-13: independent review (approve after amendments: host `decision-log-ingest` › `rule`
  with dl-016 O2 as trigger; §18 quoted from its body; the spec-001 §4 erratum recorded under
  dl-020; a `diff` check for the license text), amended. Submitted `active` on the approver's
  request, with the choices already given in chat.
- 2026-10-13, steps 1–4: `6e31de5` (`LICENSE`, the README's "License" section), `4f74759`
  (`pack-semver`), `9bf1f18` (`pack-cycle` v4), `57228ee` (notes on bug-001 and spec-001).
- 2026-10-13, step 5: `diff LICENSE node_modules/wingfoil/LICENSE` empty; `workflow list` and
  `directives list` exit 0 with empty stderr; no `0.x` left under `.wingfoil/`; `npm test` 803 of
  803, `lint`, `check:packs` and `validate` exit 0. The license check on GitHub follows the merge.
- 2026-10-13, step 6: independent review: approve, no finding.
- 2026-10-13, step 7: CI run 38360863825 on `57228ee`, conclusion `success` for
  `validate (22.21.0)` and `validate (22.12.0)`. Waiting for the approver's merge OK.
- 2026-10-13: the approver gave the merge OK in chat; `--no-ff` merge into `main`, push, branch
  removed, then the license checked on GitHub. This plan goes `active → done`.
