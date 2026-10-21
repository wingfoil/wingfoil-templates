---
id: plan-044-pack-cycle-first-release-base-1.0.0
type: plan
title: "pack-cycle first-release: base 1.0.0"
status: active
workflow: "pack-cycle"
phase: "first-release"
tags: ["packs","base","W8","W9"]
---

## Context

The `first-release` phase of `pack-cycle` for `pack-foundation-base`: its `author` phase is done
(plan-043), and `packs/base` on `main` composes and validates on WingFoil 0.3.0 with the README's
three examples, the exit criterion met (task-039). This is the first version this repository
publishes: `catalog.yaml` lists no pack and no tag exists. WingFoil UI waits for the tag to adopt
`base` before its own v0.3 planning, and WingFoil plans to adopt the foundation packs at its patch
v0.3.1. `base` is published on its own, without waiting for `software` (plan-043, ruling 5).

**Preconditions, met.** The charter is `accepted` (plan-041); `compat.yaml` lists WingFoil 0.3.0
with `workflow-engine`, which `base` requires, so the computed range is not empty (spec-001 §12);
the matrix runs 0.3.0 (plan-042). Only 0.3.0 is compatible, so the oldest and the newest release
of the matrix are the same one, and the computed range is exactly `0.3.0`: WingFoil 0.3.1 enters
it when a `wingfoil-release-intake` of 0.3.1 adds it to `compat.yaml` and recomputes the
`wingfoil` field of every published version (spec-001 §12). spec-001 and spec-002 hold no open
erratum but §8.3's `{release}` note, folded back at W8's close.

**Not yet met: the test suite after the catalog entry.** A simulated catalog commit (the tag and
the entry written as `publish:pack` writes them, on a scratch clone) fails 91 of 937 tests: many
tests take this repository's `catalog.yaml` as their base and expect `packs: []`, or copy the tree
without its tags. `publish:pack` runs no test, and the tag's own CI passes (its commit still lists
no pack), so `main`'s CI would fail only after the push. task-040 fixes it before `publish`.

**The approver's rulings** (2026-10-21, in chat, as recommended):
- **A.** `npm run publish:pack`, and its dry run, refuse a working tree that is not clean, and
  `.idea/` stays untracked: it will be listed in `.git/info/exclude`, a local rule that is not
  committed (step 3).
- **B.** The charter goes `accepted → active` right after the tag (`activate`), since the pack is
  then published and listed. `pack-cycle`'s `retrospective`, which dl-006 R1 and `pack-cycle`
  place before `activate`, runs once for both foundation packs at the close of their cycle, after
  `software`'s `first-release`, as their charters ran in one plan (plan-041). The deviation is
  recorded here and in dl-006's Execution Notes.
- **C.** The approver's `approve` of the pack-release authorizes the publication: the tag and its
  push follow it with no further confirmation.
- **D.** Feedback note F-032 and the `template.frontmatter` rule (lint or spec) are not in this
  plan; each is its own task after the tag, before `software`'s `author`.
- **E.** Task-040, through `tooling-delivery` and inside this plan, before `publish`: the tests
  that depend on this repository's `catalog.yaml` or its tags move to a fixture catalog (dl-018
  R1–R3, red first). Its acceptance: the whole suite passes on a scratch clone after a simulated
  catalog commit listing `base@1.0.0`, and on `main` as it is.
- **F.** A first version's `bump` is `major`: the field takes `major`, `minor` or `patch`, and
  `pack-semver` has no rule for a first version, so the highest class, as it asks when in doubt.
  The gap in `pack-semver` is a follow-up.

**What it produces.** Task-040; the pack-release element `prel-1-…` (`pack: pack-foundation-base`,
`version: 1.0.0`, `bump: major`, `line: current`, `wingfoil` the range computed from
`compat.yaml`); the annotated tag `base@1.0.0` at the release commit (dl-004); then one commit with
`catalog.yaml`'s `base` entry (version, commit, digest, formats, capabilities, computed range) and
the regenerated `CATALOG.md` and `catalog-index.json` (spec-001 §11, spec-002 §3). No file under
`packs/` changes: `CHANGELOG.md` already reads `1.0.0: first version.` and `pack.yaml`
`version: 1.0.0`, which `prepare` confirms.

Who runs what: claude drafts for the product-owner (`plan`), acts as tech-lead (`prepare`,
`publish`) and as developer for task-040; the reviewer is an independent subagent (dl-017), never
the author's context; claude never runs `memory approve` or `reject` and hands the approver the
command.

Not in this plan: `software`'s `author`; the foundation packs' `retrospective` (B); this
repository's adoption of `base` (W9); spec-001 §8.3's fold-back; the `pack-release` type's comment
that calls `released` "tag pushed", which the approval reaches before `publish` (a follow-up).

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, re-reviewed after
   rulings E and F, then submitted (`draft → active`).
2. **Task-040** through `tooling-delivery`: its body reviewed and accepted into the backlog, its
   Design on `main`, the build on `task/<task id>` red first, an independent review, the CI's
   conclusion, the approver's acceptance and merge OK, `done`.
3. **`prepare`** (tech-lead, on `main`): `.idea/` listed in `.git/info/exclude` (ruling A);
   `memory add --type pack-release`, its `pack`, `version`, `bump`, `wingfoil` and `line` filled
   by editing the draft (W-02); its Changes section: the first version, with the tasks it ships
   (task-037, task-038, task-039; `traceability`); `CHANGELOG.md` and `pack.yaml`'s `version`
   confirmed; the README's "Install and update" section checked against `compat.yaml` (spec-002
   §2.3, CB-3); the element committed and submitted (`draft → validating`).
4. **`validate`** (reviewer): `npm run validate:publication -- --evidence` on the README's three
   examples, WingFoil 0.3.0 as the oldest and newest release, no warning, two compositions
   byte-identical; its `## Validation` section copied into the element; the checks of plan-043
   from clean clones on Node.js 22.21 and 22.12.0; `npm run publish:pack -- --pack base --dry-run`
   on the committed element; the privacy check on the element (no local path, no private
   repository, nothing on the private projects beyond their number). An independent review of
   the pack-release, its findings fixed, then `validating → releasing`; `main` pushed.
5. **`approve-publication`** (approver): `memory approve prel-1-…` (`releasing → released`), or a
   rejection back to `validating`. Ruling C: it authorizes the publication.
6. **`publish`** (tech-lead): first `npm run build`, a clean tree, HEAD the approval's commit,
   pushed by claude after the approval, with `main`'s CI `success` on it (the tag's CI does not
   run the self-test). Then
   `npm run publish:pack -- --pack base`, which tags `base@1.0.0` at HEAD and makes the catalog
   commit with `CATALOG.md` and `catalog-index.json`, pushing nothing; the tag and `main` pushed
   together (`git push --atomic origin base@1.0.0 main`), since `main`'s lint and Pages need the
   tag. The CI runs on the tag (`**@*`, publication mode) and on `main` and the Pages deploy read,
   their conclusions recorded in the element's Publication section with the tag, the commit and
   the digest. Then CB-6's live check (spec-002 §6): an anonymous fetch from the published
   `llms.txt` to `catalog-index.json`, its filter to `base`, then `base`'s `README.md` and
   `pack.yaml` at `refs/tags/base@1.0.0`, each URL and HTTP code recorded in the Publication
   section.
7. **`activate`** (ruling B): the charter `accepted → active`, its Execution Notes recording the
   published version; dl-006's Execution Notes record the deviation.
8. **Notices**: the tag, the publication date and the range (`0.3.0` only, 0.3.1 after its
   intake) to WingFoil UI's session and to the coordinating session.
9. **Close:** this plan's Execution Notes record the release; `active → done`.

## Handoff

- **claude:** every step but the approver's gates.
- **Approver:** task-040's backlog acceptance, its acceptance after the build and its merge OK; the
  pack-release's approval (step 5), which authorizes the tag (ruling C). The charter's
  `accepted → active` has no gate (`pack`'s machine gates `proposed` only).
- Done when `base@1.0.0` is tagged and pushed, `catalog.yaml` lists `base` on `main` with the CI
  `success` on the tag and on `main`, CB-6's live check recorded, the charter `active`, and the
  notices sent.

## Execution Notes

- 2026-10-21: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to the outline in chat; rulings A–D as recommended.
- 2026-10-21: independent review: request changes. The catalog commit would fail `main`'s CI (a
  simulated one fails 91 tests), CB-6's live check was missing, ruling A stated an exclusion not
  yet made. The approver ruled E (task-040 before `publish`) and F (`bump: major`); the rest
  applied: the element's fields filled by editing, its tasks listed, the checks before
  `publish:pack`, the atomic push, the range's meaning for 0.3.1, ruling B recorded in dl-006,
  the two files `publish:pack` writes. Re-review requested.
- 2026-10-21: re-review: approve after amendments. Applied: the range recomputed by the intake of
  0.3.1 (spec-001 §12); the approval's commit pushed by claude. Plan submitted.
