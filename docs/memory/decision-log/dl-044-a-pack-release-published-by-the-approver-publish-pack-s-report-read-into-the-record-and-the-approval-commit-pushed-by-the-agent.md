---
id: dl-044-a-pack-release-published-by-the-approver-publish-pack-s-report-read-into-the-record-and-the-approval-commit-pushed-by-the-agent
type: decision-log
title: "A pack-release published by the approver: publish:pack's report read into the record, and the approval commit pushed by the agent"
status: draft
tags: ["process","publication","packs"]
---

## Context

plan-077 ruling 7 had the approver run `npm run publish:pack`, the atomic push of the tag and
`main`, and the activation's `memory submit` and its push, from commands the agent handed over; the
agent prepared, checked and read the results. It worked as written (the inventory of 2026-11-21,
§4, §5.4), with two gaps:
- **The publication's own output is not in the record.** `publish:pack` prints its publication
  matrix, the tag, the digest and the range in the approver's shell; prel-007 › Publication reads
  its success from the catalog commit and the tag's CI, not from the command's report (prel-007 ›
  Execution Notes, `publish`).
- **Who pushes the approval commit is not ruled.** The agent pushed `84cb0858`, prel-007's
  approval, which ruling 7 does not name (prel-007 › Execution Notes, `approve-publication`).

The row "The engine way of working" makes the rule permanent at the adoption: an agent never runs
`publish:pack`, a pack's activation or a command whose commit or tag carries the approver's
identity; it says nothing of how the output reaches the record. Candidate GOV-1 of dl-043 (C1).

## Options

1. **As today:** the success read from the catalog commit and the tag's CI. Rejected: the run
   count, the digest and the range printed at publication are never compared with the record.
2. **The approver pastes the output in chat**, the agent copies it. Rejected: text passed by hand,
   long, and nothing checks it is complete.
3. **`publish:pack` writes its report to a file** (an option `--report <path>`, the path outside
   the tree, so the tree stays clean); the approver runs it with that option and the agent reads the
   file and records its lines in the pack-release's Publication, comparing the digest and the range
   with the Validation's dry run.
4. **The agent reruns the dry run after the publication.** Rejected: a dry run on the catalog
   commit is a different run, and it cannot run on a tag already made.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 3.** `publish:pack` takes `--report <path>`: it writes the report it prints (the
  publication matrix's lines, the tag, the commit, the digest, the range, "Not pushed") to that
  file, refusing a path inside the repository. The commands handed to the approver include it; the
  agent reads the file, records the matrix's summary line, the tag, the digest and the range in the
  Publication, and checks the digest and the range against the dry run of `validate`. A missing or
  different value stops the agent's record and goes to the approver before CB-6 is read.
- **P2 — The approval commit.** When the approver approves a pack-release (`releasing →
  released`), the agent pushes that commit and reads `main`'s CI on it, before it hands over the
  publication's commands; the push carries no tag. Ruling 7's reach stays `publish:pack`, the
  atomic push, the activation's `memory submit` and its push.
- **P3 — Applied after approval** by a dl actions plan: a tooling task (`tooling-delivery`) for
  `--report` in `src/publish.ts` and its tests, red first (dl-018); `pack-release-cycle` › `publish`
  and `pack-cycle` › `activate` naming who runs what, as P1 and P2 say, in one version bump; an
  Execution Note on the row "The engine way of working", which keeps the permanent rule.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
