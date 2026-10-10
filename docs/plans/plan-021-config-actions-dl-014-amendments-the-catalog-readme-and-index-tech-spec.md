---
id: plan-021-config-actions-dl-014-amendments-the-catalog-readme-and-index-tech-spec
type: plan
title: "config actions: dl-014 amendments, the catalog README and index tech-spec"
status: draft
workflow: "sw-life-cycle"
phase: "tooling"
tags: ["config"]
---

## Context

The follow-up plan of plan-020 that dl-014 D6 names: the documents and configuration that dl-014
(a browsable catalog, `approved` on 2026-10-09) implies, applied by the session that drives `main`.
Like plan-011 and plan-018, no workflow phase hosts this work: the changes are actions of an
approved element.

Scheduling, as the approver ruled on 2026-10-10: dl-014 is carried out as it is written. This plan
applies D6 now; plan-015 then goes on (task 10, CI; wave W7); the tooling tasks of D7 (wave W14,
F2.8 and F2.9) open through `tooling-change` once plan-015 is `done`. Nothing here is a tooling task:
no code, no fixture, no generated file.

Sources, all `approved`: dl-014 D1–D7 (with the proposals the approver did not restate at the
ruling: option (b) then (c); wave id W14; `npm run index`, `CATALOG.md`, `catalog-index.json`,
`llms.txt`, `index/catalog-index.schema.json`); spec-001 §6.1, §11–§13, §18; the vision documents
`03_is-isnot.md`, `06_features.md`, `07_sequencer.md`, `08_mvp-canvas.md`.

Not in this plan: the tooling tasks T1–T7 of D7; enabling GitHub Pages (the approver's action, after
CI); README content of any pack (each pack's own tasks); the live check of CB-6 (`base`'s first
`pack-release`, W9).

## Steps

All work happens on branch `config/dl-014-amendments`, one commit per step. Every changed file with
a `version:` key, and every vision document with a **Version** line, is bumped once
(`doc-versioning`).

1. **The tech-spec** "Pack README and catalog index" (`memory add --type tech-spec`): D1 (the
   README standard, its nine sections and which are generated), D2 (the index command and its
   outputs, with field sources and determinism), D3 (the agent URL patterns), D4 (the search page and
   its security rules), the acceptance criteria CB-1…CB-8, and the statement that it supersedes
   spec-001 §6.1's README line. Written by `claude`, reviewed by an independent context, submitted
   for the approver's ruling. spec-001 is `approved` and is not edited: its Execution Notes gain a
   line citing the new spec.
2. **`pack-authoring`:** the README rule (D1, the new tech-spec) and the examples-are-fixtures rule
   (CB-2). Directives carry no `version:` key.
3. **Vision documents:**
   - `06_features.md`: **F2.8** "Browsable catalog: README standard, generated `CATALOG.md`,
     `catalog-index.json`, `llms.txt`" (J1.1, J6.1, J7.1; H, M, L) and **F2.9** "Catalog search page
     on GitHub Pages" (J6.1; M, M, L); F6.1 points to README section 3;
   - `07_sequencer.md`: wave **W14** in M1, after W7, with F2.8 and F2.9, ending with "a fixture
     catalog is browsable in `CATALOG.md`, `catalog-index.json` and a search page built in the
     tests"; the M1 row's goal and feature count (9 → 11);
   - `08_mvp-canvas.md`: the feature count of waves W1–W12 and the tooling bullet;
   - `03_is-isnot.md`: IS gains "a browsable index for people and agents (`CATALOG.md`,
     `catalog-index.json`), generated from the catalog"; "not a manual" stays.
4. **Workflows:** `pack-release-cycle` › `publish` and `wingfoil-release-intake` regenerate
   `CATALOG.md` and `catalog-index.json` and list them in `produces` (`version:` bumped); the
   includes are checked by hand (`wingfoil-cli` W-08).
5. **`dna.yaml`:** `paths.docs` gains `CATALOG.md` and `llms.txt`; `paths.sources` gains
   `catalog-index.json` and `index/`; a module `catalog-index` (`version:` bumped).
6. **Checks:** `npm run -s wingfoil -- workflow list`, `dna show` and `directives list` exit 0 with
   no warning; `npm test`, `npm run check:packs` and `npm run validate` exit 0.
7. **Review and merge:** an independent review of the branch by another context; the approver
   approves the tech-spec (`memory approve`) and the merge in chat; `--no-ff` into `main`; dl-014's
   and plan-020's Execution Notes record the amendments; this plan goes `active → done`.

## Handoff

- **claude:** steps 1–6, the review hand-off, the merge once approved.
- **Approver:** the tech-spec's ruling (`memory approve … --reason "…"`), and the merge of
  `config/dl-014-amendments`, in chat.
- Done when the tech-spec is `approved`, the branch is merged and pushed, and dl-014 and plan-020
  cite the result.

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). -->
