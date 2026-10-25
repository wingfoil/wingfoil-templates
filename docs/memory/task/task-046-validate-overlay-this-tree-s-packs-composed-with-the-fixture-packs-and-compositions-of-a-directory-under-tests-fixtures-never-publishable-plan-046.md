---
id: task-046-validate-overlay-this-tree-s-packs-composed-with-the-fixture-packs-and-compositions-of-a-directory-under-tests-fixtures-never-publishable-plan-046
type: task
title: "validate --overlay: this tree's packs composed with the fixture packs and compositions of a directory under tests/fixtures/, never publishable (plan-046)"
status: in-progress
pack: ""            # tooling task (pack-cycle › author, plan-046, ruling 1)
depends_on: []
tags: ["tooling","validate","software"]
---

## Context

plan-046's ruling 1 (the approver, 2026-10-24). `software` cannot be composed without a
methodology (spec-001 §3) and `packs/` holds none, so neither `software`'s smallest valid form
(task-047) nor its exit criterion (dl-022 S6, task-049) can be validated on WingFoil 0.3.0 by
`npm run validate` as it stands: it composes this tree's presets and README examples, and the
examples of `software` cannot live in this tree, where they would name a methodology it does not
hold (the charter's CB-2 exemption). `npm test` runs WingFoil's stub; the real 0.3.0 runs only in
`validate` and the CI. The methodology that validates `software` exists only as a test fixture,
never published (R-12, plan-041 ruling 12).

This task gives `validate` an option, `--overlay <dir>`, that composes this tree's packs together
with the packs and compositions of a directory under `tests/fixtures/`, and runs each composition
through the matrix as `validate` runs a preset. The overlay contributes packs to resolution and
compositions to the matrix, nothing else: the schema check, the tree-wide lint and the index run on
this tree alone, unchanged, so the CB-2 exemption of a README in this tree holds (spec-002 §2.4
speaks of "the tree"), and an overlay is never publishable. The word is the flag's alone,
unrelated to spec-001 §3's overlay axes (`team-mode`, `stage`) and to `src/overlay-rules.ts`.

No pack changes here: the overlay of `software` (its fixture methodology, its first composition and
the CI step) comes with task-047, when the pack exists. The tests use the golden tree
(`tests/fixtures/compose/tree`) and WingFoil's stub.

## Acceptance

Tests run by `npm test`; `npm run build` precedes the commands. "The overlay" is the directory
`--overlay` names. Every overlay file is named in report lines by its path relative to the tree
(for example `tests/fixtures/software-exit/compositions/defaults/example.yaml`), as examples are,
so that the evidence reader's patterns (`src/evidence.ts`) hold.

1. **The option.** `npm run validate -- [--tree <dir>] --overlay <dir> …` takes one overlay,
   relative to the tree or absolute. After resolving symlinks, it must lie under the tree's
   `tests/fixtures/` and outside `tests/fixtures/examples/` (which the tree's lint covers);
   otherwise, or when the option is given more than once, `validate` exits 3 with a usage line. A
   path that is not a directory exits 2 (`<dir>: not a directory`), as `--tree` does.
2. **The layout.** An overlay holds `packs/<pack path>/`, packs laid out as spec-001 §6.1 and
   §18's layout rules require of `packs/`, and `compositions/<id>/example.yaml`, each in the
   preset format (spec-001 §15, `schema/preset.schema.json`), its `id` equal to its directory's
   name, with no `profile`. They are not README examples (spec-002 §2.4 does not apply to them).
   Anything else at the overlay's top level, under `packs/` or under `compositions/` is reported
   (exit 1).
3. **Resolution.** A composition of the overlay, and its `[+software]`/`[-software]` legs,
   resolve their entries against this tree's packs and the overlay's together, with this tree's
   `catalog.yaml` and `compat.yaml`; positional entries given with `--overlay` resolve the same
   way. An overlay pack whose path this tree's `packs/` already holds is refused (exit 1, naming
   the path): an overlay never shadows a pack of the tree. The overlay's packs pass every check
   the composer applies to a pack it composes (`resolve`'s inventory, format, layout and README
   checks, the workflow rules, the merge). Every overlay pack is reached by the resolution of at
   least one overlay composition (its entries or their `requires`, transitively) that criterion 4
   does not skip; one that is not is reported (exit 1, naming it), so no overlay pack goes
   unchecked.
4. **Its own checks.** `validate` checks the overlay's files that the tree's checks do not see:
   each `pack.yaml` and `example.yaml` against its schema; each `example.yaml`'s `id` against its
   directory, and its values as the tree checks an example's (`presetChecks` and `yamlProblems`:
   a parameter its packs do not declare, a value of the wrong YAML type), against this tree's
   packs and the overlay's; and the secret rules (`src/secret-rules.ts`) over every overlay file.
   Their lines come after the `index:` line, one summary `overlay: checked <n> files, <m>
   problems` followed by one line per problem; a problem fails the run (exit 1, or 2 for an I/O
   error). A composition whose file fails one of these checks is not composed: its lines read
   `composition <label>: skipped, …` and `matrix <label>: skipped`, and the `--param` names stay
   unjudged, as for an example the lint reports.
5. **Compositions.** Each overlay composition is composed twice and compared (F3.4) and run
   through the matrix, after the tree's presets, examples and entries, in the byte order of its
   `<id>`, with the legs of a composition holding a conditional part as any composition has them
   (labels `<label>[+software]`, `<label>[-software]`, the `matrix <label>: skipped, no
   methodology` line kept). They count in `compositions: <n>`, and the names their packs declare
   count for `--param … no composition declares it`. `--param` applies to them as to an example:
   a value the composition sets fails that composition, as for a preset. An overlay with no
   composition is reported and fails the run (exit 1): an overlay that composes nothing is not a
   pass.
6. **The tree unchanged.** With `--overlay`, the tree's `schemas:`, lint and `index:` lines and
   its own compositions are those of the same run without it. A test holds it on a temporary tree
   derived from the golden tree: its methodology packs and the compositions naming them removed,
   and each pack README whose examples name a removed pack with its section 7 set to the
   exemption line (`EXEMPTION`, spec-002 §2.4) and those examples' fixtures removed; its index
   regenerated so that `index -- --check` passes; its overlay, built in the test's temporary
   directory, holds a methodology and a composition of the tree's `software` with it. The tree's
   lint reports no problem, and the overlay's composition runs on the stub.
7. **Never publishable.** `runValidate` refuses an overlay whenever its mode is `publication`,
   with its own line, `--overlay: an overlay is never publishable (plan-046 ruling 1)`, exit 3,
   so `npm run validate:publication` refuses it, with or without `--evidence`; the refusal covers
   any caller in publication mode. `publish:pack` refuses `--overlay` in its own parse, and its
   guard builds its own arguments and could not pass one; `index` and `site` take no `--overlay`
   either (their strict parsers refuse it): these are characterization tests, not red ones. No
   change to `src/publish.ts`, `src/index*.ts`, `src/catalog*.ts` or `src/site*.ts`.
8. **The composer's scope.** `composeTwice` and the composer read one tree (`--tree`), and
   `resolve`, `compose-documents`, `pack-files`, `layout-rules` and `readmeProblems` read files
   under it. The Design chooses how an overlay composition reaches them: a merged temporary tree
   built by `validate` (this tree's `packs/`, `catalog.yaml` and `compat.yaml` with the overlay's
   packs, never written inside the repository), or a second root taught to those modules; and it
   states which; either way, the report lines keep the tree-relative paths of the preamble (a
   merged tree's paths mapped back). `npm run compose` gains no option.
9. **Red first** (dl-018): the tests of criteria 1–7, except criterion 7's characterization
   tests, are committed first and fail for the right
   reason (the behaviour or its own message missing; for criterion 7, the publication line), their
   failing count recorded in the Execution Notes; then the code.
10. **Green.** From a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
    `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
    `npm run validate` (this tree's output unchanged), the golden fixture's CI step, and
    `npm run -s wingfoil -- workflow list` exit 0 with no warning. The CI run on the branch is
    `success` and recorded; after the merge, `main`'s too.
11. **Nothing else moves.** No file under `packs/`, `schema/` or `.github/` changes; no new
    dependency (adr-003); `catalog.yaml`, `CATALOG.md`, `catalog-index.json`, `llms.txt` and the
    expected fixtures are unchanged, and no overlay fixture is committed (task-047 commits the
    first). `src/validate-cli.ts`'s usage comment names the option.

## Design

- **Criterion 8's choice: a merged temporary tree.** With `--overlay`, `validate` builds, under
  `os.tmpdir()` (`mkdtemp`, removed in a `finally`), a tree holding a copy of this tree's
  `packs/`, `catalog.yaml` and `compat.yaml` and the overlay's `packs/` copied into the same
  `packs/`. The overlay's compositions, and positional entries given with `--overlay`, resolve
  and compose on it: `resolve`, `composeTwice`, the conditional legs and the matrix take the merged
  tree instead of `args.tree`, and nothing else changes in them. The tree's own presets, examples
  and entries without `--overlay` still use `args.tree`. A second root would touch `resolve`,
  `compose-documents`, `pack-files`, `layout-rules`, `readme-rules` and the composer's CLI; the
  merged tree touches `src/validate.ts` alone, plus one export of `src/check-packs.ts`. The copy
  is about a hundred kilobytes (`packs/` today), made once per run.
- **Paths mapped back.** Every line that comes from the merged tree goes through one function,
  `mapOverlayPaths`: the merged tree's absolute path becomes this tree's; `packs/<p>` for an
  overlay pack path `<p>` becomes `<overlay>/packs/<p>`, where `<overlay>` is the overlay's path
  relative to the tree, longest path first and only at a path's start (after the line's start, a
  space, a quote or a backtick). Paths of this tree's packs are already the same in both trees.
  The matrix's lines name only the composed output's files, which have no tree path.
- **The option** (criterion 1). `parseArgs` takes `overlay: { type: 'string', multiple: true }`;
  more than one is a `UsageError`. `--overlay` resolved against `args.tree` (an absolute path as
  given); not a directory, exit 2; then `realpathSync` of both, and the overlay's must start with
  `<tree>/tests/fixtures/` and not with `<tree>/tests/fixtures/examples/`, otherwise a usage line,
  exit 3. In publication mode, after the parse, an overlay returns exit 3 with criterion 7's line,
  before any check runs.
- **The overlay's checks** (criteria 2–4), after the `index:` line, summarized as
  `overlay: checked <n> files, <m> problems`:
  - the layout: the top level holds only `packs/` and `compositions/`; `treeLayout(<overlay>)`
    (`src/layout-rules.ts`, which scans `packs/` under any root) gives the overlay's pack paths
    and its layout problems; `compositions/` holds only directories, each holding only
    `example.yaml`;
  - a pack path the tree's `treeLayout` also lists, or one nested in or holding one of them, is
    refused before the merge;
  - each `pack.yaml` against the `pack` schema and each `example.yaml` against the `preset`
    schema (`repositorySchemas()`), its `id` against its directory, no `profile`;
  - the values: `yamlProblems` and `presetChecks` (`src/tree-rules.ts`) on each `example.yaml`,
    with a `LintContext` built on the merged tree. `src/check-packs.ts` exports a
    `lintContext(tree)` with the construction `runCheckPacks` does today (its schema check, its
    `treeLayout`, its catalog, `loadPacks`), and `runCheckPacks` uses it, unchanged in behaviour;
  - the secret rules: `secretProblems` over every file under the overlay;
  - problems are sorted and printed as the lint prints them (`formatProblem`), with the overlay's
    tree-relative paths.
  A composition named by a problem is skipped as criterion 4 says; its packs do not count as
  reached.
- **The compositions** (criterion 5). After the tree's presets, examples and entries, one
  `Composition` per `compositions/<id>/example.yaml` in the byte order of `<id>`, with the label
  `<overlay>/compositions/<id>/example.yaml` and a `tree` field (the merged tree), read by
  `runOne` and by the `[±software]` legs' `resolve`. `composed`, `used` and `unjudged` are those of
  the whole run, so `compositions: <n>` and the `--param` rule count them. After the run, each
  overlay pack path no resolved overlay composition holds is a problem (exit 1, naming
  `<overlay>/packs/<p>`); none at all, `overlay: no composition` (exit 1).
- **Red steps** (dl-018 R3), in `tests/validate.test.ts`, a new `describe('--overlay')` reusing
  `withTree` and the stubs; each fails before the code for the reason given:
  1. an overlay twice, one outside `tests/fixtures/`, one under `tests/fixtures/examples/`, one
     reached through a symlink pointing outside: exit 3 with the usage line (today: exit 3 with
     `Unknown option '--overlay'`, so the assertion is on the line's text); not a directory: exit 2;
  2. a stray file at the top level, under `packs/` and under `compositions/`; a composition whose
     `id` differs from its directory; one with `profile`: each reported, exit 1;
  3. an overlay pack at a path the tree holds: refused, naming it; an overlay pack no composition
     reaches: reported; an overlay with no composition: reported;
  4. a composition with a parameter its packs do not declare, and one with a value of the wrong
     YAML type: reported with the overlay's path, the composition skipped, its `--param` names
     unjudged; a planted secret in an overlay file: reported;
  5. on the golden tree with an overlay holding a copy of `methodology/flow` renamed
     `methodology/overlay-flow` and two compositions: the compositions composed in byte order of
     their ids, their `[±software]` legs run, `compositions: <n>` counting them, the matrix lines
     on the stub carrying the tree-relative labels; a composer error inside an overlay pack names
     `<overlay>/packs/…`, never the temporary tree;
  6. criterion 6's tree: the golden tree copied with `packs/methodology/`, `presets/` and its
     catalog `presets` entry removed, every example whose `packs` name a methodology removed, the
     section 7 of each README left with no example set to `EXEMPTION`, the index regenerated;
     the overlay holds the golden `methodology/kanban` and a composition of it with `software`.
     The `schemas:`, `lint:` and `index:` lines equal those of the run without `--overlay`, with
     no problem, and the overlay composition runs;
  7. `runValidate` in publication mode with `--overlay`: exit 3 with criterion 7's line, nothing
     else run; `validate:publication` with and without `--evidence` the same.
  Characterization, green before the code: `publish:pack`, `index` and `site` refuse `--overlay`
  (exit 3 or their usage code, with parseArgs' message).
- **Files.** `src/validate.ts` (the option, the merged tree, the overlay's checks, the
  compositions, the mapping), `src/check-packs.ts` (`lintContext` exported), `src/validate-cli.ts`
  (its usage comment), `tests/validate.test.ts`. No fixture is committed: each test builds its
  overlay in its temporary tree.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-25: independent review: request changes, four blocking findings, no ruling changed: the
  publication's refusal had no red step (strict parsing already refuses an unknown option); the
  conditional legs, order and counts of overlay compositions unstated; the value checks of an
  example missing; overlay packs no composition reaches left unchecked. Applied, with the
  non-blocking ones: tree-relative labels for the evidence reader, `--param`'s real behaviour,
  the preset format instead of spec-002 §2.4's, the composer's scope left to the Design, the
  option's path rules, the overlay lines' place and summary, the derived tree of criterion 6,
  `main`'s CI. Re-review requested.
- 2026-10-25: re-review: approve after amendments, nothing blocking, no ruling changed. Applied:
  criterion 9 excepts criterion 7's characterization tests; `publish:pack`'s refusal stated as it
  is; the tree-relative paths kept whatever criterion 8's choice; criterion 6's READMEs; criterion
  3's "reached" pinned down. Submitted for the approver's acceptance into the backlog.
- 2026-10-25, red (`a45b99f`): `node --test --test-name-pattern=overlay dist/tests/validate.test.js`
  on Node.js 22.21: 11 of 12 failed, each on `Unknown option '--overlay'`; criterion 7's
  characterization test (`publish:pack`, `index`, `site` refuse the option) passed.
- 2026-10-25, green (`5efd108`): the whole suite 959 of 959 on Node.js 22.21. One red test changed
  with the code: a composer error inside an overlay pack is now a YAML error in a workflow, since a
  missing workflow file is reported by pack id, with no path for the mapping to show.
- 2026-10-25, departures from the Design, no criterion changed: the tests move
  `methodology/flow` into the overlay rather than a renamed copy; `lintContext(tree, broken,
  problems)` rather than `lintContext(tree)`, as `runCheckPacks` holds both; `checkOverlay` also
  runs `packLayoutProblems` on each overlay pack, so criterion 2's layout holds for a pack no
  composition reaches.
- 2026-10-25, build review: approve after amendments. Applied (`a155f3d`): given entries resolve on
  the merged tree but no longer count as reaching an overlay pack (criterion 3); an absolute merged
  path of an overlay pack maps to the overlay; a sentence-final path is mapped; `tests/fixtures`
  resolved through its links; style. Tests after the code (dl-018 R2, the review's request):
  schema failures of an overlay `pack.yaml` and `example.yaml`, `--param` on an overlay
  composition, an overlay pack around a tree's pack (catalog pack ids do not nest, so its layout
  refuses it before the shadowing check), entries not reaching, `validate:publication` with and
  without `--evidence`. The fixes change behaviour: re-review requested (dl-017).
- 2026-10-25, re-review: approve; nothing blocking. Applied its one fix: an absolute merged path is
  mapped only at a path's end, so a tree pack whose id extends an overlay pack's
  (`methodology/flow-x` beside `methodology/flow`) is never mapped into the overlay; a unit test
  of `mapOverlayPaths`, exported for it, holds both passes.
- 2026-10-25: checks from clean clones of `3c0b6a4` on Node.js 22.21.0 and 22.12.0: `npm ci`,
  `npm test` 965 of 965, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
  `validate` (this tree: 3 runs, 0 failed), the golden fixture's CI step (26 runs, 0 failed) and
  `workflow list` exit 0 with no warning. CI run 40212289975 on the branch: `success`.
  `in-progress → in-review`.
