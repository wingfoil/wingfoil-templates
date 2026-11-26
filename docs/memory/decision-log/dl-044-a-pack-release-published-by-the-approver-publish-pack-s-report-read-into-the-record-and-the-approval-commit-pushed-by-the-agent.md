---
id: dl-044-a-pack-release-published-by-the-approver-publish-pack-s-report-read-into-the-record-and-the-approval-commit-pushed-by-the-agent
type: decision-log
title: "A pack-release published by the approver: publish:pack's report read into the record, and the approval commit pushed by the agent"
status: approved
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
  validation's lines and the publication matrix's summary, the line, the tag and its commit, the
  catalog commit, the digest, the transitions' digests, the range, "Not pushed") to that file, on
  a non-zero exit too, so a failure's reason reaches the record; it refuses a path inside the
  repository. The commands handed to the approver include it; the agent reads the file, records
  those values in the Publication, and checks the digest and the range against `publish:pack
  --dry-run` as the Validation recorded it. A missing or different value stops the agent's record
  and goes to the approver before CB-6 is read.
- **P2 — The approval commit.** When the approver approves a pack-release (`releasing →
  released`), the agent pushes that commit and reads `main`'s CI on it, before it hands over the
  publication's commands. A push makes no commit or tag: the commit is the approver's, made by the
  approver's command, so the rule "an agent never runs a command whose commit or tag carries the
  approver's identity" holds. The activation's push stays the approver's, because it follows the
  approver's `memory submit` in the same hand-over and carries the agent's earlier commits with it
  (plan-077 ruling 7). Once applied, ruling 7's split (the approver runs `publish:pack`, the atomic
  push, the activation's `memory submit` and its push) stands for every pack-release, ahead of the
  adoption (W10).
- **P3 — Applied after approval** by a dl actions plan: a tooling task (`tooling-delivery`) for
  `--report` in `src/publish.ts` and its tests, red first (dl-018); `pack-release-cycle` 8 → 9
  (`approve-publication`: the agent pushes the approval commit and reads `main`'s CI, no tag;
  `publish`: who runs what, as P1 says) and `pack-cycle` 7 → 8 (`activate`: who runs what); the
  row "The engine way of working" extended (its Source with dl-044), its "in his own shell" made
  "in the approver's own shell" in the same edit.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
- 2026-11-21: independent review: approve after amendments; three should-fix (`approve-publication`
  in P3 and the bumps named; the row extended, not noted; P2 argued against the row and ruling 7)
  and one nit (the report on a failure, its values, the dry run named), all applied.
- 2026-11-21: re-review: approve; one nit (the shared bumps), covered by dl-043 D3.
- 2026-11-23, plan-081: actions applied (P3): `publish:pack --report` by task-103, merged into
  plan-081's branch (`7a38f98e`), `approved` until its check on `main`; `pack-release-cycle` 9
  (`fb612206`); `pack-cycle` 8 › `activate` and the row "The engine way of working" extended and
  reworded (`0735c631`); the row "dl-044's actions" closed there.
- 2026-11-25, plan-087 (step 6): P2 not applied at prel-008: the agent's push of `main` with the
  approval's commit was not permitted in its environment, and the approver pushed it; P1 applied
  (`publish:pack --report`, read into prel-008's Publication). Whether P2 stands is the owed row
  "dl-044 P2 … not applied at prel-008" (`docs/owed-items.md`).
- 2026-11-26, plan-088 (close): P2 changed, not kept: dl-053 (approved 2026-11-26) replaces P2's
  first two sentences; the approver pushes a pack-release's approval commit and the agent reads
  `main`'s CI on it before handing over the publication's commands; the rest of P2 stands (dl-053
  P1, dl-052 C1, D2). The row "dl-044 P2 … not applied at prel-008" moved to Closed; the
  application is dl-053's actions (its row), recorded here by its own note.
- 2026-11-26, plan-089: dl-053's change applied: `pack-release-cycle` 10 › `approve-publication`
  (`3b844617`), the approver pushing the approval commit and the agent reading `main`'s CI on it;
  P2's first two sentences replaced there, the rest of P2 standing; the row "The engine way of
  working" reworded and its Source extended with dl-053 (plan-089 row 3).
