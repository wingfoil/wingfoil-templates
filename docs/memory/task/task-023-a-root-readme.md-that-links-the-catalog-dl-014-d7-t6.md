---
id: task-023-a-root-readme.md-that-links-the-catalog-dl-014-d7-t6
type: task
title: "A root README.md that links the catalog (dl-014 D7 T6)"
status: in-progress
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
yet, so github.com shows its file list. No pack is published; the first one, `base`, is published
only after WingFoil v0.3 is released (`07_sequencer.md`, M2).

Ruled by the approver on 2026-10-12: the README states no published state of its own; it says the
published packs are listed in `CATALOG.md`, which every publication regenerates (task-020), so
nothing in the README goes stale at the first release and no test is coupled to it. It names when
`base` is published, without a test.

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
      stage overlays: the axes of `catalog.yaml`), which the WingFoil CLI downloads to configure a
      project's `.wingfoil/`;
   2. **the catalog:** a link to `CATALOG.md` for people, with the sentence that the published packs
      are listed there, and a link to `llms.txt` for agents, with the sentence that it is their
      entry point and its raw URL at `main` as a code span; and that the first pack, `base`, is
      published only after WingFoil v0.3 is released;
   3. **the specifications:** links to spec-001 (the pack format) and spec-002 (the pack README and
      the catalog index);
   4. **working in this repository:** Node.js 22.12 or later (adr-002); the main tooling commands,
      each with one line, run after `npm ci` and `npm run build`: `npm run validate`,
      `npm run check:packs`, `npm run index`, `npm run compose`, `npm run publish:pack`; pointers
      to the project documents (`docs/01_vision/`, the Memory elements under `docs/memory/`, the
      plans under `docs/plans/`, the workflows under `.wingfoil/workflows/`) and to the feedback
      inbox (`docs/wingfoil-feedback/`); and that the repository does not take outside pull
      requests for now, contributions opening later as Memory elements (`03_is-isnot.md`);
   5. **the license:** MIT, as `package.json` declares; the README names no email address.
4. **Links (a test).** The link targets, extracted with `scanMarkdown` (`src/markdown-lines.ts`),
   are all relative: no scheme, no absolute path, no `../` out of the root. With a `#fragment`
   stripped, each target exists in the repository, a directory with or without a trailing slash.
5. **Commands and addresses (a test).** Every `npm run <script>` the README names is a script of
   `package.json`, and the README holds no email address (no match of `\S+@\S+\.\S+` outside
   code spans).
   **Review check:** the README names no local path, no private repository, and no person other
   than the copyright holder, if named at all.
6. **Tests,** red first: the tests of acceptance 4 and 5.
7. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

Branch `task/task-023-root-readme`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `documentation`), under `npm run lint`. Tests first.

- **`README.md`** at the root, written by hand, in the order of acceptance 3. No Version line: it
  is not a vision document (`doc-versioning`). The list of pack kinds follows the axes of
  `catalog.yaml`.
- **`tests/root-readme.test.ts`:** acceptance 4 (link targets through `scanMarkdown`, each relative
  and existing) and 5 (the `npm run` scripts against `package.json`, no email outside code spans).
  It fails while `README.md` is missing, which is the red.

## Execution Notes

- 2026-10-12: independent review of the body (a subagent with its own context): approve after
  amendments; two blocking points (`base` is published after WingFoil v0.3 is released, not when
  its formats are final; the published-state test was undecidable), five should-fix (a test meant
  to break at the first release, the approver's to rule; the build step; outside pull requests; the
  link test's edge cases and the review-only clause; no email) and nits. The approver ruled the
  published state out of the README (Context); every other point applied while `pending`.
  Re-review: approve; its nits (the email check, the pull-request sentence) applied.
