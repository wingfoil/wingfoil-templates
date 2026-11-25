---
id: dl-053-a-pack-release-s-approval-commit-pushed-by-the-approver-the-agent-reading-main-s-ci-on-it
type: decision-log
title: "A pack-release's approval commit pushed by the approver, the agent reading main's CI on it"
status: draft
tags: ["process","publication","packs"]
---

## Context

dl-044 P2 has the agent push a pack-release's approval commit (`releasing → released`) and read
`main`'s CI on it, before it hands over the publication's commands; `pack-release-cycle` v9 ›
`approve-publication` says so. At prel-008 the agent's push of `main` was not permitted in its
environment, and the approver pushed `687f6899` about 1 h 33 min after the commit (plan-087 ›
step 6; prel-008 › Execution Notes, `approve-publication`; dl-044's note of 2026-11-25). Since
plan-087 every push of `main` is the approver's (plan-088 point 8); P2's was the only push of
`main` ruled for the agent. The owed row "dl-044 P2 … not applied at prel-008" falls due at
plan-088 (plan-088 ruling 4). The row "The engine way of working" quotes P2. The adoption (W10)
does not change who may push `main`. Candidate GOV-1 of the inventory of 2026-11-25 (dl-052 C1).

## Options

1. **P2 as written:** the agent pushes the approval commit. Rejected: it was not permitted at its
   first use since dl-044, and nothing in this repository can grant it.
2. **The approver pushes the approval commit** after `memory approve`, and the agent reads
   `main`'s CI on it before it hands over the publication's commands. One more push for the
   approver; the order of P2 kept.
3. **The approval commit pushed with the publication's atomic push.** Rejected: the tag would go on
   a commit whose CI was not read, and `publish` asks for `main`'s CI `success` at the approval's
   commit (plan-087 point 7).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 2.** When the approver approves a pack-release (`releasing → released`), the
  approver pushes that commit (no tag); the agent reads `main`'s CI on it, and hands over the
  publication's commands only after its `success`. dl-044 P2's first sentence is replaced by this;
  the rest of P2 stands (the activation's push the approver's; the split of plan-077 ruling 7 for
  every pack-release, ahead of the adoption).
- **P2 — Applied after approval** by a dl actions plan: `pack-release-cycle` 9 → 10
  (`approve-publication`: the approver pushes the approval commit, the agent reads `main`'s CI on
  it), in one bump with dl-054's change of `validate`; the row "The engine way of working"
  reworded ("the agent pushes a pack-release's approval commit" → "the approver pushes a
  pack-release's approval commit, the agent reads its CI"), its Source extended with dl-053; a
  note on dl-044 citing dl-053; the row "dl-044 P2 … not applied at prel-008" moved to Closed
  (dl-052 D2).

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-25: written under plan-088 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-052, as the approver kept it at the checkpoint (the inventory of 2026-11-25, P2).
