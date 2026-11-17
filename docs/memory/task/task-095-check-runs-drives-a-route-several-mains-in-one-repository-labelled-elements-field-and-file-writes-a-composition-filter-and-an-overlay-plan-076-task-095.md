---
id: task-095-check-runs-drives-a-route-several-mains-in-one-repository-labelled-elements-field-and-file-writes-a-composition-filter-and-an-overlay-plan-076-task-095
type: task
title: "check:runs drives a route: several mains in one repository, labelled elements, field and file writes, a composition filter and an overlay (plan-076 task-095)"
status: in-progress
pack: ""            # tooling task (tooling-delivery v4), plan-076 task-095
depends_on: []
tags: ["tooling","tests","governance"]
---

## Context

plan-076 hosts this task (point 2 of its outline, ruled on 2026-11-17). It is a tooling task
under `tooling-delivery` v4, and the first of the plan's five tasks. It comes before the
`governance/feedback` pack exists.

**Why.** `pack-governance-feedback` › Acceptance, FA-6 [V], reads "`check:runs` drives each
route". A route touches up to three mains and two elements:
- the item, added and triaged by `feedback-ingest`;
- the target: added outside a step (a decision-log, a task), or by its own main (`bug-ingest`
  for a bug);
- for `upstream-note`, a note file.

plan-073 step 2 and plan-074 step 2 drove the routes by hand on WingFoil 0.3.2. Their keys
look like `feedback-item.route@feedback:<id>`. Every target is added outside the pack's
workflows: outside any step, or at its own main's step (`bug-ingest.capture`).

**What `check:runs` (`src/runs.ts`, task-053, task-058, task-060) has today:**
- **Steps:** `start`, `end`, `next`, `finalize`, `commit_inside`, `commit_copy`, `add`, `submit`
  and `approve`.
- **One main per run.** Each run gets its own scratch repository and one instance.
- **`add`** always passes `--workflow <instance> --step <step>`. `submit` and `approve` take
  only `added`, the last element added.
- **No step writes** an element's field, or given text at a given path. A `feedback` item's
  `submit` needs `kind`, `target`, `source` and `context`, and its routing needs `outcome`.
- **Compositions.** Every run of a scenario is made on every `example.yaml` of its one
  `compositions` folder.
- **No overlay.** `realCompose` resolves only the tree's own `catalog.yaml` and `packs/`
  (`src/resolve.ts`). `validate --overlay` (task-046, `src/validate.ts` › `openOverlay`,
  `checkOverlay`) builds a merged tree of the tree's packs and the overlay's packs.

**The row this task meets.** "`check:runs` scenarios of the full scrum and kanban runs" in
`docs/owed-items.md` (plan-050 ruling 3; plan-052 › close; plan-057 ruling 5; dl-032 E5) has the
trigger "the next tooling task on `runs.ts`". This task settles two of its parts:
- the field write;
- the test of the adoption run's `include:` with no value (the `null` branch, task-060's
  re-review). Today's test "writes an include list when the composed workflows.yaml has none"
  covers an absent `include`, not a null one.

At close the row narrows to `memory park`, `memory reject`, `set_state` and an expected refusal
(plan-076 point 2).

**What uses it:** task-097 (plan-076 point 4) writes the scenarios `feedback.yaml`,
`feedback-upstream.yaml` and `adoption-feedback.yaml`. This task changes no scenario under
`tests/fixtures/runs/`, and the existing six run as today.

## Acceptance

`npm run build` precedes the commands. A scenario stays at `format: 1`: every key below is
optional, and a scenario without them reads and runs as today. WingFoil 0.3.0 … 0.3.2 accept
`memory add` with neither `--workflow` nor `--step`, and print `{ id, path }`, the path relative
to the repository; an iterated step's key is `<step>@<type>:<id>` (read in their code for this
body).

1. **Several mains in one run.** A run is one of:
   - `{ main, steps }`, as today;
   - `{ chain: [{ main, steps }, …] }`: at least one link, each a main with its non-empty
     steps.

   The links run in order, in the run's one scratch repository. Each link's `start` makes its
   own instance; its `next`, `finalize`, `add` with a step and `end` act on that instance. One
   of those four before its link's `start` is a scenario error (exit 3). The steps that need no
   instance (`add` with no step, `set`, `write`, `submit`, `approve`, `commit_inside`,
   `commit_copy`) may come anywhere.
   - **The failure line.** A single-main run keeps `fail at <step>`, as today. A chain names
     the link by its position: `fail at <main>[<n>].<step>`, `<n>` counted from 1.
   - **The run's name** in the report is its optional `name` (a plain id, unique within the
     scenario), else its main, `adopt:<template>`, or a chain's mains joined by `+`.
2. **Labelled elements.** `add` takes an optional `label`, a plain id unique within the run. A
   plain id here and in criterion 1 matches `^[a-z][a-z0-9-]*$`. `submit` and `approve` take
   `added` (as today) or a label, and the writes below name their element the same way. These
   are scenario errors, exit 3, naming the file and the key, before any run:
   - a label, or a token of criterion 6, used before its `add` in the run's step order;
   - a label added twice;
   - an unknown label;
   - the label `added`, which names the last element added (`$added.id` is not a token).
3. **`add` with no step.** `add`'s `step` becomes optional. Without it, the command is
   `memory add --type <type> --title <title>`, with no `--workflow` and no `--step`, for a
   target the charter adds outside the pack's workflows. With it, the command is as today, on
   the current link's instance.
4. **A field write**, `set: { element, fields, body }`:
   - `element` is `added` or a label;
   - `fields` (optional) maps frontmatter keys to a string or a list of strings;
   - `body` (optional) is a line appended to the element's body.

   The element's file is the path WingFoil printed at its `add`. Each field given replaces
   that key's value, or is added after the last key. Every other line of the file stays
   byte-identical, comments included. Each value is written so that the frontmatter parses
   back to exactly the given string or list, quoted where a plain scalar would not (a test
   covers values such as `true`, `42`, `#x` and `a: b`). The change is committed as the
   agent. A missing element file, or a frontmatter that does not parse, fails the step.

   These are scenario errors (exit 3):
   - neither `fields` nor `body` given;
   - an empty `fields`;
   - a value that is neither a string nor a list of strings;
   - the key `id` or `status`. A state changes only through WingFoil's commands; `set_state`
     stays owed.
5. **A file write**, `write: { path, text }`: the text written at the path inside the
   repository (directories created), committed as the agent. A path that leaves the repository,
   or one under `.git/`, is a scenario error (exit 3), as `commit_copy`'s is.
6. **An element's id at run time.** In `set`'s values and body, `write`'s path and text, and
   the keys of `next` and `finalize`, the token `$<label>.id` stands for that label's element
   id. The token is `\$([a-z][a-z0-9-]*)\.id(?![a-z0-9-])`: it ends at `.id`, and `$item.idx`
   is not one. For example: `finalize: feedback-item.route@feedback:$item.id`.
   - The outline's notation `<label>.id` is kept, with a `$` added. The token holds no `{`,
     `}`, `[`, `]` or `,`, so it is safe in YAML flow syntax, unquoted.
   - A token naming an unknown label is a scenario error (exit 3), and so is one before its
     label's `add` (criterion 2).
   - Any other `$` text is left as it is.
7. **A composition filter**, `only: [<composition id>, …]`. It is a key beside `main` and
   `steps`, beside `chain`, or beside `adopt` on an adopt run.
   - **What it selects.** The run is made only on the compositions of the folder whose id (the
     name of the folder holding `example.yaml`) is listed.
   - **Scenario errors (exit 3):** an id that names no composition of the folder; an empty
     list; a duplicate id.
   - **Counts.** A run left out counts in neither the total nor the failures.
   - **Skipped compositions.** A composition that no run of the scenario selects is neither
     composed nor installed.
8. **An overlay**, a top-level `overlay: <dir>`, relative to the tree as `compositions` is.
   Compositions resolve on a merged tree, built as `validate --overlay` builds it.
   - **Shared code.** The merged-tree build is extracted from `src/validate.ts` › `checkOverlay`
     into an exported function, which `validate` and `check:runs` both use. `openOverlay`'s
     directory rules are exported with it.
   - **What `check:runs` does not run.** It runs none of the overlay's own checks (layout,
     schemas, lint, secrets). The CI's `validate --overlay` steps run them.
   - **The directory's rules** are `openOverlay`'s, with its exit codes:
     - a directory that does not exist is exit 2;
     - one outside `tests/fixtures/`, or under `tests/fixtures/examples/`, is exit 3;
     - each line reads `<file>: overlay: <openOverlay's reason>`.
   - **The merged tree** holds the tree's `packs/`, `catalog.yaml` and `compat.yaml`, and the
     overlay's packs. An overlay pack that shadows a pack of the tree is a scenario error
     (exit 3).
   - **The scenario's `compositions`** stays a path relative to the tree. It may name any
     folder of the tree, the overlay's own included (`tests/fixtures/<overlay>/compositions`).
   - **Compose and releases.** The compositions are composed, and their releases selected, on
     the merged tree.
   - **Cleanup and report.** The merged tree is removed after the scenario, failing or not.
     The report shows no scratch path: neither `runs-…` nor the merged tree's, which
     `mapOverlayPaths` (`src/validate.ts`) maps back to the tree's and the overlay's paths.
9. **Tests**, `tests/runs.test.ts`, on the stub WingFoil and the stub composer, as the existing
   tests. They cover:
   - each criterion's behaviour and each of its scenario errors;
   - a chain shaped as the `bug` route. Its three mains are `feedback-ingest`, `bug-ingest` and
     `feedback-bug-route`; the item is labelled in the first, cited in the second's body, and
     finalized in the third by a run-time key. The test asserts that the expected commands are
     issued in order, in one repository;
   - an overlay scenario, whose `compose` receives a tree holding both the tree's packs and the
     overlay pack, with the merged tree removed afterwards;
   - one test of `realCompose` on the merged tree that the extracted function builds from a
     small tree and overlay written in a temporary directory, with no signature change;
   - a failing overlay compose, whose line holds no scratch path;
   - the adoption run's `include:` with no value (the null branch), which `includeList`
     already handles;
   - the guard tests of the six scenarios under `tests/fixtures/runs/`, unchanged and passing.
10. **Test first** (dl-018).
    - The new tests run red against the code before the change. The Execution Notes record each
      red run's command and its failing count.
    - A test that passes on its first run (the null branch) is checked by mutation. The
      mutation and its failure are recorded.
    - `validate`'s overlay path is characterized by `tests/validate*.test.ts`, green before and
      after the extraction.
11. **Nothing else changes.**
    - No file under `packs/`, `presets/`, `catalog.yaml`, `.github/` or `tests/fixtures/`
      changes.
    - The header of `src/runs.ts` describes the new keys.
    - `validate --overlay`'s output on `software-exit`, `scrum-exit` and `kanban-exit` is
      unchanged: the Execution Notes record the diff of each output before and after.
    - `npm run check:runs` gives the same total as on `main` and exits 0.
    - `npm run check:packs` and `npm run validate` exit 0.
12. **Checks** (`tooling-delivery` v4 › `review`, dl-039):
    - first, the build review and its amendments;
    - then, once, on the frozen commit: the branch CI `success`, its run id and every job's
      duration recorded (a job over 25 minutes goes to the approver, R3);
    - dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and
      `npm run build`: `validate:publication`, the golden tree in publication mode, and
      `workflow list`;
    - `npm test` and `npm run lint` exit 0.
13. **A criterion that cannot hold as written** goes to the approver when found (dl-019), and
    the work on it waits for the ruling.
14. **Delivery.**
    - The work goes on the branch `task/task-095-check-runs-route-steps`, from `main`.
    - It is merged `--no-ff` into `main` on the approver's OK, after `approve`. Then `main`'s CI
      is read, with its run id and every job's duration recorded, and the task goes
      `approved → done`.
    - The untracked `tests/fixtures/feedback-draft/` of the main checkout is never staged. The
      branch's work and its clean-tree checks run in a worktree of their own.
15. **At close:** the row of the full scrum and kanban runs is narrowed in
    `docs/owed-items.md`, in the commit of this task's close note (`repository-practice`
    rule 4). It narrows to `memory park`, `memory reject`, `set_state` and an expected refusal,
    citing task-095. The privacy check of the branch's diff is recorded in the Execution Notes.

## Design

- **The scenario model** (`src/runs.ts`):
  - A main run becomes `{ kind: 'main', name?, only?, links, single }`, each link
    `{ main, steps }`. A plain `{ main, steps }` is one link with `single: true`, so its failure
    line stays `fail at <step>`.
  - An adopt run gains `name?` and `only?`.
  - The scenario gains `overlay?`.
  - `add` gains `step?` and `label?`. `submit` and `approve` carry `element` (`added` or a
    label). New step kinds: `set { element, fields?, body? }` and `write { path, text }`.
- **Static checks in `loadScenario`**, exit 3 with `<file>: <key>: <what>`:
  - one walk over each run's steps, in order, tracking the labels added so far and whether the
    current link has started;
  - a token or a label before its `add`, an unknown label, a label added twice, the label
    `added`, and an instance step before its link's `start` are refused there;
  - `only`'s ids are checked against the folder's compositions in `runRuns`, where the folder
    is listed.
- **Run time** (`runOne`):
  - Each link resets `instance` at its `start`.
  - A map holds each label's id and path, from `memory add`'s `{ id, path }`; `added` is the
    last one.
  - `expand(text)` replaces `\$([a-z][a-z0-9-]*)\.id(?![a-z0-9-])` with the label's id. Its
    other `$` text is kept.
  - `current` becomes `<main>[<n>].<step>` in a chain.
- **`set`**, line-based, so that other lines stay byte-identical:
  - The frontmatter is the text between the opening `---` line and the next `---` line.
  - A top-level key's block is its `key:` line plus the indented or `- ` lines after it. That
    block is replaced by `stringify({ key: value })` of the `yaml` package, which quotes what a
    plain scalar would misread; a new key goes before the closing `---`.
  - After the write, the frontmatter is parsed again, and each field must equal the value
    given, or the step fails.
  - `body` is appended as a line, after a newline if the file lacks a final one.
- **The overlay.** A new module, `src/overlay-tree.ts`, takes from `src/validate.ts`:
  - the `Overlay` interface;
  - `openOverlay`, returning its `reason` beside the line `validate` prints;
  - `mergeOverlay(tree, overlay)`: it builds the merged tree (the tree's `packs/`,
    `catalog.yaml` and `compat.yaml`, then the overlay's packs that shadow none of the tree's)
    and returns the shadowing pairs.

  `checkOverlay` calls `mergeOverlay` and turns each pair into its `overlay-shadow` problem, as
  today. `validate`'s lines are sorted afterwards, so their order holds. `check:runs` refuses
  any pair (exit 3) and composes on the merged tree, its lines passed through `hideScratch` and
  `mapOverlayPaths`. `hideScratch` also hides `validate-overlay-…`. The merged tree's root is
  removed in a `finally` once the scenario's compositions are done.
- **`only` and skipped compositions.** In `runRuns`, a composition's runs are the scenario's
  runs whose `only` is absent or lists its id. A composition with no run is not composed.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-17: written under plan-076 step 2, from point 2 of its outline as ruled; `pack`
  comment and `tags` filled by editing the draft (W-02).
- 2026-11-17: independent review (dl-017): approve after amendments; no blocker, ten
  should-fix, eight nits, all applied. WingFoil 0.3.0 … 0.3.2's `memory add` with no step, its
  printed path, the iterated key and `workflow end`'s refusal confirmed in their code.
  **Should-fix:**
  - the token became `$<label>.id`, safe in YAML flow syntax, keeping the outline's notation;
  - a token before its label's `add` became a scenario error;
  - a run's optional `name`;
  - the failure line of a single main kept, and a chain's link named by position;
  - an instance step before its link's `start` became a scenario error;
  - the overlay's scratch paths hidden;
  - the merged-tree build named as an extraction, `validate`'s output guarded;
  - an overlay test that checks the tree `compose` receives, and one of `realCompose`;
  - `set`'s scenario errors (`id`, `status`) and its byte-identical lines;
  - delivery.

  **Nits:** the usage line left as it is; `only`'s place, its empty and duplicate errors, and
  skipped compositions; the plain id's pattern; exit 2 for a missing overlay directory; no
  `write` under `.git/`; "outside the pack's workflows"; `compositions` relative to the tree;
  `validate`'s characterization. Criteria 1, 2, 4, 6, 7 and 8 change: re-review.
- 2026-11-17: re-review: approve after amendments; no blocker, one should-fix, six nits, all
  applied; every first-review fix checked against the code, the overlay extraction feasible
  with `validate`'s lines unchanged (sorted), the token parsed by the repo's `yaml` in flow
  syntax. **Should-fix:** `set` writes each value so that it parses back as given, with a test
  of values needing quotes. **Nits:** the token's pattern and end; the label `added` refused;
  `commit_inside` and `commit_copy` allowed anywhere; the overlay relative to the tree, its
  error line and `mapOverlayPaths`; the `realCompose` test on the extracted merged tree; the
  three overlays' output diffs recorded. The fixes make the criteria checkable, with no new
  rule: no further review.
- 2026-11-17, design: written on the branch `task/task-095-check-runs-route-steps` from `main`
  at `e5d0a27b`; the task submitted `backlog → in-progress`.
- 2026-11-17, red (dl-018): the tests of criteria 1 … 9 added to `tests/runs.test.ts` against a
  stub `src/overlay-tree.ts` (exports returning a refusal and no pairs) and today's
  `src/runs.ts`, `9f3e522d`: `npm run build && node --test dist/tests/runs.test.js`, 64 tests,
  13 failing (the 12 new tests of the route steps and the overlay, and the one of `realCompose`
  on a merged tree). The null-branch test passed on its first run, as criterion 10 foresaw.
- 2026-11-17, the null branch's mutation: `yaml`'s `Document.get` returns `undefined` for a key
  whose value is null (`include:`, `include: null`, `include: ~`), so `includeList`'s
  `include === null` is never reached and removing it changes nothing; a value-less `include`
  takes the `undefined` branch, which replaces the null pair. The mutation that tells a null
  value from an absent key, `if (!document.has('include'))`, fails the null-branch test and
  passes the absent-key one: the test pins the behaviour. The dead comparison is left as it is
  (criterion 11).
- 2026-11-17, build (`c0f71539`):
  - `src/overlay-tree.ts`: the `Overlay` interface, `mapOverlayPaths`, `openOverlay` (its
    refusal now carries the `reason` beside `validate`'s line) and `mergeOverlay`, moved from
    `src/validate.ts`; `validate` re-exports `mapOverlayPaths` and turns each shadowing pair into
    its `overlay-shadow` problem as before.
  - `src/runs.ts`: the model and checks of the Design; `hideScratch` also hides
    `validate-overlay-…`; the overlay is opened before the compositions are listed, so a missing
    overlay directory is exit 2, not the compositions' exit 3.
  - The 64 tests of `tests/runs.test.ts` pass; `npm run lint` exits 0.
- 2026-11-17, checks on `c0f71539`: `npm test` 1364 tests, 0 failed; `validate --overlay` on
  `software-exit`, `scrum-exit` and `kanban-exit` exit 0, each output identical to `main`'s
  at `e5d0a27b` (`diff`, no line differs); `check:packs` and `validate` exit 0;
  `check:runs` `runs: 46 runs, 0 failed`, the total `main` gives (task-068).
- 2026-11-17: independent build review (dl-017): approve after amendments; no blocker, four
  should-fix, seven nits; `validate`'s refusals, lines and problem order confirmed unchanged by
  the extraction, the token's global regex safe, every overlay cleaned on every path probed.
  Applied in `2e64bd00`:
  - **Should-fix:** `write`'s `.git` refusal on the normalized path, again after the tokens
    expand (`./.git/config` passed); each merged tree removed once its scenario is done, not when
    `runRuns` returns (`runScenario` split out); a key's block keeps its blank lines while an
    indented line follows (a block scalar with a blank line could not be written); the tests
    asked: a frontmatter that does not parse, a run's name given twice, equal to another run's
    name or not plain, `add` with a step before `start`, `./.git/config`, the overlay removed
    per scenario, and `setFields` exported and tested on a block list, a block scalar with a
    blank line, a key that is a prefix of another, a new key, a body line, no frontmatter, a BOM
    and CRLF.
  - **Nits applied:** a BOM or CRLF named in `set`'s failure; a new key added after the last
    key, before a trailing comment; the closing `---` found as a whole line; a run's `name`
    refused when it equals another run's name, given or derived; `validate`'s re-export moved
    below the imports.
  - **Nits recorded, no change:** `submit: added` (or `approve`, `set`) before any `add` is a
    scenario error (exit 3), an extension of criterion 2's static checks; `only` takes plain ids,
    as every composition folder of the tree is.
  - **Test first:** the new tests run against `c0f71539`'s code (its `setFields` exported for
    the run): 69 tests, 6 failing; the two that pass there (a frontmatter that does not parse, a
    missing element file's message) characterize behaviour the fix keeps. 69 pass after; `npm
    run lint` exits 0. The fixes change behaviour: re-review.
- 2026-11-17: re-review of the build fixes: approve; no blocker, two nits. Applied in `6607af1b`: a
  test of `write`'s `.git` refusal after the tokens expand (an id `.git`), checked by mutation
  (the check removed, the test fails; restored, 70 tests pass). Recorded, no change: a block's
  indented comment after a blank line now goes with the block when its key is set, since an
  indented line belongs to it. The code is frozen at `6607af1b`.
