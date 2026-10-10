---
id: task-013-ci-on-pushes-pull-requests-and-release-tags
type: task
title: "CI on pushes, pull requests and release tags"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-012-lint-rules-over-the-whole-tree-spec-001-18-f3.5"]
tags: ["tooling","W6","F3.6"]
---

## Context

Task 10 of plan-015 (`sw-life-cycle` › `tooling`, wave W6, F3.6). Tooling task, no pack. It closes
wave W6, whose exit criterion is "a fixture validates against pinned WingFoil releases, in CI"
(`07_sequencer.md`). Below, "plan-015 task N" names a step of that plan, not a Memory element.

It comes from:
- **F3.6:** the validation runs on every pull request and every publication;
- **dl-009:** CI on pull requests runs the matrix's self-test mode; CI on release tags runs
  publication mode, and nothing on that path can select self-test mode (`npm run validate` and
  `npm run validate:publication`, task-011);
- **spec-002 §3.1:** `npm run index -- --check` reads git tags, so CI checks out with every tag
  (`fetch-depth: 0`); the index command itself arrives with wave W14;
- **the `determinism` and `security` directives:** pinned tools, no secrets; spec-002 §5's rules
  for the later Pages job (actions pinned to a commit SHA, least permissions) apply to every job
  here too;
- **the Node.js floor** (adr-002, task-001): 22.12.0, and the newest 22.x the tasks are checked on
  (22.21.0).

This repository uses no pull requests: only the approver and agents write it, branches are merged
locally with `--no-ff` and `main` is pushed (brief §5, dl-005 G5); outside contributions will arrive
as Memory elements, not as code pull requests (`03_is-isnot.md`). So CI also runs on every pushed
branch, `main` and work branches such as `task/…` or `config/…`, in self-test mode, or most changes
would go unchecked; that is an addition to F3.6's two triggers. The `pull_request` trigger stays
for F3.6, though the normal flow never uses it.

Release tags are `<catalog pack id>@<version>` (spec-001 §4), for example `base@1.0.0` or
`methodology/kanban@1.2.0`. None exists yet. Until `compat.yaml` lists a release with
`format_key: true`, a publication run fails by design (dl-009): a tag pushed today ends with
`no compatible release (publication)` and exit 1 (task-011 acceptance 9), the expected result, not a
CI defect. The tag run validates the whole tree, as `pack-release-cycle` › `validate` does: every
preset and documented combination that includes the pack.

Not in scope: the Pages deployment (spec-002 §5, wave W14); making a check required by the
`protect-main` ruleset (a required status check would also block the direct pushes to `main` this
repository uses: the approver's decision, after this task); release evidence (plan-015 task 11).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added.
2. **`.github/workflows/ci.yml`**, triggered by `push` of any branch (`**`), `pull_request` (any
   branch) and `push` of a tag matching `**@*` (in GitHub's filter patterns `*` does not match `/`,
   and pack ids such as `methodology/kanban` contain one):
   - one job per Node.js version, `22.12.0` and `22.21.0`, each exact (`setup-node` with
     `check-latest: false`), on `ubuntu-24.04`, with a `timeout-minutes`;
   - `concurrency` cancels a superseded run of the same branch or pull request, never a tag run;
   - checkout with every tag and the full history (`fetch-depth: 0`), without persisting
     credentials;
   - `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
     `npm run check:schemas`, `npm run check:packs`, and `npm audit` on the root lockfile and in
     every `src/matrix/wingfoil-*/` folder (it reads the lockfile; no install). A new advisory can
     turn CI red with no change of code: intended, since it would also block a publication;
   - on a push to `main` or a pull request: `npm run validate` on this repository and
     `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` (the W6
     exit criterion: a fixture validated against `wingfoil@0.2.2` in self-test mode);
   - on a tag (`github.ref_type == 'tag'`): `npm run validate:publication` on this repository,
     never `npm run validate`;
   - the matrix cache (`.cache/wingfoil-matrix/`) through `actions/cache`, keyed on `runner.os`,
     the Node.js version and the hash of the `src/matrix/wingfoil-*/package-lock.json` files; a
     stale or partial restore is safe, since `installRelease` reinstalls unless its stamp matches
     (task-011).
3. **Security:** every action is pinned to a full commit SHA, with its version in a comment; the
   workflow's top-level `permissions` are `contents: read` and nothing else (the Pages job of W14
   declares its own, at job level or in its own workflow); no secret is read; pull requests run
   with `pull_request`, never `pull_request_target`, so a pull request from a fork gets the
   read-only token and no secret, and its caches are scoped to it; GitHub's approval of first-time
   contributors' runs stays on.
4. **Tests of the workflow file** (`tests/ci-workflow.test.ts`, no network): it parses, holds the
   triggers (the `**@*` tag pattern included), Node.js versions, runner, checkout options, steps
   and permissions of acceptance 2 and 3; every `uses:` is `<owner>/<repo>@<40 hex>`; the tag path
   (`github.ref_type == 'tag'`) runs `validate:publication` and no `validate` step, and the other
   paths the reverse.
5. **`dna.yaml`:** `paths.config` gains `.github` (`version:` bumped).
6. **A real run, before approval, with no pull request:** the task branch is pushed; the workflow
   runs on GitHub, both jobs succeed, and the run's URL and result are recorded in the Execution
   Notes before `in-review → approved`. A failed run keeps the task in review. The merge stays local
   (`--no-ff`), the push of `main` runs the workflow once more, and the remote task branch is then
   deleted. A tag run is not triggered by this task (no pack is published; a tag fails publication
   by design).
7. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-10: amended while `pending`, before the approver's review, after an independent review
  (a subagent with its own context): the tag pattern `**@*`, since `*` does not match the `/` of
  pack ids; the real run moved before approval, on a pull request; fork pull requests, job-level
  permissions for the later Pages job, the cache key and its safety, a pinned runner and Node.js,
  `npm audit` on the matrix folders without install, the tag path's condition and scope, the
  expected publication failure, timeouts and concurrency.
- 2026-10-10: amended again while `pending`, as the approver asked: no pull request. CI runs on the
  push of any branch; the real run of acceptance 6 is on the pushed task branch.
