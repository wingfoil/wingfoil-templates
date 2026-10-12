---
id: plan-024-tooling-change-deliver-w14-the-browsable-catalog
type: plan
title: "tooling-change deliver: W14, the browsable catalog"
status: active
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
  Task 2b removes that rule;
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
   | 2 | The index command `npm run index -- [--tree] [--check]`: `CATALOG.md`, `catalog-index.json` and `index/catalog-index.schema.json`, `llms.txt`, the README generated sections; `validate` and `validate:publication` run `--check` | spec-002 §2.2, §3, §6 CB-4, CB-5; dl-014 D7 T2 |
   | 2b | The publication regenerates the index: `publish:pack` on the current line, on an N-1 line (from `main`'s commit) and with `--dry-run`; the plan-023 skip removed from `publish:pack` and `pack-release-cycle` › `publish` (`version:` 4 → 5); publishing changes no file under `packs/`; the tests' interim index helper of task 2 removed | spec-002 §3.1, §6 CB-5; dl-014 D2, D6; plan-023 |
   | 3 | The agent path: the procedure in `CATALOG.md` › "For agents" and in `llms.txt`, and offline tests of every URL pattern the index files emit | spec-002 §3.2, §3.4, §4, §6 CB-6; dl-014 D7 T4 |
   | 4 | Examples as fixtures: the fixture layout, the lint rule, the validation step that composes and validates every example, and the temporary exemption while the tree holds no methodology | spec-002 §2.4, §6 CB-2; dl-014 D7 T3 |
   | 5 | A root `README.md` that links `CATALOG.md` and `llms.txt` | dl-014 D7 T6; `dna.yaml` `paths.docs` |
   | 6 | The search page: the site command (spec-002 P3), its tests on the fixture catalog, and its deployment to GitHub Pages from `main` by CI | spec-002 §5, §6 CB-7, P1, P3; dl-014 D4, D7 T5 |

   Order: the lint first, because the index writes the generated sections whose markers it checks;
   2b right after 2, because it needs the index command; the agent path right after them, because
   it works on the same generated files; the search page last, because it builds on the index and
   needs Pages enabled by the approver, who is asked during its build, before the first deployment.
2. **Wave close.** Once the seven tasks are `done`, the exit criterion of W14 is checked on `main`
   and the approver closes the wave in chat; this plan goes `active → done`.

## Handoff

- **claude:** every step above as the agent `claude`. It never runs `memory approve` or
  `memory reject`.
- **Approver:**
  - accepts each task into the backlog, and approves each reviewed task;
  - enables GitHub Pages and its environment protection on the repository, when task 6 asks;
  - closes the wave in chat.
- A rejected element goes back to `draft`, is corrected under this plan and submitted again.
- Done when the seven tasks are `done`, W14's exit criterion holds on `main` and the approver has
  closed the wave.

## Execution Notes

- 2026-10-11: presented to the approver, who approved the backlog, the order and the recommended
  rulings above ("come consigli").
- 2026-10-11: plan submitted `active`. Task 1: task-018 (README lint rules; spec-002 §2, CB-1,
  CB-3) done, merged `854e353`. `npm run check:packs`, `validate` and the composer apply the rules
  `readme-heading`, `readme-marker`, `readme-command`, `readme-install-mark` and `readme-link`; the
  fixture READMEs follow the standard with placeholder generated sections. Next: task 2, the index
  command.
- 2026-10-11: the approver ruled, on task-019's independent review, that dl-014 D7 T2 runs as two
  tasks: task 2, the index command (task-019), and a new **task 2b**, the publication that
  regenerates the index and removes the plan-023 skip; seven tasks in all. Also ruled: the README
  column of `CATALOG.md` links the README rendered on github.com at the latest tag.
- 2026-10-11: task 2: task-019 (the index command; spec-002 §3, CB-4, CB-5) done, merged `59db031`.
  `npm run index` writes `CATALOG.md`, `catalog-index.json`, `llms.txt` and the README
  generated sections; `validate` runs `--check`. The repository's root holds the outputs of its
  empty catalog; `tests/fixtures/index/expected/` holds those of a fixture catalog with tags.
  spec-002 erratum recorded in task-019 (the tag is derived, not read from `catalog.yaml`). Next:
  task 2b.
- 2026-10-11: task 2b: task-020 (the publication regenerates the index; spec-002 §3.1, CB-5)
  done, merged `5e56f47`. `publish:pack` commits `CATALOG.md` and `catalog-index.json` with
  `catalog.yaml`, on an N-1 line from `main`'s commit; the plan-023 skip is gone from
  `publish:pack` and `pack-release-cycle` (v5); the tests no longer refresh the index after a
  publication. Next: task 3, the agent path.
- 2026-10-11, for task 3 (task-021): the live part of CB-6 (an anonymous fetch from `llms.txt` to
  the index, a filter, and one pack's README and `pack.yaml` at its tag) is recorded as evidence in
  `base`'s first `pack-release` (spec-002 §6). No charter or workflow carries it yet: **`base`'s
  charter must list CB-6 with CB-1 and CB-2.**
- 2026-10-11: task 3: task-021 (the agent path; spec-002 §4, CB-6 offline) done, merged `a199d3f`.
  `CATALOG.md` › "For agents" and `llms.txt` give the five steps of §4; every URL the index files
  emit is parsed, matched and resolved offline, and the path is played on the fixture catalog.
- 2026-10-11: the approver confirmed, in chat, a request of the coordinating session (WFCoord) for
  the end of W14: `docs/wingfoil-feedback/README.md` cites as WingFoil does
  (`<full service id>/F-<nnn>@<full sha>`), with the full service id next to the short key
  `svc-018`; through its own task element, after the last task of the wave. Next: task 4.
- 2026-10-11: task 4: task-022 (examples as fixtures; spec-002 §2.4, CB-2) done, merged `d784e32`.
  Rules `example-section` and `example-fixture`; `validate` composes every example and
  `publish:pack` counts it; the exemption holds while the tree holds no methodology (the
  approver's ruling; spec-002 §2.4 erratum in task-022). The golden tree's six packs have
  examples. Owed at W10: `base` needs a version with examples when the first methodology enters
  the tree. Next: task 5.
- 2026-10-12: task 5: task-023 (the root README; dl-014 D7 T6) done, merged `dafd120`. The README
  links `CATALOG.md`, `llms.txt` and the specifications and names no published state of its own
  (the approver's ruling). Next: task 6, the search page.
- 2026-10-12: task 6: task-024 (the search page; spec-002 §5, CB-7) done, merged `280e78c`. The site
  is live at `https://wingfoil.github.io/wingfoil-templates/`, deployed by `pages.yml` (run
  38220457129, `success`), serving `catalog-index.json` and `llms.txt` with CORS `*`. The
  approver enabled Pages with the `github-pages` environment restricted to `main`. **All seven
  tasks of the plan are done.** Next: the citation task the coordinating session asked for (the
  approver's confirmation), then the check of W14's exit criterion and the wave close.
- 2026-10-12: task-025 (the inbox cites as WingFoil does: the full service id and the full sha),
  hosted here after task 6 at the approver's confirmation, done, merged `1a08bb8`; the
  coordinating session has its reply. Next: the check of W14's exit criterion and the wave close.
- 2026-10-12, wave close: W14's exit criterion holds on `main` (`1e3d7fe`): the fixture catalog
  with tags is browsable in `tests/fixtures/index/expected/` (`CATALOG.md`, `catalog-index.json`,
  `llms.txt`, the pack READMEs) and in a search page built in the tests (`tests/site.test.ts`);
  CI run 38224999958 and Pages run 38224999879 on that commit are `success`, and the live site
  serves `main`'s files. The seven tasks of the plan (task-018 … task-024) and the hosted task-025
  are `done`. Owed after the wave: `base`'s charter lists CB-6 with CB-1 and CB-2; `base` gets
  examples when the first methodology enters the tree (W10); an amendment of spec-002 carries the
  errata and the rulings on P1–P3 its Execution Notes record. The approver closed W14 in chat; this
  plan goes `active → done`.
