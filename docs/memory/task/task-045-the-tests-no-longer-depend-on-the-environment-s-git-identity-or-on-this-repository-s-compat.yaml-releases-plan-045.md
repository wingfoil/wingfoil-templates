---
id: task-045-the-tests-no-longer-depend-on-the-environment-s-git-identity-or-on-this-repository-s-compat.yaml-releases-plan-045
type: task
title: "The tests no longer depend on the environment's git identity or on this repository's compat.yaml releases (plan-045)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-045 step 5, ruling I)
depends_on: []
tags: ["tooling","tests"]
---

## Context

plan-045's step 5 (ruling I: one task for both): two ways the suite depends on its environment
rather than on its fixtures, found in plan-044 (task-040's publication runs and its review).
- **The git identity.** `isolatedGitEnv` (`tests/support/git-repo.ts`) gives a test repository its
  own global configuration but spreads `process.env` whole, so `GIT_AUTHOR_NAME`,
  `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME` and `GIT_COMMITTER_EMAIL`, when set, override it:
  `tests/publish.test.ts`'s "tags and commits as the caller, unsigned, with the dates the caller
  pins" then fails (task-040's first publication run, 939 of 940). A developer or a CI that sets
  them gets a red suite with nothing wrong.
- **This repository's `compat.yaml`.** `tests/check-packs.test.ts` (its `lint` helper),
  `tests/example-rules.test.ts` and `tests/readme-rules.test.ts` (its default `repository`
  variant, and `pack-install` built from it) copy the real file into their trees. A WingFoil
  intake that appends a release moves what they lint: a release that provides `pack-install`
  turns spec-002 §2.3's temporary mark from required to refused, and `readme-rules` fails with
  nothing wrong in the tooling. task-040 removed the same dependency on `catalog.yaml`; the real
  `compat.yaml` stays checked by `tests/compat.test.ts`, by the lint and by the matrix.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **The identity.** `isolatedGitEnv` drops `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`,
   `GIT_COMMITTER_NAME` and `GIT_COMMITTER_EMAIL` from the inherited environment (the dates stay:
   tests pin them explicitly); no file under `src/` changes, `src/git.ts`'s caller identity
   included.
2. **A fixture `compat.yaml`**, `tests/fixtures/compat/compat.yaml`, a byte copy of today's real
   file (0.2.2 and 0.3.0); `tests/support/paths.ts` exports its path. A drift test holds that the
   real file starts with the fixture's `format`, `kinds` and `capabilities` and lists every
   fixture release unchanged, so an intake that appends a release moves no test, and one that
   changes a recorded release or the vocabulary updates the fixture knowingly.
3. **The copies:** `tests/check-packs.test.ts`, `tests/example-rules.test.ts` and
   `tests/readme-rules.test.ts` take the fixture; no test but `tests/compat.test.ts` and the
   drift test reads this repository's `compat.yaml` into a tree; the tests that read this
   repository as a whole keep doing so. Their assertions do not change.
4. **Red first** (dl-018), the red runs recorded:
   - a test that sets the four variables in the environment it gives `isolatedGitEnv` (or in
     `process.env`, restored after) and asserts the repository's commits carry the test identity;
   - a guard, as task-040's, that fails on a read of `REPO_ROOT`'s `compat.yaml` outside its
     allowlist, red on the three files;
   - a simulated intake: the suite run on a scratch clone whose `compat.yaml` gains a release
     with `pack-install`, failing before the fix and passing after (a recorded run, as task-040's
     publication).
5. **Green:** the whole suite passes, also with the four variables set in the shell; from clean
   clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`, `check:pins`,
   `check:schemas`, `check:packs`, `validate`, `index -- --check` and `workflow list` exit 0;
   `compat.yaml`, `src/`, `packs/` and the expected fixtures unchanged; the CI run on the branch
   `success` and recorded; after the merge, `main`'s CI too.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
