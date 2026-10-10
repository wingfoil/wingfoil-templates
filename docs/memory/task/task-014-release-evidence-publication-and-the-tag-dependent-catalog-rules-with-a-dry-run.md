---
id: task-014-release-evidence-publication-and-the-tag-dependent-catalog-rules-with-a-dry-run
type: task
title: "Release evidence, publication and the tag-dependent catalog rules, with a dry run"
status: in-progress
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
- **`pack-release-cycle`:** `validate` records the evidence before the approval gate; `publish`
  tags, then updates `catalog.yaml` in a later commit, then pushes (by hand).

**The dry run,** as the approver ruled on 2026-10-10. Publication mode cannot pass today: no
WingFoil release in `compat.yaml` has `format_key: true` (dl-009). So the whole publication path is
proven in the tests, in a scratch git repository built from a fixture, against a stub WingFoil
declared as a fictional release with `format_key: true` in a **fixture** `compat.yaml` only, never
in the real one. A real dry run on the golden tree, with the real `compat.yaml`, stops as designed
at `no compatible release (publication)` and writes no evidence. Real evidence waits for WingFoil
v0.3 and its intake.

Not in scope: the feedback note on publication (plan-015 task 12); the line policy (plan-015 task
13); pushing (the workflow's manual step); the index (wave W14); creating or moving the
`pack-release` Memory element (the workflow's CLI verbs).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network.
2. **Evidence, in `pack-release-cycle` › `validate`, before the approval gate:**
   `npm run validate:publication -- --evidence [other options]` writes, after the report, the
   `## Validation` section of a `pack-release` element (`src/evidence.ts`): the validated commit,
   the command, the mode, every WingFoil version run with the command lines and their results, the
   compositions, and the exit code. The writer **refuses** (exit 1, no section) a result whose mode
   is not `publication`, that applied a tolerance, or whose code is not 0. `--evidence` exists only
   on `validate:publication`; no option or environment variable of any command selects another mode.
3. **Compositions validated for a pack:** every preset of the tree, plus each combination given as
   entries (the documented combinations, `pack-compatibility`). At least one of them must contain
   the pack, or the command exits 1 naming the pack.
4. **`npm run publish:pack -- --pack <catalog pack id> [--tree <dir>] [--param <name>=<value>]…
   [--dry-run]`**, in `publish`, after the approval:
   - `--tree` must be the top level of a git repository (otherwise exit 3); its working tree must be
     clean: no tracked change and no untracked file that is not ignored;
   - checks that `pack.yaml`'s `version` is higher than every version of the pack in
     `catalog.yaml` (one living line, before WingFoil 1.0; maintenance lines are plan-015 task 13),
     that the tag `<id>@<version>` does not exist, and that `CHANGELOG.md` has an entry, a line
     starting `- <version>:`;
   - re-runs the publication validation of acceptance 3 at `HEAD` as a guard, and stops (exit 1)
     when it fails;
   - creates the annotated, unsigned tag `<id>@<version>` at `HEAD`, whose message is the tag name
     followed by the CHANGELOG entry; computes its digest (§13) and its `wingfoil` range (§12),
     refusing an empty range; for a stage pack, the `transitions` map (transition id → the §14
     digest of `transitions/<id>.yaml` at the tag) of the transitions whose `to` is the pack;
   - adds, in a new commit `catalog: <id>@<version>` that changes `catalog.yaml` only and keeps its
     comments, the version entry (`version`, `commit`, `digest`, `formats`,
     `requires_capabilities`, `requires`, `conflicts`, `wingfoil`, and `transitions` for a stage
     pack), and the first time the pack entry (`id`, `path: packs/<id>`, `catalog: official`,
     `status: active`, `versions`); nothing under `packs/` changes;
   - leaves `CATALOG.md` and `catalog-index.json` unchanged, and prints the line the element's
     Execution Notes record (plan-023);
   - prints the `## Publication` section: tag, commit, digest, range, transitions;
   - never pushes;
   - the tag and the commit use the caller's git identity (author, committer, tagger), read before
     the tooling's git environment is closed (`src/git.ts`); the tests pin the `GIT_*_DATE`
     variables and a test identity;
   - `--dry-run` does all of this in a temporary clone, tags included, with the matrix cache inside
     it, and deletes it; the repository's tracked and untracked files, refs and tags are left as
     they were, which a test checks;
   - npm's own `--dry-run` would swallow the option when typed without `--`, so the command refuses
     (exit 3) when `npm_config_dry_run` is set and `--dry-run` is not among its arguments.
5. **Tag-dependent catalog rules** in `npm run check:packs` (spec-001 §18), each a rule id with a
   passing and a failing test on a scratch git repository: `catalog-tag` (the version's tag exists
   and is annotated), `catalog-commit` (`commit` is the tag's target), `catalog-digest` (the digest
   recomputes), `catalog-manifest` (`version`, `formats`, `requires_capabilities`, `requires`,
   `conflicts` equal the tagged `pack.yaml`), `catalog-range` (`wingfoil` recomputes from
   `compat.yaml`), `catalog-transition-digest` (a stage version's transition digests recompute at
   its tag). A tree that is not a git repository and has published versions in its catalog is an I/O
   error (exit 2). On this repository (no tag, no pack) they find nothing.
6. **The dry run, in the tests (W7 exit criterion, except the note):** a scratch git repository from
   a fixture tree with a pack and a fixture `compat.yaml` listing a fictional release with
   `format_key: true`. The stub WingFoil for that release is injected only through the in-process
   `install` option (task-011): no CLI option or environment variable. The evidence, then the
   publication of a first version and of a stage pack with a transition, produce the annotated tag,
   the catalog entry with commit, digest and range, and the evidence; afterwards `runCheckPacks`
   (with the rules of acceptance 5) and `runValidate` in publication mode with the stub pass.
7. **A real dry run,** recorded in the Execution Notes: the golden tree copied into a scratch git
   repository with this repository's `compat.yaml`, then `npm run publish:pack -- --tree <scratch>
   --pack <a golden pack> --param project_name=Golden --dry-run`, exits 1 with `no compatible
   release (publication)`, and creates no tag and no commit.
8. **Failure paths,** each with a test, exit 1 naming the cause: a dirty working tree, a version not
   above the catalog's, an existing tag, a missing `CHANGELOG.md` entry, no composition containing
   the pack, a refused evidence, an empty range; exit 2 on an I/O or git error; exit 3 on bad usage,
   a `--tree` that is not the repository's top level, and npm's swallowed `--dry-run`.
9. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-014-publish`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`. Built in three commits, each green on its own.

- **`src/evidence.ts`:** `writeEvidence(result, { commit, command })` returns the `## Validation`
  section or throws `EvidenceError` (mode not publication, a tolerance applied, code not 0).
  `src/validate-publication-cli.ts` takes `--evidence` out of its arguments before `runValidate`,
  reads `HEAD` of the tree (not a git repository: exit 2) and prints the section after the report.
- **`src/git.ts`:** `runGit` gains an optional environment to add; `callerIdentity(repo)` reads
  `user.name` and `user.email` with the caller's own git configuration, and keeps the caller's
  `GIT_AUTHOR_*`, `GIT_COMMITTER_*` and their `_DATE`, before the tooling's environment closes it.
- **`src/tag-rules.ts`:** the rule group of acceptance 5, registered in `check-packs.ts` after the
  tree rules; it reads the tag with `git cat-file -t` (annotated: `tag`) and `rev-parse
  <tag>^{commit}`, the tagged `pack.yaml` with `git show`, and reuses `packDigest`,
  `transitionDigest` and `computeRange`.
- **`src/catalog-edit.ts`:** `addVersion(text, packId, versionEntry, newPack?)` rewrites only the
  `packs:` block of `catalog.yaml` (from its key to the end of its value, located with the YAML
  document's ranges) as a block sequence written by `toYaml`; every other byte, comments included,
  is kept, which a test checks.
- **`src/publish.ts`:** `runPublish(argv, { install? })`: the checks of acceptance 4, the guard
  validation (`runValidate` in publication mode, with `install` for the tests only), the tag, the
  digest and range, the catalog commit; `--dry-run` clones the repository with its tags into a
  temporary directory (`git clone --no-local`), runs there with the matrix cache inside it, and
  removes it. `src/publish-cli.ts` is `npm run publish:pack`, with the `npm_config_dry_run` guard.
- **Tests,** red first: `tests/evidence.test.ts`, `tests/tag-rules.test.ts`,
  `tests/catalog-edit.test.ts`, `tests/publish.test.ts` (scratch repositories through
  `tests/support/git-repo.ts`, a fixture pack, a fixture `compat.yaml` with the fictional release
  `9.0.0`, `format_key: true`, and the stub WingFoil of task-011).

Commits: (1) evidence and `validate:publication --evidence`; (2) the tag-dependent catalog rules;
(3) the catalog edit, `publish:pack` and the dry run.

## Execution Notes

- 2026-10-10: amended while `pending`, before the approver's review, after an independent review
  (a subagent with its own context): the evidence written in `validate`, before the gate, and
  `publish` re-validating as a guard; the caller's git identity and pinned test dates; `--tree` as
  the repository's top level; the compositions validated for a pack; the stub injected in-process
  only; the script named `publish:pack`, refusing npm's swallowed `--dry-run`; stage transitions,
  the first pack entry, the CHANGELOG entry form, an empty range, `version` in
  `catalog-manifest`, a defined clean tree, the cache inside the dry run's clone.
- 2026-10-10, build on `task/task-014-publish`, as `developer`: `c16cf33` the evidence writer and
  `validate:publication -- --evidence`; `3a277af` the tag-dependent catalog rules; `caa04d5`
  `publish:pack`, the catalog edit and the dry run in the tests; `81063cc` the validation before
  the range check, and the CHANGELOG entry form. 584 tests, ESLint, `check:pins`, `check:packs`.
- Real dry run (acceptance 7): the golden tree copied into a scratch git repository with this
  repository's `compat.yaml` and `.gitattributes`, then `npm run publish:pack -- --tree <scratch>
  --pack methodology/kanban --param project_name=Golden --dry-run`: exit 1,
  `matrix presets/golden.yaml: no compatible release (publication)`, "the publication validation
  failed; no tag"; the scratch repository kept one commit, no tag and a clean status.
- Deviations:
  - acceptance 5: a catalog with published versions on a tree that is not the top level of a git
    repository is one `catalog-tag` problem (exit 1), not an I/O error (exit 2): the lint never
    passes it and its other problems stay visible; the lint tests' trees, which are not
    repositories, then keep their own rules;
  - `transition-stages` (task-012) accepts a stage pack of the tree as well as of the catalog: a
    transition is published with its target stage's first release (spec-001 §14), before that
    stage is in `catalog.yaml`, so the stricter reading made such a publication impossible;
  - acceptance 4: a CHANGELOG entry is a line `- <version>`, alone or followed by `:` or a space,
    the form the golden fixture writes; the range check runs after the guard validation, so the
    real dry run reports `no compatible release (publication)` as acceptance 7 expects;
  - the tests were written with each module rather than strictly before it.

