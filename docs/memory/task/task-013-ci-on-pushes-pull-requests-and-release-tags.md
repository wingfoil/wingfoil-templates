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

This repository merges tooling branches locally and pushes `main`; pull requests are possible but
not the habit. So CI also runs on every push to `main`, in self-test mode, or most changes would go
unchecked; that is an addition to F3.6's two triggers.

Release tags are `<catalog pack id>@<version>` (spec-001 §4), for example `base@1.0.0` or
`methodology/kanban@1.2.0`. None exists yet. Until `compat.yaml` lists a release with
`format_key: true`, a publication run fails by design (dl-009): that is the expected result of a tag
pushed today, not a CI defect.

Not in scope: the Pages deployment (spec-002 §5, wave W14); making a check required by the
`protect-main` ruleset (a required status check would also block the direct pushes to `main` this
repository uses: the approver's decision, after this task); release evidence (plan-015 task 11).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added.
2. **`.github/workflows/ci.yml`**, triggered by `push` to `main`, `pull_request` (any branch) and
   `push` of a tag matching `*@*`:
   - one job per Node.js version, `22.12.0` and `22.21.0`, each exact;
   - checkout with every tag and the full history (`fetch-depth: 0`), without persisting
     credentials;
   - `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
     `npm run check:schemas`, `npm run check:packs`, `npm audit` on the root lockfile and on each
     `src/matrix/wingfoil-*/` lockfile;
   - on a push to `main` or a pull request: `npm run validate` on this repository and
     `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` (the W6
     exit criterion: a fixture validated against `wingfoil@0.2.2` in self-test mode);
   - on a tag: `npm run validate:publication` on this repository, never `npm run validate`;
   - the matrix cache (`.cache/wingfoil-matrix/`) restored and saved, keyed on the hash of the
     `src/matrix/wingfoil-*/package-lock.json` files and the Node.js version.
3. **Security:** every action is pinned to a full commit SHA, with its version in a comment; the
   workflow's `permissions` are `contents: read` and nothing else; no secret is read; no step runs
   code from the pull request with more rights than the push does (`pull_request`, never
   `pull_request_target`).
4. **Tests of the workflow file** (`tests/ci-workflow.test.ts`, no network): it parses, holds the
   triggers, Node.js versions, checkout options, steps and permissions of acceptance 2 and 3; every
   `uses:` is `<owner>/<repo>@<40 hex>`; the tag path runs `validate:publication` and no
   `validate` step, and the other paths the reverse.
5. **`dna.yaml`:** `paths.config` gains `.github` (`version:` bumped).
6. **A real run:** after the merge, the push to `main` runs the workflow on GitHub, both jobs end in
   success, and the run's URL and result are recorded in the Execution Notes. A tag run is not
   triggered by this task (no pack is published; a tag would also fail publication by design).
7. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
