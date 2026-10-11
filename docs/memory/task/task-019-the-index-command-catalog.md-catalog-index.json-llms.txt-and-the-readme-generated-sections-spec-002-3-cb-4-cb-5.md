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
- **plan-023:** until `npm run index` exists, `pack-release-cycle` › `publish` (v4) and
  `npm run publish:pack` leave `CATALOG.md` and `catalog-index.json` unchanged and record the skip.
  This task removes that rule from both;
- **task-018:** `readmeOutline` (`src/readme.ts`) is the one reading of a README's structure; the
  index rewrites between exactly the pairs the README lint accepts.

Ruled by the approver on 2026-10-11, **spec-002 P2:** `excerpt` carries the first paragraph of
section 2 only, not the adoption profiles as text; the profiles are the pack object's own field
`profiles`, which search reads (plan-024 task 6).

Facts the Acceptance relies on:
- a `catalog.yaml` version entry has no `tag` field (spec-001 §11): the tag is
  `<catalog pack id>@<version>` (spec-001 §4, dl-004), and the index derives it;
- a pack whose catalog entry has no version (status `planned`) or that has no catalog entry is not
  listed (§3.1); presets and transitions are listed whenever `catalog.yaml` indexes them;
- this repository holds no pack yet: its committed `CATALOG.md`, `catalog-index.json` and
  `llms.txt` describe an empty catalog. The golden tree (`tests/fixtures/compose/tree`) indexes one
  preset and no published pack; CI validates it, so it gets its own outputs and regenerated README
  sections. The fixture catalog with tagged versions that CB-4 needs is built in the tests as a git
  repository (`tests/support/published-repo.ts`), and its expected outputs are committed so that a
  reader can browse them (W14's exit criterion).

Not in scope:
- the agent procedure in `CATALOG.md` › "For agents" and `llms.txt`, and the offline tests of every
  URL pattern (CB-6): plan-024 task 3. Here the files carry the URL patterns §3.2 item 7 and §3.4
  name, and the tests check the fields CB-4 names;
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
   working directory:
   - it writes `CATALOG.md`, `catalog-index.json` and `llms.txt` at the tree's root, and the
     generated sections of the README of every pack under `packs/` whose `pack.yaml` passes its
     schema; it reports `index: wrote <n> files, <m> unchanged`;
   - before writing it runs the README rules of task-018 on those READMEs; a README that fails them
     is reported in the lint's form and nothing is written (exit 1);
   - `--check` writes nothing; it reports `index: <n> files up to date` and exits 0, or one line
     per output that is missing or differs, `<file>: not up to date: run npm run index`, and exits
     1;
   - exit codes: 1 a check fails, 2 an I/O or git error, 3 bad usage.
4. **Determinism (§3.1).** Two runs on the same tree are byte-identical. Packs, versions, presets
   and transitions are in ascending byte order of their ids, versions in semver order; parameters
   and every list of names in ascending byte order; LF line endings and a final newline; JSON with
   two-space indentation and the key order of §3.3. No clock, no randomness, no environment value
   enters an output.
5. **Published data (§3.1).** A published version is a `versions[]` entry of `catalog.yaml`; its
   `version` and `wingfoil` come from `catalog.yaml` in the working tree, its tag is
   `<catalog pack id>@<version>`, and every field §3.3 takes from `pack.yaml` or the README is read
   at that tag (`git show <tag>:<path>`), never from the working tree. A tag that is missing, or a
   tree that is not a git repository while `catalog.yaml` lists a published version, exits 2 naming
   the tag. A pack with no published version is not listed in `CATALOG.md` or
   `catalog-index.json`.
6. **`CATALOG.md` (§3.2),** in this order:
   1. a level-1 title and one paragraph saying what the catalog is and that the file is generated
      by `npm run index`;
   2. `## Install`, anchored `install`: the `compat.yaml` releases whose `capabilities` contain
      `pack-install`, or the sentence that no released WingFoil installs packs yet and that each
      README's section 3 gives the temporary hand steps;
   3. one section per axis, `base` first, then the axes in `catalog.yaml` order: a table with the
      columns Pack, Summary, Slot (phase only), Status, Latest, WingFoil, README; Pack is the id,
      preceded by `<a id="pack-<id with / replaced by ->"></a>`; Summary is the first sentence of
      the latest version's `description`; Latest and WingFoil are the last published version and
      its computed range; README links
      `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/tags/<tag>/packs/<catalog pack id>/README.md`
      (§4, the latest version's tag); every URL comes from one helper, so that plan-024 task 3
      tests one pattern per use. An axis with no published pack holds the line
      `None published yet.`;
   4. `## Presets`: id, title, profile, packs;
   5. `## Transitions`: id, from, to;
   6. `## Profiles`: each profile named by a preset, with the packs of the presets that name it;
   7. `## For agents`: the URL patterns of §4 and a relative link to `llms.txt`.

   Sections 4–6 hold `None yet.` when empty.
7. **`catalog-index.json` (§3.3).** It validates against `index/catalog-index.schema.json` (JSON
   Schema 2020-12, outside `schema/`), which the command checks before writing (a failure is exit
   2, a defect of the tool). Its keys, in order: `format` (`1`), `repository`
   (`"wingfoil/wingfoil-templates"`), `install`, `packs`, `presets`, `transitions`, with the pack,
   version, preset and transition objects and their key order exactly as §3.3 lists them:
   - `axis` and `slot` derived from the id, both `null` for `base`, `slot` `null` for every pack
     but a phase pack; `latest` the highest published version in semver order;
   - `title`, `description`, `workflows` (`contents.workflows`), `memory_types` (the `types` keys
     of `fragments/memory.yaml`, none when the pack has no memory fragment), `directives`
     (`contents.directives`) and `parameters` (`name`, `type`, `default` only when there is one,
     `description`) from the latest version's tag;
   - `excerpt`: the first paragraph of the README's section 2 at the latest tag, its lines joined
     by one space, inline Markdown kept as written; when longer than 500 characters it is cut at
     the last whitespace before the limit and ends with `…`, 500 characters in all (P2: no profile
     text);
   - `profiles`: the profiles of the presets whose `packs` name the pack, sorted, unique;
   - `readme_url` and `manifest_url` pinned with `refs/tags/<tag>` (§4); preset and transition
     `url` at `main` (§4);
   - no field holds a date, a commit or a digest.
8. **`llms.txt` (§3.4):** a level-1 title, a one-line blockquote summary, then `## Index`
   (`catalog-index.json` and `CATALOG.md` at `main`), `## Specifications` (spec-001 and spec-002,
   at `main` on github.com) and `## Reading a pack` (the URL patterns of §4 with `<catalog pack id>`
   and `<version>` as placeholders). It does not depend on the catalog's content.
9. **README generated sections (§2.1, §2.2).** Between each pair the command writes, from the
   pack's own files in the working tree only (`pack.yaml`, fragments, workflows, directives, Memory
   templates):
   - `title`: `# <title>`, `description`, and `Axis: <axis>` (`Axis: foundation` for `base`,
     ` · Slot: <slot>` for a phase pack);
   - `composition`: `requires`, `conflicts`, `formats`, `requires_capabilities`; for every pack but
     `base`, the Memory types, roles and workflows the pack declares (§2.2: without telling an
     addition from a tightening);
   - `what-it-adds`: workflows (name, kind, phases with their roles and gates), Memory types
     (states and gates), directives (id, and the roles whose `assignments` in the roles fragment
     name them, or `global`), fragments (`dna`, `roles`), Memory templates;
   - `parameters`: one table row per parameter (name, type, default or `required`, description),
     or `None.`.

   The exact layout is fixed in the Design and by the expected fixture READMEs. Every byte outside
   the pairs is unchanged. Changing `catalog.yaml`, `compat.yaml` or another pack leaves every
   README byte-identical.
10. **Freshness (CB-5).** `npm run validate` and `npm run validate:publication` run `index --check`
    as a step, in both modes, with one report line, and fail when it fails. A test shows that
    changing a `pack.yaml`, a fragment, a workflow or `catalog.yaml` without running the command
    makes `validate` fail, and that running it makes `validate` pass again.
11. **Publication (plan-023 removed).** `npm run publish:pack` regenerates `CATALOG.md` and
    `catalog-index.json` and commits them with `catalog.yaml` in the catalog commit, on the current
    line and on an N-1 line (whose catalog commit is made on `main` with plumbing, task-016), and
    with `--dry-run`; its report no longer prints the skip line. It changes no file under `packs/`
    and leaves `llms.txt` unchanged. `pack-release-cycle` › `publish` drops the plan-023 sentences
    and its `version:` goes 4 → 5 (`doc-versioning`); the includes are checked by hand
    (`wingfoil-cli` W-08); `npm run -s wingfoil -- workflow list` exits 0 with empty stderr apart
    from the known W-01 warnings.
12. **Committed outputs.** This repository's root holds `CATALOG.md`, `catalog-index.json` and
    `llms.txt`, generated for its empty catalog; the golden tree holds its own, and its READMEs'
    generated sections are regenerated. `tests/fixtures/index/expected/` holds the outputs of the
    fixture catalog with tagged versions (below), compared byte for byte by a test.
13. **Tests (CB-4).** The fixture catalog is built in a scratch git repository with tags and holds
    at least: `base`; a methodology with two published versions whose tagged `pack.yaml` differ (a
    title or a parameter), so that per-version fields provably come from each tag and latest-version
    fields from the latest; a phase pack (slot); a pack with no published version (not listed); a
    preset with a profile; a transition. The tests check the schema, `format: 1`, every field of
    §3.3 on it, the `refs/tags/<tag>` URLs, the missing-tag error, determinism, `--check` on both
    sides, the README rewrite (inside and outside the pairs), the empty catalog, and acceptance 10
    and 11. Written red first where the behaviour is new.
14. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
