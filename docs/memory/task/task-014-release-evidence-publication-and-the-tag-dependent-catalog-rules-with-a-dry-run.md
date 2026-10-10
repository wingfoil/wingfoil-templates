---
id: task-014-release-evidence-publication-and-the-tag-dependent-catalog-rules-with-a-dry-run
type: task
title: "Release evidence, publication and the tag-dependent catalog rules, with a dry run"
status: draft
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-013-ci-on-pushes-pull-requests-and-release-tags"]
tags: ["tooling","W7","F5.1"]
---

## Context

Task 11 of plan-015 (`sw-life-cycle` › `tooling`, wave W7, F5.1). Tooling task, no pack. Wave W7
ends with "a dry-run publication of a fixture pack produces tag, catalog entry, digest and note"
(`07_sequencer.md`); the note is plan-015 task 12 (F5.4). Below, "plan-015 task N" names a step of
that plan, not a Memory element.

It comes from:
- **F5.1:** `pack-release` with evidence: commands, WingFoil versions and exit codes are recorded in
  the element;
- **dl-009:** evidence is produced only in publication mode; the evidence writer refuses a result
  whose mode is not publication, or that applied a tolerance; the publication path has no way to
  select self-test mode;
- **spec-001 §11** (publication order: the tag `<catalog pack id>@<version>` at commit C, then a
  later commit adds the catalog entry naming C), **§12** (the computed `wingfoil` range), **§13**
  (the digest), **§14** (transition digests at the target stage's tag);
- **task-012:** the `catalog.yaml` rules that need a tag were moved here, as the approver ruled on
  2026-10-09: a version entry matches the tagged `pack.yaml` and its digest recomputes; transition
  digests recompute at the tag; every `wingfoil` range recomputes from `compat.yaml`;
- **plan-023:** until `npm run index` exists (wave W14), `publish` leaves `CATALOG.md` and
  `catalog-index.json` unchanged and records the skipped regeneration;
- **`pack-release-cycle`:** `validate` records the evidence; `publish` tags, then updates
  `catalog.yaml` in a later commit, then pushes (by hand).

**The dry run,** as the approver ruled on 2026-10-10. Publication mode cannot pass today: no WingFoil
release in `compat.yaml` has `format_key: true` (dl-009). So the whole publication path is proven
in the tests, in a scratch git repository built from a fixture, against a stub WingFoil declared as a
fictional release with `format_key: true` in a **fixture** `compat.yaml` only, never in the real
one. A real dry run on the golden tree, with the real `compat.yaml`, stops as designed at
`no compatible release (publication)` and writes no evidence. Real evidence waits for WingFoil v0.3
and its intake.

Not in scope: the feedback note on publication (plan-015 task 12); the line policy (plan-015 task
13); pushing (the workflow's manual step); the index (wave W14); creating or moving the
`pack-release` Memory element (the workflow's CLI verbs).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network.
2. **Evidence writer** (`src/evidence.ts`): from a `validate` result it writes the `## Validation`
   section of a `pack-release` element: the command, the mode, every WingFoil version run with the
   command lines and their results, the compositions, and the exit code. It **refuses** (exit 1, no
   text) a result whose mode is not `publication`, that applied a tolerance, or whose code is not 0.
   No option of any command selects another mode.
3. **`npm run publish -- --pack <catalog pack id> [--tree <dir>] [--param <name>=<value>]…
   [--dry-run]`**, on a git repository whose working tree is clean:
   - checks that `pack.yaml`'s `version` is higher than every version of the pack in
     `catalog.yaml`, that the tag `<id>@<version>` does not exist, and that `CHANGELOG.md` has an
     entry for the version;
   - runs the validation in publication mode in-process, with every preset that contains the pack
     and the pack itself as an entry; writes the evidence of acceptance 2 to standard output, or
     stops (exit 1) when the writer refuses;
   - creates the annotated tag `<id>@<version>` at `HEAD`; computes its digest (§13) and its
     `wingfoil` range (§12); adds the version entry to `catalog.yaml` (and the pack entry, `status:
     active`, the first time), in a new commit `catalog: <id>@<version>`;
   - leaves `CATALOG.md` and `catalog-index.json` unchanged and says so (plan-023);
   - prints the `## Publication` section: tag, commit, digest, range, the index skip;
   - never pushes.

   With `--dry-run` it does all of this in a temporary clone (tags included) and deletes it: the
   repository is left byte-for-byte as it was, which a test checks.
4. **Tag-dependent catalog rules** in `npm run check:packs` (spec-001 §18), each a rule id with a
   passing and a failing test on a scratch git repository: `catalog-tag` (the version's tag exists
   and is annotated), `catalog-commit` (`commit` is the tag's target), `catalog-digest` (the digest
   recomputes), `catalog-manifest` (`formats`, `requires_capabilities`, `requires`, `conflicts`
   equal the tagged `pack.yaml`), `catalog-range` (`wingfoil` recomputes from `compat.yaml`),
   `catalog-transition` (a stage version's transition digests recompute at its tag). On this
   repository (no tag, no pack) they find nothing.
5. **The dry run, in the tests (W7 exit criterion, except the note):** a fixture tree with a pack and
   a fixture `compat.yaml` listing a fictional release with `format_key: true`, run through a stub
   WingFoil for that release: `publish` produces the annotated tag, the catalog entry with commit,
   digest and range, and the evidence; afterwards `check:packs` (with the rules of acceptance 4)
   and `validate:publication` pass on the result.
6. **A real dry run** on the golden tree, with this repository's `compat.yaml`, exits 1 with
   `no compatible release (publication)`, writes no evidence and creates no tag; recorded in the
   Execution Notes.
7. **Failure paths,** each with a test, exit 1 naming the cause: a dirty working tree, a version not
   above the catalog's, an existing tag, a missing `CHANGELOG.md` entry, a refused evidence; exit 2
   on an I/O or git error; exit 3 on bad usage.
8. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
