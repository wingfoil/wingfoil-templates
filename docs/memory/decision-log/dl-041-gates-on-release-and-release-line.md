---
id: dl-041-gates-on-release-and-release-line
type: decision-log
title: "Gates on release and release-line"
status: draft
tags: ["packs","software","gates","feedback"]
---

## Context

WingFoil UI adopted `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0 by hand on WingFoil
0.3.1 and proposed, on 2026-11-02, a gate on `software`'s `release` at `releasing` (`reject:
in-development`) and on `release-line` at `active` (`reject: planning`), which it adopted as local
deviations (plan-064 › Context, feedback 1). `software`'s `release` declares no gate, and
`release-line` only `planning: { reject: draft }` (`packs/software/fragments/memory.yaml`): every
other edge of `release`, and `release-line`'s `active → done`, is a `memory submit`, so any team
identity, an agent included, moves a release `releasing → released` or closes a line, with no
approval. The approvals live in the workflows: `release-submit` › `approve-release` (`approval: {
by_role: approver }`) and `release-publishing` › `publish` (the same), then `mark-released` sets
`released` with `element.set_state`; a project that does not run the engine never meets them. No
workflow moves a `release-line`.

UI also observed (feedback 2) that a gate's approval is offered before the phase that owns it.
Reproduced on WingFoil 0.3.2 with a three-phase workflow (enter the gate, work, decide): `workflow
status` lists the element's approval as carried by no open workflow while the deciding phase is
pending, and `memory approve` moves the element at once, exit 0 (plan-064 › Execution Notes, step
1). A gate on `releasing` would therefore be approvable before `publish`, and approving it would
skip the publication steps. For consideration, not as a proposal, UI dropped the gate on `bug` at
`planned`.

What a gate touches: `release-submit` › `approve-release`; `release-publishing` › `publish` and
`mark-released`; the release slot, included by `scrum`'s `sprint` › `release` and `kanban`'s
`release-flow` › `release` (`software`'s `delivery` slot is the methodology's); `end-of-life` ›
`deprecate`, which selects releases up to `releasing`. Adding a gate is "a requirement made stricter
(a new gate)", major in `pack-semver`: `software` 2.0.0; `methodology/scrum` and
`methodology/kanban` require `software@^1`, and moving them to `^2` gives an upgrading project the
new gate, a behaviour change; `pack-semver` has no rule for a `requires` range moved.

## Options

- **(a) UI's gates as proposed:** `releasing: { reject: in-development }` on `release`,
  `mark-released` approving instead of setting the state; `active: { reject: planning }` on
  `release-line`; `approve-release` and `publish` keep their approval or are merged into the gate,
  so a release is not approved three times. Against: on 0.3.2 the gate is approvable out of phase
  (Context), which can skip publication; `release-line`'s gate binds no step. The approval of a gate
  on `releasing` moves the release to `released`, so it can only come after publication: folding
  `publish`'s approval into it turns the authorization before an irreversible tag into a
  ratification after it, and its `reject: in-development` has no meaning for a published release.
- **(b) The approvals kept in the workflows, as today,** and a note in `software`'s section and
  README that a project not running the engine follows those steps by hand, the approver's OK
  recorded before `releasing` and before the tag, never moving a release past `releasing` by
  `submit` alone. For: no change to any pack's state machine or workflows (only `software`'s
  wording), no out-of-phase approval. Against: the type itself still lets `submit` reach `released`.
- **(c) (a) for `release` only.** The same against as (a), without the line's gate.
- **(d) (b) now, (a) once WingFoil binds a gate's approval to the phase that owns it,** a feedback
  note asking it (plan-064 point 4); the release of `software` 2.0.0 with its dependants then.
- **(e) The `release-line` gate only.** It binds no step, so it is listed for the line's whole life
  (feedback 2), with nothing in exchange.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **G1 — Option (d).** Until a released WingFoil binds a gate's approval to the phase that owns it
  (the feedback note of plan-064 point 4), `software` keeps the approvals in `release-submit` ›
  `approve-release` and `release-publishing` › `publish`; its section and README state that a
  project not running the engine follows those steps by hand, the approver's OK recorded before
  `releasing` and before the tag, never moving a release past `releasing` by `submit` alone. When a
  release that `compat.yaml` lists binds gates to their phase, (a) is applied by a decision of its
  own, which rules the approvals' shape: `publish`'s approval kept before the tag, the gate on
  `releasing` approved at `mark-released` as the ratification that publication completed (a reject
  there returns a release whose publication failed), and `approve-release` kept or dropped; a
  release approved two or three times is that decision's trade-off.
- **G2 — The `bug` gate at `planned` stays.** WingFoil UI gave no reason for dropping it. Here,
  being listed as waiting is the intended signal: the approver's go-ahead before a fix starts
  (`planned → in-progress`), and the won't-fix exit (`planned → closed`) it carries. That
  distinguishes it from (e)'s `release-line` gate, whose listing gives nothing in exchange.
- **G3 — `requires` ranges in `pack-semver`:** a `requires` range that excludes a version the
  previous range admitted is major (a project on that version stops validating); a range widened to
  admit a new major while still admitting the previous one, the dependant's content unchanged, is
  minor. Ranges use spec-001 §6.3's form (`>=1.0.0 <3.0.0`). At G1's later `software` 2.0.0,
  `methodology/scrum` and `methodology/kanban` widen their range to admit both majors (minor),
  unless their own content changes.
- **G4 — Where:** G1's wording in `software`'s AGENTS.md section and README, in its next release
  (with bug-012's change), a row of `docs/owed-items.md`; G1's later part, a row whose trigger is a
  WingFoil release binding gates to their phase; G3 in `pack-semver` by a dl actions plan, a row
  whose trigger is the first pack release that moves a `requires` range (at the latest G1's
  `software` 2.0.0), beside the register's row on `pack-semver`'s rule for fixes and changed
  defaults. The rows are added in the commit that records the ruling (dl-036 R2). WingFoil UI's
  local gates stay its deviations until then; a notice at the first fix published (plan-064 ruling
  7).

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-064 (`decision-log-ingest` › `capture`, hosted there), from
  WingFoil UI's adoption feedback of 2026-11-02 and the reproduction on WingFoil 0.3.2.
- 2026-11-05: independent review: request changes, nothing blocking; applied: G1's shape of the
  approvals under (a) left to its own decision with the trade-off stated (a gate on `releasing` is
  approved after publication), G2 argued without a reason UI did not give, G3 in `pack-semver`'s
  terms and §6.3's form with the dependants' path, G4's triggers, the nits (the release slot,
  `release-line`'s edges, (b)'s wording).
