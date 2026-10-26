---
id: dl-027-software-s-delivery-contract-iterates-over-releases-in-development-or-releasing
type: decision-log
title: "Software's delivery contract iterates over releases in development or releasing"
status: draft
tags: ["packs","software","methodology","W8"]
---

## Context

`software`'s `delivery` contract (`pack-foundation-software`, R2 and R-11, accepted under plan-041;
dl-026, `pending`, keeps this point) says the phase that includes `release` iterates over
`release` with `where: { status: [in-development] }`. spec-001 §9, as dl-026 amends it, says the
same, and dl-026 D3 has the lint check it. `methodology/fixture` (`tests/fixtures/software-exit`)
writes it so, and validates on WingFoil 0.3.0, a check that reads the files and runs no release.

A run of `sw-life-cycle` on WingFoil 0.3.0 (plan-047, 2026-10-26, a scratch repository driven
with the `workflow` and `memory` commands, each state change in the commit form the engine
expects) showed that a release stops after `release-submit` › `enter-releasing`:
- `enter-releasing` moves the release to `releasing`, which leaves the entry filter
  (`status: [in-development]`);
- a candidate counts as progressed only once a phase of the iterated sub completes, and
  `release`'s first phase, `submit` (including `release-submit`), completes only at
  `approve-release`;
- an `iterate_over` candidate that is neither in the entry filter nor progressed is skipped, so
  from `enter-releasing` until `approve-release` the release is outside the iteration.

The release then drops from the frontier, and `approve-release`, `release-publishing` and
`mark-released` never run. With `where: { status: [in-development, releasing] }` the same run went
through every phase to `released`. The defect is the contract's, so it reaches every methodology,
`methodology/fixture` included, and `software` cannot be released through its own `release` slot
as the contract stands.

plan-047 also needs a scope key on that `where`: in `scrum`, a Sprint's `release` phase must leave
out the releases of earlier Sprints, or a released release counts as a complete candidate in every
later Sprint and closes the Sprint's earlier optional phases. The contract says nothing of other
keys.

## Options

1. **Widen the status list** to `[in-development, releasing]`, the states a release passes
   through inside the `release` slot, and allow further scope keys (any key but `status`).
2. **Drop the status key** from the contract and let each methodology choose: the contract then no
   longer guarantees that a released or a draft release is left out.
3. **Keep the contract** and ask WingFoil to count a candidate as progressed once a step inside an
   included sub completes: a feedback note, and the `release` slot unusable on 0.3.0 meanwhile.
4. **Restructure `release`'s default** so that progress shows earlier, for example with
   `release-submit`'s phases as direct phases of `release`. Rejected: dl-015 C5 and plan-041's R3
   keep the thin `release` and WingFoil's two sub-workflows with their phase names, which
   `software`'s Commitments to adopters keep.

## Decision

Ruled by the approver, Roberto Pompermaier, in chat on 2026-10-26 (plan-047 ruling 14): **option
1, in a decision-log of its own**, apart from dl-026. The points below take effect when this
element is approved.

- **D1 — The contract.** The phase that includes `release` iterates over `release` with a `where`
  whose `status` is `[in-development, releasing]`; it may add scope keys (any key but `status`),
  such as a field naming the Sprint, each a frontmatter field the composed `release` type
  declares (a field it does not declare reads as empty, and a key that matches nothing makes the
  slot pass silently). Everything else of the contract, as dl-026 amends it, stands.
- **D2 — spec-001 §9** says the same, in the sentence dl-026 added; an Execution Note records it.
- **D3 — The lint.** dl-026 D3's check of the `where` reads D1: `status` equal to
  `[in-development, releasing]`, each other key a field of the composed `release` type, the
  methodology's tightening included; key values are not checked. Part of the same tooling task,
  task-051.
- **D4 — `pack-foundation-software`'s charter** states D1 in its `delivery` contract, amended in
  place with an Execution Note, approved with this element and the merge OK, as dl-026 D4.
- **D5 — `methodology/fixture`** (`tests/fixtures/software-exit/packs/methodology/fixture/
  workflows/delivery.yaml`) moves to D1's `where` in task-051, coordinated with plan-046's
  session, which owns the fixture; its compositions keep validating.

Consequences: the gap is only the window between `enter-releasing` and `approve-release`; a reject
at `approve-release`, which returns to `pre-release-checks` with the release still `releasing`, is
covered too; from `approve-release` on the candidate has progressed, and once `released` it counts
as complete. `draft` and `planning` stay out because the methodology moves its releases to
`in-development` itself; `released` stays out because a release this instance ran counts as complete
anyway, and one it never ran must be ignored. `software`'s Commitments to adopters are untouched (no
name changes). A project that adopted the contract by hand iterates over
`[in-development, releasing]`. dl-026 D1 and D3, which name `[in-development]`, are read with D1;
dl-026 is not edited.

## Execution Notes

- 2026-10-26: captured under plan-047, on the approver's ruling in chat.
- 2026-10-26: independent review: approve after amendments. The cause corrected (a candidate
  progresses only when a phase of `release` completes, not by a cutoff of evidence); option 4
  added; scope keys limited to fields of the composed `release`; the consequences detailed.
- 2026-10-26: focused re-review: approve after amendments. spec-001 §9 and the charter now state
  the scope-key limit, with their notes; the reason `released` stays out; D3 reads the composed
  `release`; a wording in option 4. Submitted.
