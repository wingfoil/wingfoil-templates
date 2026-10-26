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
- WingFoil 0.3.0 counts a step's evidence only from the commit that put the element in its
  current state (spec-017 §4.8, "re-entries"), so after the move the candidate has not progressed;
- an `iterate_over` candidate that is neither in the entry filter nor progressed is skipped.

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
3. **Keep the contract** and ask WingFoil to keep a progressed candidate across a state change of
   its own: a feedback note, and the `release` slot unusable on 0.3.0 meanwhile.

## Decision

Ruled by the approver, Roberto Pompermaier, in chat on 2026-10-26 (plan-047 ruling 14): **option
1, in a decision-log of its own**, apart from dl-026. The points below take effect when this
element is approved.

- **D1 — The contract.** The phase that includes `release` iterates over `release` with a `where`
  whose `status` is `[in-development, releasing]`; it may add scope keys (any key but `status`),
  such as a field naming the Sprint. Everything else of the contract, as dl-026 amends it, stands.
- **D2 — spec-001 §9** says the same, in the sentence dl-026 added; an Execution Note records it.
- **D3 — The lint.** dl-026 D3's check of the `where` reads D1: `status` equal to
  `[in-development, releasing]`, other keys allowed. Part of the same tooling task, task-051.
- **D4 — `pack-foundation-software`'s charter** states D1 in its `delivery` contract, amended in
  place with an Execution Note, approved with this element and the merge OK, as dl-026 D4.
- **D5 — `methodology/fixture`** (`tests/fixtures/software-exit/packs/methodology/fixture/
  workflows/delivery.yaml`) moves to D1's `where` in task-051, coordinated with plan-046's
  session, which owns the fixture; its compositions keep validating.

Consequences: `software`'s Commitments to adopters are untouched (no name changes). A project that
adopted the contract by hand iterates over `[in-development, releasing]`. dl-026 D1 and D3, which
name `[in-development]`, are read with D1; dl-026 is not edited.

## Execution Notes

- 2026-10-26: captured under plan-047, on the approver's ruling in chat.
