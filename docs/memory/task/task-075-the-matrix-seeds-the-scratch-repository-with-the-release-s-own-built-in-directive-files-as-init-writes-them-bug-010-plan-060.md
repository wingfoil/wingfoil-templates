---
id: task-075-the-matrix-seeds-the-scratch-repository-with-the-release-s-own-built-in-directive-files-as-init-writes-them-bug-010-plan-060
type: task
title: "The matrix seeds the scratch repository with the release's own built-in directive files, as init writes them (bug-010, plan-060)"
status: done
pack: ""            # tooling task (bug-010, plan-060)
depends_on: []
tags: ["tooling","matrix","wingfoil"]
---

## Context

bug-010's fix, ruled by the approver on 2026-11-03 (plan-060): the matrix's scratch repository
holds the composed `.wingfoil/` alone, without the built-in directive files a project `init`
created holds, so on WingFoil 0.3.2 a composition binding a built-in directive (spec-001 §7.4
allows it; the golden fixture's `base` binds `security` and `testing`) fails `directives list`.
task-074 (the record of 0.3.2) waits for this task's merge.

The fix makes the scratch repository hold, beside the composed `.wingfoil/`, the release's own
built-in directive files as its `init` writes them. They are taken from the release itself, not
copied into this repository: `init` of every listed release (0.2.2 … 0.3.2) writes the same six
ids, `src/wingfoil-builtins.ts`'s list, each release its own content (0.3.x adds `format: 1`), so
the files are taken per release. A composed file of the same path wins, a safeguard `validate`
cannot reach (a pack shipping a built-in id is refused by the lint, spec-001 §7.6, O5).
`check:runs` is not touched: it never runs `directives list`, its scenarios are the published
examples (no published pack binds a built-in), and its adoption runs start from `init` itself;
they pass on 0.3.2 (46 runs, plan-060's Context).

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named. The branch is cut from
`main` after this body's acceptance.

1. **The built-in files of a release:** a function of `src/matrix.ts`,
   `builtinDirectives(version, cli, cache)`, runs `<cli> init --template Kanban` once in an empty
   scratch git repository whose local configuration holds `SCRATCH_IDENTITY`'s name and email and
   `commit.gpgSign false` (WingFoil's own `git commit` reads no `-c` argument; under the matrix's
   git environment `init` otherwise exits 1, "git identity not configured", on every release), with
   `cliEnvironment()` and `COMMAND_TIMEOUT_MS`, no network; it copies the `.md` files of the
   scratch `.wingfoil/directives/built-in/` into `<cache>/<version>/built-in-directives/`, writes
   the release's install stamp (`.lockfile-sha256`) there last, removes the scratch repository, and
   returns that directory. A later call reuses it while that stamp equals the install's; with no
   install stamp (a cache `installRelease` did not make), `init` runs every time and nothing is
   reused. A reinstall removes the directory anyway (`installRelease` clears the version's
   folder). A failing `init`, or one that writes no built-in directive, is a `MatrixIoError`
   naming the release and the reason, never a pass; no scratch path in a message (`init`'s output
   names it).
2. **The scratch repository:** `runRelease` takes the directory of Acceptance 1 as an optional
   argument; when given, each of its files is copied to `.wingfoil/directives/built-in/<file>`
   unless the composed `.wingfoil/` already holds that path, before the commit, so HEAD holds the
   composed `.wingfoil/` and those files. Without it, `runRelease` behaves as today.
3. **Its callers:** `validate` (every mode, the overlays included) passes the directory for every
   release it installs; when a test replaces the install (`ValidateOptions.install`), no seeding
   happens unless the test gives the directory too (`ValidateOptions.builtins(version, cli)`), so
   the stubbed tests of `validate.test.ts` keep their meaning.
4. **The tests, red first** (dl-018 R1–R3), in `tests/matrix.test.ts`:
   - `runRelease` with a seed directory: a stub CLI that checks the files exits 0 only when
     `.wingfoil/directives/built-in/security.md` is committed at HEAD with the seed's content;
   - a composed file of the same path is kept, not overwritten;
   - without a seed, the scratch repository holds the composed `.wingfoil/` only (the W-10 test,
     its title extended, unchanged otherwise);
   - `builtinDirectives` with a stub CLI whose `init` writes two files, and exits 1 unless
     `git config user.name` is set inside its repository, the stub's check run under the matrix's
     environment (global configuration closed, `GIT_CONFIG_GLOBAL` an empty file in the test), so
     a developer's own identity cannot satisfy it: the files are copied and the directory
     returned; with an install stamp, two calls run `init` once (a counter file equal to 1 after
     both); a stub whose `init` exits 1, or writes no file, gives a `MatrixIoError` naming the
     release;
   and in `tests/validate.test.ts`, one test that a given `builtins` reaches `runRelease` (a stub
   CLI failing `directives list` unless the seeded file is present). The red commit adds the tests
   and a `builtinDirectives` that returns an empty directory, a `runRelease` that ignores the
   argument and a `ValidateOptions.builtins` accepted and unused, so that the build passes and the
   new tests fail on behaviour; the failing count recorded. Expected to pass at red, and said so:
   the no-seed W-10 test and "a composed file is kept" (checked instead by a mutation, the copy
   overwriting, which must make it fail, recorded).
5. **The real engine:** on this branch, `npm run validate` (18 runs), the golden step (26 runs,
   0.2.2 tolerated and 0.3.1), the three overlays (26 each), `npm run validate:publication` (18),
   each 0 failed: nothing changes on the releases listed today. Then, on a scratch copy of
   task-074's branch merged with this one, the golden tree on 0.3.2 in both modes: 26 runs, 0
   failed; recorded.
6. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other, on the same
   commit: `npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`,
   `index -- --check`, `validate`, the golden step, the three overlays, `workflow list`,
   `check:runs`, `validate:publication` and `npm audit` in the root and in every matrix folder exit
   0; the branch CI `success`, recorded; after the merge, `main`'s CI read.
7. **The texts:** `src/matrix.ts`'s header comment and the directive `pack-compatibility`
   (`.wingfoil/directives/custom/pack-compatibility.md`: "each composed `.wingfoil/`, committed in a
   scratch repository" gains "with the release's own built-in directive files, as its `init`
   writes them"; the directive carries no version line); the `wingfoil-cli` directive's W-11
   workaround noting that the matrix reads the built-ins of each release from its `init`, its
   version and date raised (1.5 → 1.6). task-074's §12 paragraph on 0.3.2 says the same, in
   task-074's own text, not part of this Acceptance.

Out of scope: `check:runs` (`src/runs.ts`); the golden fixture (unchanged); a feedback note (the
behaviour is WingFoil's documented fix).

## Design

Branch `task/task-075-matrix-builtin-directives` from `main`. A tooling task (dl-018 R1–R3).

- `src/matrix.ts`: `builtinDirectives(version: string, cli: string, cache: string): string`, its
  stamp the install's (`.lockfile-sha256`) written last beside the files; `runRelease(cli, composed,
  release, mode, builtins?)`, the copy after `cpSync` of the composed `.wingfoil/` and before
  `git add` (which adds `.wingfoil` as a whole).
- `src/validate.ts`: `ValidateOptions.builtins?: (version: string, cli: string) => string |
  undefined`; the default runs `builtinDirectives` when `install` is not replaced, and returns
  `undefined` when it is; the matrix's `cli(version)` keeps the result per release beside the CLI;
  a `MatrixIoError` from it is that release's I/O failure, as an install's.
- Red commit (`test(matrix): red first, …`), then the implementation (`fix(matrix): …`), then the
  texts.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-03: independent review of the body: approve after amendments, nothing blocking; it
  reproduced the defect and ran the fix as a patch of the built `runRelease` on task-074's branch
  (golden tree 26 runs, 0 failed in both modes; `validate` and `validate:publication` 18, the
  overlays 26 each, 0 failed). Applied: `init`'s git identity in the scratch repository's own
  configuration, with a test; the red commit declaring `ValidateOptions.builtins`; the tests
  passing at red named, the reuse test counting `init`, the composed-file test by mutation; the
  directive `pack-compatibility` and W-11 named; the cache stamp written last and its absence; the
  arguments' order; the composed-file case unreachable through `validate`. Not applied: comparing
  each release's ids with `BUILTIN_DIRECTIVE_IDS` (optional, out of this fix's scope).
- 2026-11-03: re-review: approve after amendments, nothing blocking; applied: the version raise
  moved to `wingfoil-cli` (1.5 → 1.6), `pack-compatibility` having no version line; task-074's §12
  paragraph out of this Acceptance; the identity test under the matrix's environment. Submitted.
- 2026-11-03, red first (dl-018 R1), at `8d93af4` (the tests, a `builtinDirectives` returning an
  empty directory, `runRelease` ignoring its argument, `ValidateOptions.builtins` declared):
  `node --test dist/tests/matrix.test.js`: 47 tests, 43 pass, 4 fail (the seeded commit and the
  three `builtinDirectives` tests); the `validate.test` seed test: 1 of 1 fails. Passing at red, as
  the Acceptance says: the W-10 test and "keeps a composed file of the same path".
- 2026-11-03, green at `91c6007`: `node --test dist/tests/matrix.test.js
  dist/tests/validate.test.js`: 107 of 107. Mutation (R2): the copy overwriting a composed file
  makes "keeps a composed file of the same path" fail (0 of 1), restored. Texts at `f99bf89`:
  `src/matrix.ts`'s header, `pack-compatibility`, `wingfoil-cli` 1.6 (W-11).
- 2026-11-03: independent build review: approve after amendments, nothing blocking; it ran the
  tests, the lint, `builtinDirectives` on the real 0.2.2 and 0.3.2 (six files each, the stamp
  reused) and a mutation of the identity (the two success tests fail). Applied: `runRelease`'s
  doc comment back above it; a test that the scratch path is hidden in a failing `init`'s message
  (mutation: without `hideScratch` it fails); a `validate` test that a release whose built-in
  directives cannot be read is that release's I/O failure (exit 2, 13 of 26 failed). Not applied:
  a more telling reason than the last stderr line (the pattern `installRelease` and `runRelease`
  share). `matrix.test`: 48 of 48; the two `validate` tests of bug-010: 2 of 2.
- 2026-11-03, checks at `3c89e70` (Acceptance 5, 6): from clean clones on Node.js 22.21.0, then
  22.12.0, one after the other: `npm ci`, `npm test` (1051 of 1051), `lint`, `check:pins`,
  `check:schemas`, `check:packs`, `index -- --check`, `validate` (18 runs), the golden step (26
  runs, 0.2.2 tolerated and 0.3.1) and its publication run (26), the overlays `software-exit`,
  `scrum-exit` and `kanban-exit` (26 each), `workflow list`, `check:runs` (46 runs),
  `validate:publication` (18), each exit 0 with 0 failed; `npm audit` 0 in the root and every matrix
  folder; `packs/` unchanged. Nothing changes on the releases listed today. Branch CI run
  41667034563 on `3c89e70`: `success`.
- 2026-11-03, Acceptance 5's second half: task-074's branch merged with this one in scratch clones,
  on both Node.js versions: the golden tree on 0.3.2, 26 runs, 0 failed in self-test (0.2.2
  tolerated) and in publication; with it `validate` and `validate:publication` 18, the overlays 26
  each, `check:runs` 46 (on 0.3.0 and 0.3.2), `npm test` 1051 of 1051, the 0.3.2 lockfile audited
  0. bug-010 is fixed.
