---
id: task-030-feedback-note-f-030-selecting-a-preset-at-init-pinned-like-the-default-set-and-the-presets-module-of-dna.yaml
type: task
title: "Feedback note F-030, selecting a preset at init pinned like the default set, and the presets module of dna.yaml"
status: draft
pack: ""            # no pack: the feedback inbox (hosted by plan-036, tooling-delivery)
depends_on: []
tags: ["feedback","wingfoil"]
---

## Context

The approver's ruling of 2026-10-14 (plan-036): a feedback note that refines F-006's
`wingfoil init --preset <name>` in the light of dl-021 R1 and F-027, and the `presets` module of
`.wingfoil/dna.yaml` reworded. Hosted by plan-036. As task-026 … task-029, on the approver's rule
that a plan's work stays on its branch, it runs on `feedback/f-030-preset`, not on `task/<id>`: its
`done` commit lands there and its `deliver` is that branch's merge. No pack.

It comes from:
- the `presets` module of `dna.yaml`: "Named, curated pack combinations selectable with `wingfoil
  init --preset`"; WingFoil 0.2.2 refuses the option;
- F-006 (open): `wingfoil init --preset <name>` or one flag per axis, written before dl-021;
- dl-021 R1 and F-027: packs are installed from this repository by WingFoil's `pack-install` as a
  pinned `remote` source; the default set at `init` is resolved through a catalog commit each
  WingFoil release pins (option (b), recommended by WingFoil's approver, relayed on 2026-10-13);
- spec-001 §11 and §15: `catalog.yaml` › `presets` and `presets/<id>.yaml` define a preset's
  format (today `presets: []`).

Kind: `request`, as F-027 … F-029 (WingFoil plans no such option yet).

spec-001 §15 says presets are "selectable with `wingfoil init --preset <id>`": an erratum of an
approved tech-spec, recorded in spec-001's Execution Notes by this task (dl-020 R1) and folded back
by its next amendment (dl-020 R2).

Not in scope: F-006, which stays as written (status changes only by the sync, `wingfoil-cli`
rule 6); any other `dna.yaml` module; `schema/`, `catalog.yaml` and `compat.yaml`.

## Acceptance

Run from a clean clone of `feedback/f-030-preset`; Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` exit 0; no dependency is added.
2. **The note** `F-030-<slug>.md`, numbered without a gap, in the inbox format (README › Rules,
   WingFoil dl-163 R4): `kind: request`, `status: open`, `wingfoil_version: 0.2.2`,
   `answered_by: []`; the first line "New note (task-030)." followed by its origin (plan-036,
   dl-021 R1) and "refines F-006's `--preset` request"; an `## Observed` with only WingFoil 0.2.2's
   output, reproduced from npm in a scratch project (`git init`; `wingfoil init --help`;
   `wingfoil init --preset startup-mvp` printing `unknown option '--preset'`, exit 2, nothing
   written), paths neutral or elided; an `## Expected` stating
   the request, pending WingFoil's v0.4 release-planning and not a commitment, as input for
   WingFoil dl-138's Action 2 tech-spec and dl-164: `init` selects a preset of this repository's
   catalog by id and resolves it like the default set of F-027, inheriting its rule (the catalog
   commit the WingFoil release pins, unless a source or version is given); an explicit preset
   replaces the default set (presented to the approver with the ruling of plan-036).
3. **Ledger:** a row for F-030, as the note says.
4. **`dna.yaml`** (`version` 8 → 9): the `presets` module reads "Named, curated pack combinations,
   selectable at `init` once WingFoil supports it (F-030)."; nothing else in the file changes;
   `npm run -s wingfoil -- dna show` exits 0 with no warning.
5. `git diff --exit-code origin/main...HEAD -- schema/ catalog.yaml compat.yaml` exits 0.
6. **spec-001:** an Execution Note records the §15 erratum; its body does not change.
7. **Nothing else changes:** besides this element and plan-036's own commits, `git diff
   --name-only` over the task's commits (listed in the Execution Notes) shows only
   `docs/wingfoil-feedback/F-030-*.md`, `docs/wingfoil-feedback/README.md`, `.wingfoil/dna.yaml`
   and spec-001.
8. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

Filled at the start of the work.

## Execution Notes
