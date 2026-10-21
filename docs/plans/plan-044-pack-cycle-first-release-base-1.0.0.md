---
id: plan-044-pack-cycle-first-release-base-1.0.0
type: plan
title: "pack-cycle first-release: base 1.0.0"
status: draft
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
the matrix runs 0.3.0 (plan-042); `main`'s CI on `f6b6a8a` is `success`. Only 0.3.0 is
compatible, so the oldest and the newest release of the matrix are the same one. spec-001 and
spec-002 hold no open erratum but §8.3's `{release}` note, folded back at W8's close.

**The approver's rulings** (2026-10-21, the outline approved in chat, as recommended):
- **A.** `npm run publish:pack` refuses a working tree that is not clean, and `.idea/` stays
  untracked: it is listed in `.git/info/exclude`, a local rule that is not committed.
- **B.** The charter goes `accepted → active` right after the tag (`activate`), since the pack is
  then published and listed. `pack-cycle`'s `retrospective`, which comes before `activate`, runs
  once for both foundation packs at W8's close, after `software`'s `first-release`, as their
  charters ran in one plan (plan-041). The deviation from the phase order is recorded here.
- **C.** The approver's `approve` of the pack-release authorizes the publication: the tag and its
  push follow it with no further confirmation.
- **D.** Feedback note F-032 and the `template.frontmatter` rule (lint or spec) are not in this
  plan; each is its own task after the tag, before `software`'s `author`.

**What it produces.** The pack-release element `prel-1-…` (`pack: pack-foundation-base`,
`version: 1.0.0`, its range computed from `compat.yaml`), the annotated tag `base@1.0.0` at the
release commit (dl-004), then one commit with `catalog.yaml`'s `base` entry (version, commit,
digest, formats, capabilities, computed range) and the index files `npm run index` regenerates
for it (spec-001 §11, spec-002 §3). No file under `packs/` changes:
`CHANGELOG.md` already reads `1.0.0: first version.` and `pack.yaml` `version: 1.0.0`, which
`prepare` confirms.

Who runs what: claude drafts for the product-owner (`plan`) and acts as tech-lead (`prepare`,
`publish`); the reviewer is an independent subagent (dl-017), never the author's context; claude
never runs `memory approve` or `reject` and hands the approver the command.

Not in this plan: `software`'s `author`; the foundation packs' `retrospective` (B); this
repository's adoption of `base` (W9); spec-001 §8.3's fold-back.

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **`prepare`** (tech-lead, on `main`): `memory add --type pack-release` with `pack`, `version`,
   `bump` and the range computed from `compat.yaml`; its Changes section (the first version, from
   the charter's Ships); `CHANGELOG.md` and `pack.yaml`'s `version` confirmed; the README's
   "Install and update" section checked against `compat.yaml` (spec-002 §2.3, CB-3); the element
   submitted (`draft → validating`).
3. **`validate`** (reviewer): `npm run validate:publication -- --evidence` on the README's three
   examples, WingFoil 0.3.0 as the oldest and newest release, no warning, two compositions
   byte-identical; its `## Validation` section copied into the element; the checks of plan-043
   from clean clones on Node.js 22.21 and 22.12.0; `npm run publish:pack -- --pack base --dry-run`;
   the privacy grep of plan-041. An independent review of the pack-release, its findings fixed,
   then `validating → releasing`.
4. **`approve-publication`** (approver): `memory approve prel-1-…` (`releasing → released`), or a
   rejection back to `validating`. Ruling C: it authorizes the publication.
5. **`publish`** (tech-lead): `npm run publish:pack -- --pack base`, which tags `base@1.0.0` at the
   release commit and makes the catalog commit with the regenerated index, pushing nothing; the
   tag and `main` pushed by hand; the CI run on the tag (`**@*`, publication mode) and on `main`
   read, their conclusions recorded in the element's Publication section with the tag, the commit
   and the digest; the catalog checked on the published site.
6. **`activate`** (ruling B): the charter `accepted → active`, its Execution Notes recording the
   published version.
7. **Notices**: the publication date and the tag to WingFoil UI's session and to the coordinating
   session.
8. **Close:** this plan's Execution Notes record the release; `active → done`.

## Handoff

- **claude:** steps 1–3 and 5–8, except the approver's gates.
- **Approver:** the pack-release's approval (step 4), which authorizes the tag (ruling C). The
  charter's `accepted → active` has no gate (`pack`'s machine gates `proposed` only).
- Done when `base@1.0.0` is tagged and pushed, `catalog.yaml` lists `base` on `main` with the CI
  `success` on the tag and on `main`, the charter is `active`, and the notices are sent.

## Execution Notes

- 2026-10-21: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to the outline in chat; rulings A–D as recommended.
