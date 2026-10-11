---
id: task-019-the-index-command-catalog.md-catalog-index.json-llms.txt-and-the-readme-generated-sections-spec-002-3-cb-4-cb-5
type: task
title: "The index command: CATALOG.md, catalog-index.json, llms.txt and the README generated sections (spec-002 §3, CB-4, CB-5)"
status: pending
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-018-readme-lint-rules-the-sections-the-generated-markers-and-install-truth-spec-002-2-cb-1-cb-3"]
tags: ["tooling","W14","F2.8"]
---

## Context

Task 2 of plan-024 (`tooling-change` › `deliver`, wave W14, F2.8). Tooling task, no pack. Below,
"plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **dl-014 D2 and D7 T2:** one command writes, deterministically, `CATALOG.md`,
  `catalog-index.json` with its schema outside `schema/`, `llms.txt` and the generated sections of
  each pack README; the validation command fails when a committed output differs;
- **spec-002 §2.2** (the generated sections, written only from the pack's own files), **§3.1**
  (the command, `--check`, determinism, reading published data from tags, exit codes), **§3.2**
  (`CATALOG.md`), **§3.3** (`catalog-index.json` and `index/catalog-index.schema.json`), **§3.4**
  (`llms.txt`), **§4** (the URL patterns the files emit), and **§6 CB-4, CB-5**;
- **task-018:** `readmeOutline` (`src/readme.ts`) is the one reading of a README's structure; the
  index rewrites between exactly the pairs the README lint accepts.

Ruled by the approver on 2026-10-11:
- **the split:** dl-014 D7 T2 runs as two tasks. This one is the index command (plan-024 task 2).
  Plan-024 task 2b, opened after it, makes `npm run publish:pack` regenerate the index on the
  current line, on an N-1 line (computed from `main`'s commit, not from the maintenance working
  tree) and with `--dry-run`; it removes the plan-023 skip from `publish:pack` and from
  `pack-release-cycle` › `publish`, and proves CB-5's "publishing a version changes no file under
  `packs/`". No pack is published in between: the repository holds none;
- **spec-002 P2:** `excerpt` carries the first paragraph of section 2 only, not the adoption
  profiles as text; the profiles are the pack object's own field `profiles`, which search reads
  (plan-024 task 6);
- **the README column of `CATALOG.md`** links the README rendered on github.com at the latest
  version's tag, `https://github.com/wingfoil/wingfoil-templates/blob/<tag>/packs/<catalog pack id>/README.md`,
  for people; `catalog-index.json` and `llms.txt` keep the raw URLs of §4 for agents.

Choices this task makes beyond spec-002, for the approver to see:
- the tag is derived as `<catalog pack id>@<version>` (spec-001 §4, dl-004): a `catalog.yaml`
  version entry has no `tag` field (spec-001 §11), although spec-002 §3.1 says `tag` comes "from
  `catalog.yaml`". Recorded as a spec-002 erratum in the Execution Notes;
- no output field holds a date, a commit **or a digest** (§3.3 says no commit of `main`), so that
  the expected outputs are byte-stable;
- an empty axis reads `None published yet.`; empty Presets, Transitions and Profiles sections read
  `None yet.`;
- the report lines of acceptance 3 and 10;
- a failure of the index's own schema check exits 2, a defect of the tool.

Facts the Acceptance relies on:
- a pack whose catalog entry has no version (status `planned`) or that has no catalog entry is not
  listed (§3.1); presets and transitions are listed whenever `catalog.yaml` indexes them;
- this repository holds no pack yet: its committed `CATALOG.md`, `catalog-index.json` and
  `llms.txt` describe an empty catalog. The golden tree (`tests/fixtures/compose/tree`) indexes one
  preset and no published pack; CI validates it, so it gets its own outputs and regenerated README
  sections. The fixture catalog with tagged versions that CB-4 needs is built in the tests as a git
  repository (`tests/support/published-repo.ts`), and its expected outputs are committed so that a
  reader can browse them (W14's exit criterion);
- the test support builds the scratch trees that `validate.test.ts`, `publish.test.ts` and
  `feedback-note.test.ts` validate; with `index --check` in `validate`, it must write the index
  outputs before each tree's commit.

Not in scope:
- the publication (plan-024 task 2b, above). Until it is done, `publish:pack` keeps the plan-023
  skip line, and `pack-release-cycle` › `publish` keeps its plan-023 sentences;
- the agent procedure in `CATALOG.md` › "For agents" and `llms.txt`, and the offline tests of every
  URL pattern (CB-6): plan-024 task 3. Here the files carry the URL patterns of acceptance 9;
- the Pages URLs of §4 (`https://wingfoil.github.io/wingfoil-templates/…`): plan-024 task 6, once a
  site is deployed;
- examples (CB-2, plan-024 task 4), the root `README.md` (task 5), the search page (task 6);
- the other fixture trees under `tests/fixtures/` (`merge/`, `resolve/`): `validate` does not run
  on them, so their READMEs keep task-018's placeholder generated sections;
- CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **The command (§3.1).** `npm run index -- [--tree <dir>] [--check]`, the tree defaulting to the
   working directory. Counts use the singular for one (`1 file`).
   - It writes `CATALOG.md`, `catalog-index.json` and `llms.txt` at the tree's root, and the
     generated sections of the `README.md` of every pack under `packs/` whose `pack.yaml` passes
     its schema; a pack with no `README.md` file is skipped (the layout rule reports it). It
     reports `index: wrote <n> files, <m> unchanged`.
   - Before writing it runs the README rules of task-018 on those READMEs; a README that fails
     them is reported in the lint's form and nothing is written (exit 1).
   - `--check` writes nothing and does not run the README rules (the lint step of `validate`
     reports them). It reports `index: checked <n> files, <m> not up to date`, then one line per
     output that is missing or differs, `<file>: not up to date: run npm run index`, sorted; it
     exits 1 when `<m>` is not 0.
   - Exit codes: 1 a check fails, 2 an I/O or git error, 3 bad usage.
4. **Determinism (§3.1).** Two runs on the same tree are byte-identical. Packs, versions, presets
   and transitions are in ascending byte order of their ids, versions in semver order; parameters
   and every list of names (`workflows`, `memory_types`, `directives`, `profiles`) in ascending
   byte order; a preset's `packs` keep their entries as written (`<id>@<range>`), in file order.
   LF line endings and a final newline; JSON with two-space indentation and the key order of
   acceptance 7. No clock, no randomness, no environment value enters an output.
5. **Published data (§3.1).** A published version is a `versions[]` entry of `catalog.yaml`; its
   `version` and `wingfoil` come from `catalog.yaml` in the working tree, its `tag` is
   `<catalog pack id>@<version>`, and every field that acceptance 7 takes from `pack.yaml`, a
   fragment or the README is read at that tag (`git show <tag>:<path>`), never from the working
   tree. When `catalog.yaml` lists a published version, the tree must be the top level of a git
   repository and every tag must exist; otherwise the command exits 2, naming the tag or the tree.
   A pack with no published version is not listed in `CATALOG.md` or `catalog-index.json`.
6. **`CATALOG.md` (§3.2),** in this order; its exact layout, the axis heading texts included, is
   fixed in the Design and by the expected files:
   1. a level-1 title and one paragraph saying what the catalog is and that the file is generated
      by `npm run index`;
   2. `## Install`, preceded by `<a id="install"></a>`, deliberately, so that the anchor READMEs
      link stays stable if the heading text changes: the `compat.yaml` releases whose
      `capabilities` contain `pack-install`, or the sentence that no released WingFoil installs
      packs yet and that each README's section 3 gives the temporary hand steps;
   3. one section per axis, `base` first, then the axes in `catalog.yaml` order: a table with the
      columns Pack, Summary, Slot (phase only), Status, Latest, WingFoil, README. Pack is the id,
      preceded by `<a id="pack-<id with / replaced by ->"></a>`. Summary is the first sentence of
      the latest version's `description`: up to and including the first `.`, `!` or `?` followed
      by whitespace or the end, else the whole description. Latest and WingFoil are the last
      published version and its computed range. README links the github.com URL of the approver's
      ruling at the latest tag. Table cells escape `|` as `\|` and fold line breaks into one space.
      An axis with no published pack holds the line `None published yet.`;
   4. `## Presets`: id, title, profile (`—` when the preset has none), packs;
   5. `## Transitions`: id, from, to;
   6. `## Profiles`: each profile named by a preset, with the packs of the presets that name it,
      matched on the id before `@`;
   7. `## For agents`: the URL patterns of acceptance 9 and a relative link to `llms.txt`.

   Sections 4–6 hold `None yet.` when empty.
7. **`catalog-index.json` (§3.3).** It validates against `index/catalog-index.schema.json` (JSON
   Schema 2020-12, `$id` `https://github.com/wingfoil/wingfoil-templates/index/catalog-index.schema.json`,
   outside `schema/`), which compiles under the repository's Ajv 2020 in strict mode and which the
   command checks before writing (a failure exits 2). Its keys, in order:
   `format` (`1`), `repository` (`"wingfoil/wingfoil-templates"`), `install`, `packs`, `presets`,
   `transitions`.
   - `install`: the `wingfoil` values of the `compat.yaml` releases whose `capabilities` contain
     `pack-install`, in ascending semver order; `[]` when none.
   - A pack object: `id`, `catalog`, `status` (from `catalog.yaml`); `axis`, `slot` (derived from
     the id: both `null` for `base`, `slot` `null` for every pack but a phase pack); `latest` (the
     highest published version in semver order); `versions`; then, from the latest version's tag,
     `title`, `description`, `workflows` (`contents.workflows`), `memory_types` (the `types` keys
     of `fragments/memory.yaml`, `[]` when the pack ships none), `directives`
     (`contents.directives`), `parameters` (objects `name`, `type`, `default` only when there is
     one, `description`), `excerpt`; and `profiles` (the profiles of the presets whose `packs`
     name the pack, matched on the id before `@`).
   - A version object: `version`, `tag`, `wingfoil` (from `catalog.yaml`, `tag` derived), then
     from the tag's `pack.yaml` `formats`, `requires_capabilities`, `requires` (`[]` when absent),
     `conflicts` (`[]` when absent), then `readme_url` and `manifest_url` (acceptance 9).
   - A preset object, from `presets/<id>.yaml` in the working tree: `id`, `title`, `description`,
     `profile` (`null` when absent), `packs`, `url`.
   - A transition object, from its `catalog.yaml` entry: `id`, `from`, `to`, `formats`,
     `requires_capabilities`, `url`.
   - `excerpt`: the first paragraph of the README's section 2 at the latest tag, that is the first
     run of consecutive non-blank top-level text lines after the section 2 heading (not a list, a
     block quote, a code block or a heading); its lines joined by one space, inline Markdown kept
     as written; `""` when section 2 has none. Lengths count Unicode code points. Above 500, it is
     cut at the last whitespace before the 500th code point (the whitespace dropped), or hard at
     499 when there is none, and ends with `…`, 500 code points at most.
   - No field holds a date, a commit or a digest.
8. **`llms.txt` (§3.4):** a level-1 title, a one-line blockquote summary, then `## Index`
   (`catalog-index.json` and `CATALOG.md` at `main`), `## Specifications` (spec-001 and spec-002 on
   github.com at `main`) and `## Reading a pack` (the URL patterns of acceptance 9, with
   `<catalog pack id>` and `<version>` as placeholders). It does not depend on the catalog's
   content; its layout is fixed in the Design and by the expected file.
9. **URL patterns (§4),** each built by one helper, with
   `<raw> = https://raw.githubusercontent.com/wingfoil/wingfoil-templates`:
   `<raw>/main/catalog-index.json`; `<raw>/refs/tags/<tag>/packs/<catalog pack id>/README.md`
   (`readme_url`) and `…/pack.yaml` (`manifest_url`); `<raw>/main/catalog.yaml` and
   `<raw>/main/compat.yaml`; `<raw>/main/presets/<id>.yaml` and `<raw>/main/transitions/<id>.yaml`
   (the `url` fields); and, in `CATALOG.md` only, the github.com README link of acceptance 6. The
   tag is written as is (`/` and `@` included).
10. **README generated sections (§2.1, §2.2).** Between each pair the command writes, from the
    pack's own files in the working tree only (`pack.yaml`, fragments, workflows, directives,
    Memory templates):
    - `title`: `# <title>`, `description`, and `Axis: <axis>` (`Axis: foundation` for `base`,
      ` · Slot: <slot>` for a phase pack);
    - `composition`: `requires`, `conflicts`, `formats`, `requires_capabilities`; for every pack
      but `base`, the Memory types, roles and states the pack declares and the workflows it ships
      (§2.2: without telling an addition from a tightening);
    - `what-it-adds`: workflows (name, kind, phases with their roles and gates); Memory types with
      their states and gates, a type with no states of its own showing the fragment's
      `defaults.states` marked as defaults, or `—`; directives the pack ships (id, and the roles
      whose `assignments` in the pack's roles fragment name them, `global` when its `global` list
      does, `—` when none; assignments of directives the pack does not ship are not listed);
      fragments (`dna`, `roles`); Memory templates;
    - `parameters`: one table row per parameter (name, type, default or `required`, description),
      or `None.`.

    The exact layout is fixed in the Design and by the expected fixture READMEs. Every byte
    outside the pairs is unchanged. Changing `catalog.yaml`, `compat.yaml` or another pack leaves
    every README byte-identical.
11. **Freshness (CB-5).** `npm run validate` and `npm run validate:publication` run `index --check`
    as a step, in both modes, after the lint step and before the first composition. They print its
    summary line and its per-file lines. A failed check makes the command exit 1 while the later
    steps still run; an index exit 2 (for example a missing tag) makes it exit 2. A test shows
    that changing a `pack.yaml`, a fragment, a workflow or `catalog.yaml` without running the
    command makes `validate` fail, and that running it makes `validate` pass again.
12. **Committed outputs.** This repository's root holds `CATALOG.md`, `catalog-index.json` and
    `llms.txt`, generated for its empty catalog; the golden tree holds its own, and its READMEs'
    generated sections are regenerated. `tests/fixtures/index/expected/` holds the three outputs of
    the fixture catalog of acceptance 13 and the `README.md` of each of its packs, compared byte
    for byte by a test; they are refreshed only by an explicit command named in that test file,
    never by a normal test run. The test support writes the index outputs of every scratch tree
    that `validate` or `publish:pack` runs on before the tree's commit. Until plan-024 task 2b, a
    test helper runs the index and commits its outputs after each `publishByHand` and each
    `runPublish` in the tests, so that a later publication's guard (`validate:publication`, with
    `index --check`) passes; its comment says that task 2b removes it. No existing assertion is
    weakened, and no assertion on a publication's own commits changes.
13. **Tests (CB-4),** red first where the behaviour is new. The fixture catalog is a scratch git
    repository with tags holding at least: `base`; a methodology with two published versions that
    differ in a per-version field (`requires` or `requires_capabilities`); after its latest
    tag, an unreleased change of its `pack.yaml` title and README section 2 in the working tree; a
    phase pack (slot); a pack with no published version; a preset with a profile and one without; a
    transition. That catalog passes `check:packs`. A separate test alters a published version's
    `catalog.yaml` entry (for example its `requires`) after the publication and shows that the
    index still emits the tag's values. The tests check: the schema and `format: 1`; every field of acceptance 7, the
    per-version ones from each tag and the latest-version ones from the latest tag, while the
    README generated sections show the working-tree values; the `refs/tags/<tag>` URLs; the
    unlisted pack; the missing-tag and not-a-repository errors; determinism; `--check` on a fresh,
    a differing and a missing output; a README that fails task-018's rules (nothing written, exit
    1); bad usage (exit 3); the 500-code-point cut; the empty catalog; and acceptance 11.
14. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-11: independent review of the body (a subagent with its own context): approve after
  amendments; two blocking points (the inputs of an N-1 regeneration; a fixture that could not
  tell per-version fields from the tag from those in `catalog.yaml`), twelve should-fix and nits.
  It proposed a split. The approver ruled the split (the publication moves to plan-024 task 2b,
  with the N-1 point) and the github.com README link in `CATALOG.md`. Every other point is applied
  while `pending`. Re-review: two new blocking points, applied: until task 2b a test helper
  regenerates and commits the index after each publication in the tests (a second publication's
  guard would fail otherwise); the browsable fixture passes `check:packs`, and a separate test
  alters a catalog entry to show that the index reads the tag. Its should-fix on plan-024 (rows 2
  and 2b, the Context, the order) and nits are applied too.
