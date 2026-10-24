---
id: task-045-the-tests-no-longer-depend-on-the-environment-s-git-identity-or-on-this-repository-s-compat.yaml-releases-plan-045
type: task
title: "The tests no longer depend on the environment's git identity or on this repository's compat.yaml releases (plan-045)"
status: backlog
pack: ""            # tooling task (tooling-change › deliver, plan-045 step 5, ruling I)
depends_on: []
tags: ["tooling","tests"]
---

## Context

plan-045's step 5 (ruling I: one task for both): two ways the suite depends on its environment
rather than on its fixtures, found in plan-044 (task-040's publication runs and its review).
- **Git's environment.** `isolatedGitEnv` (`tests/support/git-repo.ts`) gives a test repository
  its own global configuration but spreads `process.env` whole, so every inherited `GIT_*`
  variable reaches the test's git:
  - `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, `GIT_COMMITTER_EMAIL` override
    the test identity: `tests/publish.test.ts`'s "tags and commits as the caller, unsigned, with
    the dates the caller pins" fails (task-040's first publication run, 939 of 940);
  - `GIT_CONFIG_PARAMETERS` (and `GIT_CONFIG_COUNT`) override the test configuration:
    `commit.gpgsign=true` fails 65 tests (the body's review);
  - `GIT_DIR` and `GIT_INDEX_FILE`, which a git hook sets, send the test's commits and tags into
    the outer repository (the body's review: `digest-cli`'s commits and a tag written into a
    decoy).
  `src/git.ts` already drops every `GIT_*` (`gitEnvironment`); the tests do not.
- **This repository's `compat.yaml`.** `tests/check-packs.test.ts` (its `lint` helper),
  `tests/example-rules.test.ts` and `tests/readme-rules.test.ts` (its default `repository`
  variant, and `pack-install` built from it) copy the real file into their trees. An intake that
  appends a release with `pack-install` turns spec-002 §2.3's temporary mark from required to
  refused, and `readme-rules` fails with nothing wrong in the tooling (the body's review: a
  simulated 0.4.0 intake, 3 failures in these files). task-040 removed the same dependency on
  `catalog.yaml`. The real file stays checked by `tests/compat.test.ts`, by the lint and by the
  matrix; `tests/fixtures/compose/tree/compat.yaml`, held byte-equal to it (dl-010), moves with
  an intake on purpose and is not in scope.

**Departures from plan-045 step 5** (recorded in its Execution Notes): `readme-rules`, which the
plan kept on the real file, takes the fixture too, since its default variant is the test an
intake turns red; the fix drops every inherited `GIT_*`, not the identity alone.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **Git's environment.** `isolatedGitEnv` drops every inherited `GIT_*` variable, as
   `src/git.ts`'s `gitEnvironment` does, then sets `GIT_CONFIG_NOSYSTEM` and `GIT_CONFIG_GLOBAL`;
   tests that pin dates keep passing them per call. No file under `src/` changes.
2. **The fixture is `FROZEN_COMPAT`** (`tests/support/published-repo.ts`, 0.2.2 only), whose prefix
   relation to the real file `tests/compat.test.ts` already holds; no new fixture file and no new
   drift test. The three files write it into their trees (the `pack-install` variant built from
   it), with their expected outcomes unchanged (the body's review ran them on it: unchanged).
3. **No test but `tests/compat.test.ts` reads `REPO_ROOT`'s `compat.yaml` into a tree**; the tests
   that read this repository as a whole (its lint, index and validate) keep doing so.
4. **Red first** (dl-018), the red runs recorded:
   - a test that gives `isolatedGitEnv` an environment with the four identity variables,
     `GIT_CONFIG_PARAMETERS` and `GIT_DIR` pointing at a decoy repository, and asserts that a
     commit and a tag carry the test identity in all four fields (`%an`, `%ae`, `%cn`, `%ce`, the
     tagger's name and email) and that the decoy is unchanged;
   - a guard, as task-040's, failing on a read of `REPO_ROOT`'s `compat.yaml` outside its
     allowlist (`tests/compat.test.ts` and the guard's own file), red on the three files;
   - a simulated intake, a recorded run: a scratch clone whose `compat.yaml` appends a release
     with `pack-install`; before the fix, the three files fail; after it, they pass, and the only
     failures of the whole suite are the tests that check this repository as a whole
     (`compat.test.ts`'s equalities and ranges, `index`'s up-to-date check, `check-packs`'s
     "passes this repository", `validate`'s runs on this repository), listed by name.
5. **Green:** the whole suite passes, also with the four identity variables,
   `GIT_CONFIG_PARAMETERS` and `GIT_DIR` (at a decoy, left unchanged) set in the shell; from clean
   clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`, `check:pins`,
   `check:schemas`, `check:packs`, `validate`, `index -- --check` and `workflow list` exit 0;
   `compat.yaml`, `src/`, `packs/` and the expected fixtures unchanged; the CI run on the branch
   `success` and recorded; after the merge, `main`'s CI too.

## Design

- **`isolatedGitEnv`:** copies `process.env` without any key starting with `GIT_`, then sets
  `GIT_CONFIG_NOSYSTEM` and `GIT_CONFIG_GLOBAL`, as `src/git.ts`'s `gitEnvironment` does.
- **The copies:** `tests/check-packs.test.ts`, `tests/example-rules.test.ts` and
  `tests/readme-rules.test.ts` write `FROZEN_COMPAT` into their trees in place of
  `REPO_ROOT`'s `compat.yaml`; `readme-rules`' `pack-install` and `invalid` variants are built
  from it; `REPO_ROOT` imports that become unused go.
- **Red first:** `tests/git-repo.test.ts` (or the support's own test file) with the environment
  case; `tests/compat-fixture.test.ts`, the guard; both committed before the fix, the red run
  recorded. The simulated intake, scripted in the scratchpad, never committed: a clone of the red
  commit and of the fix commit, its `compat.yaml` appending a 0.4.0 release with `pack-install`
  and `workflow-engine`, `npm ci`, `npm run build`, `npm test`; the failing tests listed.
- **Commits** on `task/task-045-tests-environment`: the red tests; the fix; the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-24: independent review of the body: approve after amendments. Applied: every inherited
  `GIT_*` dropped (`GIT_CONFIG_PARAMETERS` and `GIT_DIR` shown to break or leak), the red test
  covering them and all four identity fields; the simulated intake's expected outcome (the
  whole-repository tests stay red after the fix, by design); `FROZEN_COMPAT` as the fixture, no
  new drift test; the guard's allowlist; the departures from plan-045 step 5 recorded.

