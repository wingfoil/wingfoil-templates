---
id: plan-087-pack-cycle-first-release-governance-wingfoil-dogfood-1.0.0
type: plan
title: "pack-cycle first-release: governance/wingfoil-dogfood 1.0.0"
status: draft
workflow: "pack-cycle"
phase: "first-release"
tags: ["packs","dogfood","governance","W10"]
---

## Context

The `first-release` phase of `pack-cycle` (v8) for `pack-governance-wingfoil-dogfood`, `accepted`
under plan-085 and authored on `main` by plan-086 (done on 2026-11-24). This plan publishes
`governance/wingfoil-dogfood` 1.0.0 through `pack-release-cycle` (v9: `prepare`, `validate`,
`approve-publication`, `publish`) with its `pack-release`, prel-008, then runs `pack-cycle` ›
`activate` (`accepted → active`) at the first tag (dl-033 O1). The `retrospective` follows
`activate`, and its form is ruled here (dl-033 O2). plan-077 (`governance/feedback` 1.0.0) is the
model.

W10's order (`docs/01_vision/07_sequencer.md`) puts this release before the pack release round,
this repository's adoption and the periodic retrospective, which are later plans.

**Preconditions, met.**
- `packs/governance/wingfoil-dogfood` is on `main`, `version: 1.0.0`, its `CHANGELOG.md` holding a
  `1.0.0` entry; `pack.yaml` format 2, no entry. It requires `base@^2` (2.0.1 published) and
  `governance/feedback@^1` (1.0.0 published), and `requires_capabilities: []`.
- The exit criterion is met but for what this phase owes (plan-086's close, the charter's note of
  2026-11-24): WD-1 … WD-7; `check:runs` 92 runs with `wingfoil-dogfood.yaml` and
  `adoption-wingfoil-dogfood.yaml`, the adoption once per `init` template (dl-032 E3); no run by
  hand (the charter: no dl-032 E4). CB-1 … CB-3 and CB-6 are the first tag's.
- `compat.yaml` lists 0.2.2 … 0.3.2. The pack's matrix is 0.3.0 … 0.3.2 (it composes
  `governance/feedback`, which requires `workflow-engine`); the matrix selects 0.3.0 and 0.3.2. The
  published range's floor 0.3.0 comes from `format_key` (`src/range.ts`: 0.2.2 reads no format
  key), the pack's own `requires_capabilities` being empty.
- spec-001, spec-002 and spec-003 hold no open erratum: plan-086 recorded none (dl-020).

**`main`'s CI before this plan** (`repository-practice` rule 3): the push of `5ca10d55`
(plan-086's close), read and recorded in the Execution Notes before `submit`.

**Reads made for this outline** (2026-11-24, `main` at `5ca10d55`):
- **The dry run** (`npm run publish:pack -- --pack governance/wingfoil-dogfood --dry-run`, in a
  scratch clone of `main` with its remote removed, on Node.js 22.21.0 after `npm ci` and the build,
  nothing pushed): exit 0; the publication matrix 32 runs, 0 failed, `tolerance applied: none`;
  the range `>=0.3.0 <=0.3.2`; the digest
  `sha256:fe0b2389f27df10d7d5654e3d42ee3e2263198c9f237028b35056b92eed6ed90`, superseded by
  point 2's commit: the rehearsal's and the Validation's dry runs are the comparison base
  (dl-044 P1).
- **The tag's annotation is truncated.** `src/publish.ts` annotates the tag with the first line of
  `CHANGELOG.md` that starts with `- 1.0.0`, alone. Today's entry wraps mid-sentence, so the
  annotation would read "- 1.0.0: first version: the channel that turns a feedback item routed to
  `upstream:wingfoil` into a". task-104's criterion 6 asked for a first line that is a whole
  sentence; no review caught the wrap, and the task closed `done`. The owed row "A check of
  the CHANGELOG's first line" (trigger: the next `publish:pack` change) names this risk.
- **The first published pack with no workflow** and `requires_capabilities: []`; the first besides
  `base` with a required parameter with no default (`wingfoil_command`); the second from a format-2
  manifest.
- **WingFoil's newest release** is 0.3.2 (npm `latest`); `intake.yml`'s last scheduled run
  (2026-11-24) is `success`.
- **No owed row falls due** at this pack's `first-release`; the pack has no exit overlay, so the
  intake's `verify` job needs no new step (its `validate` composes the README examples).
- **`pack-release-cycle` v9** already holds dl-044 P1 and P2: the approver runs `publish:pack
  --report <path>` and the atomic push; the agent pushes the approval commit, reads the report into
  the Publication and checks its digest and range against the Validation's dry run. `pack-cycle`
  v8's `activate` has the approver run its `memory submit` and push.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation, or is proposed as written.

1. **Version and range.** `1.0.0`, class `major`: a first version (`pack-semver`). `pack.yaml`
   stays as it is. `publish:pack` computes the range from `compat.yaml`: today `>=0.3.0 <=0.3.2`.
   If a newer WingFoil is published before `publish`, the approver is asked. *Recommended then:*
   publish on the releases `compat.yaml` lists, and let its intake extend the range.
   *Alternative:* the intake first, this plan waiting.

2. **The CHANGELOG's first line, at `prepare`** (Reads). `pack-release-cycle` › `prepare` writes
   the `CHANGELOG.md` entry. *Recommended:* `prepare` rewrites the entry so that its first line is
   a whole sentence within 100 characters (for example "- 1.0.0: first version: the channel back
   to WingFoil and the rules of the pinned WingFoil CLI."), the rest of the entry on the lines
   after it; a commit under `packs/` on `main`, before the rehearsal, so the digest the rehearsal
   and the Validation record is the published one. A dated note on task-104 records the unmet
   criterion, found after its close, and its fix here. The owed row stays open, its Source citing
   plan-087 point 2 as the risk met: this plan changes no `publish:pack` code. *Alternative:* a
   tooling task first, a check of the first line in `publish:pack` (the row's own fix), which
   delays the release by a task.

3. **A rehearsal before `prepare`'s `submit`,** right after point 2's commit, before prel-008
   moves. *Recommended:* in a scratch clone of
   `main`, nothing pushed: `npm run publish:pack -- --pack governance/wingfoil-dogfood` for real,
   then `npm test`, `check:schemas`, `check:packs`, `index -- --check`, `validate` and `check:runs`
   on the result, and the tag's annotation read (`git tag -n99`). It matters for a pack with no
   workflow and an empty capability list in the index (`catalog-index.json`, `CATALOG.md`), the
   first such entry. A failure caused by the new entry becomes a tooling task before any element
   moves. *Alternative:* the dry run at `validate` only.

4. **The Validation evidence** (`pack-release-cycle` › `validate`, `pack-compatibility`, dl-032
   E3), recorded in prel-008 with commands and exit codes:
   - `npm run validate:publication -- --evidence`: both README examples on 0.3.0 and 0.3.2, each
     composition twice byte-identical (CB-2, the examples as fixtures). The Validation states that
     no preset holds the pack, so its documented combinations are its two README examples (the
     `validate` post-check). The pack has no entry; the output line `matrix
     tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml[+software]: skipped, no
     methodology` is explained in prel-008;
   - `npm run check:runs` on the same two releases, naming the runs of `wingfoil-dogfood.yaml` and
     `adoption-wingfoil-dogfood.yaml` (dl-032 E3's adoption run, once per `init` template);
   - the overlays `software-exit`, `scrum-exit`, `kanban-exit` and `feedback-exit`, and the golden
     step;
   - no run by hand: the charter asks for none (no `release`, no `delivery`);
   - `npm run publish:pack -- --pack governance/wingfoil-dogfood --dry-run` in a temporary clone of
     the submitted head: the tag, the range and the digest;
   - the clean-clone checks on Node.js 22.21.0, then 22.12.0, one after the other: `npm ci`,
     `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
     `validate`, the overlays, the golden step, `workflow list`, `check:runs`, and `npm audit` in
     the root and in every matrix folder; `check:packs`' README rules are CB-1's evidence, the
     README's "Install and update" against `compat.yaml` CB-3's;
   - `main`'s CI on the submitted head, and the privacy check of the element and of the pack's
     files.

   An independent review of prel-008 (dl-017), its findings fixed, then `validating → releasing`.

5. **The private projects' check.** *Recommended:* none: the pack is optional, no private project
   composes it, and its release changes nothing they compose. prel-008 says so; the owed row "The
   private projects' check scripted" stays untriggered. *Alternative:* the check run outside this
   repository before `approve-publication`.

6. **Who runs what,** as `pack-release-cycle` v9 and `pack-cycle` v8 say, proposed as written: the
   approver approves prel-008, runs `publish:pack` with `--report` (its path outside the
   repository) and the atomic push, and runs the activation's `memory submit` and its push; the
   agent pushes the approval commit and reads `main`'s CI before it hands over the publication's
   commands, reads the report into the Publication and checks its digest and range against the
   Validation's dry run (a difference stops the record and goes to the approver), commits the
   charter's note before the activation, and reads every CI. Every other commit on `main` (point
   2's, prel-008's, this plan's notes) is the agent's, pushed by the approver, as today. The
   agent's runs in a scratch clone, nothing pushed (points 3 and 4), stay the agent's.

7. **`publish` and CB-6's live part,** proposed as written. On Node.js 22.21.0, a clean tree, HEAD
   the approval's commit, `main`'s CI `success`: `npm ci`, `npm run build`, `npm run publish:pack
   -- --pack governance/wingfoil-dogfood --report <path>`, and `git push --atomic origin
   governance/wingfoil-dogfood@1.0.0 main`. The CI on the tag (publication mode), on `main` and
   Pages read. CB-6's live check as prel-007's: `llms.txt` answers 200; `catalog-index.json` (raw
   and Pages), filtered to `governance/wingfoil-dogfood`, shows `status: active`, `latest: 1.0.0`
   and the range, and the version's `readme_url` and `manifest_url` at the tag each answer 200,
   recorded in prel-008's Publication. A failure there is a bug fixed forward: a published tag never
   moves.

8. **`activate`** right after the push: `pack-governance-wingfoil-dogfood` `accepted → active` once
   `pack-cycle` › `activate`'s two checks hold, its Execution Note recording the version, the tag,
   the catalog commit, and CB-1, CB-2, CB-3 and CB-6 at the first tag.

9. **The retrospective** (dl-033 O1, O2), after `activate`. *Recommended:* the pack's own
   `pack-cycle` retrospective in the plan right after this one, covering plan-082 … this plan
   (from `pack-ingest`'s capture to the activation), as `governance/feedback`'s was (plan-078); its
   row added to `docs/owed-items.md` in the commit that records the ruling (`repository-practice`
   rule 4). *Alternative:* held as W10's periodic retrospective at the wave's end (dl-033 O2's
   last sentence, `pack-cycle` v8); O2 speaks of several packs whose cycles ran together, and this
   pack's is the only one, so this reading departs from dl-033 and needs an Execution Note on
   dl-033 and dl-006, as plan-077 point 10 said; the phase would stay open across the pack release
   round and the adoption.

10. **No notice and no feedback note.** No project has adopted the pack; this repository's adoption
    is its first user. No note to WingFoil for the publication (dl-021 R1, the charter).

11. **Nothing else ships.** No release of `base`, `software` or `governance/feedback`, no
    decision-log and no tech-spec change. Reserved for this plan: prel-008; for a finding only:
    task-106, dl-052, bug-017, F-053. Unused numbers are released at the close.

## The approver's rulings

<!-- Recorded before `submit`. -->

## Steps

Before every commit, the privacy check and `check:texts` (`repository-practice` rules 2, 5). After
every push to `main`, its CI is read (rule 3). Files are staged by name. The release work runs on
`main`, as plan-077's.

1. **This plan** (product-owner): an independent review (dl-017), amended; the outline ruled by the
   approver; submitted (`draft → active`).
2. **`prepare`, the entry** (tech-lead): point 2's `CHANGELOG.md` entry, task-104's note and the
   owed row's Source, in their own commit on `main`.
3. **The rehearsal** (point 3, if ruled), on `main` with point 2's commit, recorded here. A failure:
   a tooling task first, before prel-008 is added.
4. **`prepare`, the element** (tech-lead): prel-008 added, its fields and Changes written; the
   README's "Install and update" checked against `compat.yaml` (CB-3: the temporary mark kept,
   since no release provides `pack-install`); an independent review; `draft → validating`.
5. **`validate`** (reviewer): the evidence of point 4 on the submitted head, recorded in prel-008,
   reviewed independently, `validating → releasing`; `main` pushed by the approver and its CI read.
6. **`approve-publication`:** the approver approves prel-008 (`releasing → released`), which
   authorizes the tag, or rejects it back to `validating`. No tag and no tag push before it. The
   agent pushes the approval's commit and reads `main`'s CI (dl-044 P2).
7. **`publish`** (point 7), the approver running `publish:pack --report` and the atomic push; the
   agent reads the report, the CI and Pages, runs CB-6's live check, and writes prel-008's
   Publication.
8. **`activate`** (point 8): the charter's note committed first, then the approver's `memory
   submit` and its push; the agent reads the CI.
9. **Close:** the account per tech-spec (dl-020); the owed rows; the reserved numbers released; the
   privacy checks recorded; the retrospective's plan named (point 9); `active → done`.

**Not in this plan:** the retrospective itself; the pack release round; this repository's adoption,
its WingFoil pin and its inbox sync; the sequencer's stale W10 state row (its owed row).

## Handoff

- **Agent:** product-owner of this plan's draft, tech-lead of `prepare` and the rehearsal; it runs
  the `validate` evidence, pushes the approval's commit, hands the approver the commands of
  `publish:pack`, the atomic push and the activation, reads the report and every CI. It never runs
  `memory approve` or `memory reject`. No pull request. No tag and no tag push before the
  approver's approval of prel-008.
- **Reviewer:** an independent subagent for this plan, prel-008 at `prepare` and at `validate`, and
  the close (dl-017).
- **The approver** rules this outline, approves prel-008, runs `publish:pack --report`, the atomic
  push, and the activation's `memory submit` and its push.
- **Done when** `governance/wingfoil-dogfood@1.0.0` is tagged and pushed, `catalog.yaml` on `main`
  lists it with the CI `success` on the tag, on `main` and on Pages, CB-6's live check is recorded,
  prel-008 is `released` with its Validation and Publication, the charter is `active`, and the
  retrospective's plan is named.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-24: independent review of the outline (dl-017, `c3821d0b`): approve after amendments;
  no blocker, four should-fix (task-104's miss stated as an unmet criterion, no review having
  claimed it, and recorded by a dated note, not under rule 6; the "required parameter" claim
  corrected, `base` having four; the rehearsal moved before prel-008 moves, Steps 2 … 4 split; the
  retrospective's alternative cited to dl-033 O2 and marked a departure) and five nits (the dry
  run's digest superseded by point 2; the range's floor from `format_key`; CB-1 … CB-3's evidence
  named; the Validation's "no preset" line; who pushes `main`), all applied in the commit that
  records this note, with the owed row's Source to cite point 2. The review verified the Reads'
  other claims and the reserved numbers free on every branch.
- 2026-11-24: no re-review: the amendments correct facts and citations and split Step 2 so that the
  rehearsal precedes prel-008's `submit`, as point 3 already said ("before any element moves");
  no recommendation or ruling changes.
