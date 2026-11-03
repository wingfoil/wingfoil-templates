---
id: task-075-the-matrix-seeds-the-scratch-repository-with-the-release-s-own-built-in-directive-files-as-init-writes-them-bug-010-plan-060
type: task
title: "The matrix seeds the scratch repository with the release's own built-in directive files, as init writes them (bug-010, plan-060)"
status: draft
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
ids, `src/wingfoil-builtins.ts`'s list. A composed file of the same path wins (a pack shipping a
built-in id is already a format-1 error, spec-001 §7.6). `check:runs` is not touched: its
scenarios start from the composition as the matrix does, and its adoption runs from `init`
itself; they pass on 0.3.2 (46 runs, plan-060's Context).

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named. The branch is cut from
`main` after this body's acceptance.

1. **The built-in files of a release:** a function of `src/matrix.ts`, `builtinDirectives`, given a
   release's CLI and its cache directory, runs `<cli> init --template Kanban` once in an empty
   scratch git repository (the matrix's git environment and scratch identity, no network), copies
   the `.md` files of its `.wingfoil/directives/built-in/` into
   `<cache>/<version>/built-in-directives/`, removes the scratch repository, and returns that
   directory; a later call reuses it while the release's install stamp is unchanged. A failing
   `init`, or one that writes no built-in directive, is a `MatrixIoError` naming the release and
   the reason, never a pass; no scratch path in a message.
2. **The scratch repository:** `runRelease` takes the directory of Acceptance 1 as an optional
   argument; when given, each of its files is copied to `.wingfoil/directives/built-in/<file>`
   unless the composed `.wingfoil/` already holds that path, before the commit, so HEAD holds the
   composed `.wingfoil/` and those files. Without it, `runRelease` behaves as today.
3. **Its callers:** `validate` (every mode, the overlays included) passes the directory for every
   release it installs; when a test replaces the install (`ValidateOptions.install`), no seeding
   happens unless the test gives the directory too (`ValidateOptions.builtins`), so the stubbed
   tests of `validate.test.ts` keep their meaning.
4. **The tests, red first** (dl-018 R1–R3), in `tests/matrix.test.ts`:
   - `runRelease` with a seed directory: a stub CLI that checks the files exits 0 only when
     `.wingfoil/directives/built-in/security.md` is committed at HEAD with the seed's content;
   - a composed file of the same path is kept, not overwritten;
   - without a seed, the scratch repository holds the composed `.wingfoil/` only (the W-10 test,
     its title extended, unchanged otherwise);
   - `builtinDirectives` with a stub CLI whose `init` writes two files: they are copied and the
     directory returned; a second call does not run `init` again; a stub whose `init` exits 1, or
     writes no file, gives a `MatrixIoError` naming the release;
   and in `tests/validate.test.ts`, one test that a given `builtins` reaches `runRelease` (a stub
   CLI failing `directives list` unless the seeded file is present). The red commit adds the tests
   and a `builtinDirectives` that returns an empty directory and a `runRelease` that ignores the
   argument, so that the build passes and the new tests fail on behaviour; the failing count
   recorded.
5. **The real engine:** on this branch, `npm run validate` (18 runs), the golden step (26 runs,
   0.2.2 tolerated and 0.3.1), the three overlays (26 each), `npm run validate:publication` (18),
   each 0 failed: nothing changes on the releases listed today. Then, on a scratch copy of
   task-074's branch merged with this one, the golden tree on 0.3.2 in both modes: 26 runs, 0
   failed; recorded.
6. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other, on the same
   commit: `npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`,
   `index -- --check`, `validate`, the golden step, the three overlays, `workflow list`,
   `check:runs`, `validate:publication` and `npm audit` in the root and in every matrix folder exit
   0; the branch CI `success`, recorded; after the merge, `main`'s CI read. `src/matrix.ts`'s
   header comment and spec-001 §12's account of the matrix, if it says the scratch repository
   holds the composed `.wingfoil/` alone, updated (the text amended in place, the merge OK
   approving it).

Out of scope: `check:runs` (`src/runs.ts`); the golden fixture (unchanged); a feedback note (the
behaviour is WingFoil's documented fix).

## Design

Branch `task/task-075-matrix-builtin-directives` from `main`. A tooling task (dl-018 R1–R3).

- `src/matrix.ts`: `builtinDirectives(cli: string, version: string, cache: string): string`, its
  stamp the install's (`.lockfile-sha256`) copied beside the files; `runRelease(cli, composed,
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
