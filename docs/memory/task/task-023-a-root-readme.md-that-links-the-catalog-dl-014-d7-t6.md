---
id: task-023-a-root-readme.md-that-links-the-catalog-dl-014-d7-t6
type: task
title: "A root README.md that links the catalog (dl-014 D7 T6)"
status: pending
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-022-examples-as-fixtures-the-layout-the-lint-rule-and-the-validation-step-spec-002-2.4-cb-2"]
tags: ["tooling","W14","F2.8"]
---

## Context

Task 5 of plan-024 (`tooling-change` › `deliver`, wave W14, F2.8). Tooling task, no pack. Below,
"plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **dl-014 D7 T6:** a root `README.md` that links `CATALOG.md`; `dna.yaml` `paths.docs` already
  names it, with `CATALOG.md` and `llms.txt`;
- **spec-002 §3.4:** agents are pointed to `llms.txt` explicitly, from `CATALOG.md`, the root
  `README.md` and the search page, because a project site cannot put it at a domain root;
- **`docs/01_vision/01_product-brief.md` §1** (what the repository is) and **`03_is-isnot.md`**
  (not a manual: the README points to the files, it does not teach WingFoil).

The repository is public at `github.com/wingfoil/wingfoil-templates` and has no root `README.md`
yet, so github.com shows its file list. No pack is published: the README says so, and that the
first pack, `base`, waits for WingFoil's final v0.3 formats (`07_sequencer.md`, M2).

The README is not a pack README: spec-002 §2 and the README lint rules (task-018) do not apply to
it, and `npm run index` does not generate it. It is written by hand and checked by a test.

Not in scope: the search page and its link (plan-024 task 6 adds it); a `LICENSE` file
(`package.json` declares MIT; whether to add the file is the approver's, outside W14); contributor
documentation beyond pointers (each process is in `.wingfoil/` and `docs/`); CB-8:
`catalog.yaml`, `compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **Content.** `README.md` at the repository root holds, in this order:
   1. a level-1 title and a summary of what the repository is: the official catalog of WingFoil
      template packs (methodologies, phase methods, blueprints, governance packs, team-mode and
      stage overlays), which the WingFoil CLI downloads to configure a project's `.wingfoil/`;
   2. **the catalog:** a link to `CATALOG.md` (people) and to `llms.txt` (agents, with the sentence
      that `llms.txt` is their entry point), and the current state: no pack is published yet, the
      first one (`base`) waits for WingFoil's final v0.3 formats;
   3. **the specifications:** links to spec-001 (the pack format) and spec-002 (the pack README and
      the catalog index);
   4. **working in this repository:** the tooling commands, each with one line: `npm run validate`,
      `npm run check:packs`, `npm run index`, `npm run compose`, `npm run publish:pack`; Node.js
      22.12 or later (adr-002); and pointers to the project documents (`docs/01_vision/`, the
      Memory elements under `docs/memory/`, the plans under `docs/plans/`, the workflows under
      `.wingfoil/workflows/`) and to the feedback inbox (`docs/wingfoil-feedback/`);
   5. **the license:** MIT, as `package.json` declares.
4. **Links.** Every link is relative to the repository root (no `github.com` or raw URL), and every
   link target exists in the repository: a test extracts the link targets with the Markdown scanner
   of task-018 and checks each one. The README names no local path, no private repository and no
   person but as the copyright holder, if at all.
5. **Truth.** A test checks that every `npm run <script>` the README names is a script of
   `package.json`, and that the README's sentence on the published state holds: it says no pack is
   published while `catalog.yaml` lists no published version (the test fails once one is, so the
   README is revised with the first release).
6. **Tests,** red first: acceptance 4 and 5.
7. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
