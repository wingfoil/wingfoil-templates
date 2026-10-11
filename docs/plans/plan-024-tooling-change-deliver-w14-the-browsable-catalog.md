---
id: plan-024-tooling-change-deliver-w14-the-browsable-catalog
type: plan
title: "tooling-change deliver: W14, the browsable catalog"
status: draft
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","W14"]
---

## Context

Wave W14 of milestone M1 (`docs/01_vision/07_sequencer.md`): F2.8 "Browsable catalog: README
standard, generated `CATALOG.md`, `catalog-index.json`, `llms.txt`" and F2.9 "Catalog search page on
GitHub Pages". It ends with: "a fixture catalog is browsable in `CATALOG.md`, `catalog-index.json`
and a search page built in the tests".

The work runs through `tooling-change` › `deliver`: one `tooling-delivery` iteration per tooling
task (a task whose `pack` is empty), after the `sw-life-cycle` `tooling` phase (plan-015, `done`,
approved on 2026-10-10), as dl-014 D7 and the approver's ruling of 2026-10-10 require.

Sources, all `approved` or `done`:
- **dl-014** D1–D5 and D7 (the tooling tasks); D6 was applied by plan-021, which also wrote D7
  T1's tech-spec and `pack-authoring` rule and D7 T7's workflow changes;
- **spec-002** "Pack README and catalog index": §2 (the README, its sections and the temporary
  exemption of §2.4), §3 (the index command and its outputs), §4 (the agent path), §5 (the search
  page), §6 (CB-1…CB-8), §7 (open points P1–P3);
- **plan-023**: until `npm run index` exists, `pack-release-cycle` › `publish` (v4) and
  `npm run publish:pack` leave `CATALOG.md` and `catalog-index.json` unchanged and record the skip.
  The index task removes that rule;
- the tooling of plan-015: the composer, `npm run validate` (self-test),
  `npm run validate:publication` (with `--evidence`), `npm run check:packs` (lint),
  `npm run publish:pack` (line policy N/N-1), `npm run feedback:note` and CI
  (`.github/workflows/ci.yml`, every pushed branch and the tags `**@*`).

Ruled by the approver on 2026-10-11, when this plan was presented:
- the backlog and the order below;
- **spec-002 P1:** the search page uses no third-party library. Its script is written in this
  repository, kept under `index/vendor/` with its sha256 recorded and checked by the build, as §5
  asks of the vendored code; no dependency and no ADR;
- the page renders no README Markdown: the excerpt is shown as escaped text and each result links
  the README on github.com, so §5's sanitization holds by construction;
- the agent path (D7 T4) stays a task of its own, after the index command;
- example fixtures live under the tree's root, `<tree>/tests/fixtures/examples/<pack
  name>/<example>/`; in this repository the folder stays empty until a pack has an example.

For every task, **CB-8**: `catalog.yaml`, `compat.yaml` and the files under `schema/` do not change.
The repository holds no pack yet, so the committed `CATALOG.md`, `catalog-index.json` and `llms.txt`
describe an empty catalog until `base`'s first release; the fixture catalog of the tests is the one
W14's exit criterion names.

Out of scope: README content of any pack (each pack's own tasks); the live part of CB-6 (`base`'s
first `pack-release`, wave W9); enabling GitHub Pages (the approver's action); the unused `0.x`
clauses of `pack-semver` and `pack-cycle`, and the `deliver`/`author` slip of bug-001 (plan-018),
which stay outside W14.

## Steps

1. **Tasks**, in this order, one `tooling-delivery` iteration each (WIP: one in-progress, one
   in-review). The product-owner creates each task when the previous one leaves in-progress; the
   approver accepts each one into the backlog. Task planning loads
   `npx wingfoil directives list --role product-owner`, builds `--role developer`, reviews
   `--role reviewer`. Each task's body and each build get an independent review (a subagent with
   its own context) before the approver's gate. Fixtures live under `tests/fixtures/`. Every
   task's Acceptance includes `npm run lint`, CB-8, and the real CI run of the pushed `task/<id>`
   branch, its conclusion recorded in the Execution Notes before `in-review`.

   | # | Task | Source |
   |---|---|---|
   | 1 | README lint rules: the nine sections in order, no other level-1 or level-2 heading, the generated-section markers, no WingFoil CLI command, the temporary mark while no `compat.yaml` release provides `pack-install` | spec-002 §2.1–§2.3, §6 CB-1, CB-3; dl-014 D7 T1 |
   | 2 | The index command `npm run index -- [--tree] [--check]`: `CATALOG.md`, `catalog-index.json` and `index/catalog-index.schema.json`, `llms.txt`, the README generated sections; `validate` and `validate:publication` run `--check`; the plan-023 skip is removed from `publish:pack` and `pack-release-cycle` › `publish` | spec-002 §2.2, §3, §6 CB-4, CB-5; dl-014 D7 T2; plan-023 |
   | 3 | The agent path: the procedure in `CATALOG.md` › "For agents" and in `llms.txt`, and offline tests of every URL pattern the index files emit | spec-002 §3.2, §3.4, §4, §6 CB-6; dl-014 D7 T4 |
   | 4 | Examples as fixtures: the fixture layout, the lint rule, the validation step that composes and validates every example, and the temporary exemption while the tree holds no methodology | spec-002 §2.4, §6 CB-2; dl-014 D7 T3 |
   | 5 | A root `README.md` that links `CATALOG.md` and `llms.txt` | dl-014 D7 T6; `dna.yaml` `paths.docs` |
   | 6 | The search page: the site command (spec-002 P3), its tests on the fixture catalog, and its deployment to GitHub Pages from `main` by CI | spec-002 §5, §6 CB-7, P1, P3; dl-014 D4, D7 T5 |

   Order: the lint first, because the index writes the generated sections whose markers it checks;
   the agent path right after the index, because it works on the same generated files; the search
   page last, because it builds on the index and needs Pages enabled by the approver, who is asked
   during its build, before the first deployment.
2. **Wave close.** Once the six tasks are `done`, the exit criterion of W14 is checked on `main`
   and the approver closes the wave in chat; this plan goes `active → done`.

## Handoff

- **claude:** every step above as the agent `claude`. It never runs `memory approve` or
  `memory reject`.
- **Approver:**
  - accepts each task into the backlog, and approves each reviewed task;
  - enables GitHub Pages and its environment protection on the repository, when task 6 asks;
  - closes the wave in chat.
- A rejected element goes back to `draft`, is corrected under this plan and submitted again.
- Done when the six tasks are `done`, W14's exit criterion holds on `main` and the approver has
  closed the wave.

## Execution Notes

- 2026-10-11: presented to the approver, who approved the backlog, the order and the recommended
  rulings above ("come consigli").
