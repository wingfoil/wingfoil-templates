---
id: task-095-check-runs-drives-a-route-several-mains-in-one-repository-labelled-elements-field-and-file-writes-a-composition-filter-and-an-overlay-plan-076-task-095
type: task
title: "check:runs drives a route: several mains in one repository, labelled elements, field and file writes, a composition filter and an overlay (plan-076 task-095)"
status: draft
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
look like `feedback-item.route@feedback:<id>`, and every target is added outside the
pack's step.

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
optional, and a scenario without them reads and runs as today.

1. **Several mains in one run.** A run is one of:
   - `{ main, steps }`, as today;
   - `{ chain: [{ main, steps }, …] }`: at least one link, each a main with its non-empty
     steps.

   The links run in order, in the run's one scratch repository. Each link's `start` makes its
   own instance, and its `next`, `finalize`, `add` with a step and `end` act on that
   instance. A failure ends the run, and its line names the link (`fail at <main>.<step>`).
   The report's run name is the mains joined by `+`.
2. **Labelled elements.** `add` takes an optional `label` (a plain id, unique within the run).
   `submit` and `approve` take `added` (as today) or a label. The step writes below name their
   element the same way. A label used before its `add`, a label added twice, or an unknown label
   is a scenario error: exit 3, naming the file and the key, before any run.
3. **`add` with no step.** `add`'s `step` becomes optional. Without it, the command is
   `memory add --type <type> --title <title>`, with no `--workflow` and no `--step`, for a
   target the charter adds outside a step. With it, the command is as today, on the current
   link's instance.
4. **A field write**, `set: { element, fields, body }`:
   - `element` is `added` or a label;
   - `fields` maps frontmatter keys to a string or a list of strings;
   - `body` (optional) is a line appended to the element's body.

   The element's file is the path WingFoil printed at its `add`. The fields are written into
   its frontmatter, keeping every other key and the body as they were, and committed as the
   agent. A missing element file, or a frontmatter that does not parse, fails the step.
5. **A file write**, `write: { path, text }`: the text written at the path inside the
   repository (directories created), committed as the agent. A path that leaves the repository
   is a scenario error (exit 3), as `commit_copy`'s is.
6. **An element's id at run time.** In `set`'s values and body, `write`'s path and text, and
   the keys of `next` and `finalize`, the token `${<label>}` stands for that label's element id.
   For example: `finalize: feedback-item.route@feedback:${item}`.
   - A token naming a label not yet added fails the step.
   - A token naming an unknown label is a scenario error (exit 3).
   - Any other `$` text is left as it is. The token does not clash with WingFoil's `{…}`
     tokens, which a scenario never passes.
7. **A composition filter**, `only: [<composition id>, …]`, on a main run, a chain or an adopt
   run alike:
   - The run is made only on the compositions of the folder whose id (the folder name holding
     `example.yaml`) is listed.
   - An id that names no composition of the folder is a scenario error (exit 3).
   - A run left out counts in neither the total nor the failures.
8. **An overlay**, a top-level `overlay: <dir>`, resolved on a merged tree built as
   `validate --overlay` builds it. The code is shared with `src/validate.ts`, not copied:
   - **The directory's rules** are `openOverlay`'s: under `tests/fixtures/`, not under
     `tests/fixtures/examples/`. A violation is exit 3, naming the file and the key.
   - **The merged tree** holds the tree's `packs/`, `catalog.yaml` and `compat.yaml`, and the
     overlay's packs. An overlay pack that shadows a pack of the tree is a scenario error
     (exit 3).
   - **The scenario's `compositions`** folder is then any folder of the tree, the overlay's
     `compositions/` included.
   - **Compose and releases.** The compositions are composed, and their releases selected, on
     the merged tree.
   - **Cleanup and report.** The merged tree is removed after the scenario, failing or not.
     The report shows no scratch path.
9. **Tests**, `tests/runs.test.ts`, on the stub WingFoil and the stub composer as the existing
   tests:
   - each criterion's behaviour and each of its scenario errors;
   - a chain whose `bug` route shape (three mains, the item labelled in the first, cited in
     the second's body, finalized in the third by a run-time key) issues the expected commands
     in order, on one repository;
   - an overlay scenario composing an overlay pack, with the merged tree removed afterwards;
   - the adoption run's `include:` with no value (the null branch), which `includeList`
     already handles;
   - the guard tests of the six scenarios under `tests/fixtures/runs/`, unchanged and passing.
10. **Test first** (dl-018). The new tests run red against the code before the change, and the
    Execution Notes record each red run's command and failing count. A test that passes on its
    first run (the null branch) is checked by mutation, the mutation and its failure recorded.
11. **Nothing else changes.**
    - No file under `packs/`, `presets/`, `catalog.yaml`, `.github/` or `tests/fixtures/` changes.
    - The file header of `src/runs.ts` and the usage line describe the new keys.
    - `npm run check:runs` gives the same total as on `main` and exits 0. `npm run check:packs`
      and `npm run validate` exit 0.
12. **Checks** (`tooling-delivery` v4 › `review`, dl-039):
    - first the build review and its amendments;
    - then, once, on the frozen commit: the branch CI `success`, its run id and every job's
      duration recorded (a job over 25 minutes goes to the approver, R3);
    - dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and
      `npm run build`: `validate:publication`, the golden tree in publication mode and
      `workflow list`;
    - `npm test` and `npm run lint` exit 0.
13. **A criterion that cannot hold as written** goes to the approver when found (dl-019). For
    example, if WingFoil 0.3.0 or 0.3.2 does not accept `memory add` with no step, the work on
    that criterion waits for the ruling.
14. **At close:** the row of the full scrum and kanban runs is narrowed in
    `docs/owed-items.md`, in the commit of this task's close note (`repository-practice`
    rule 4). It narrows to `memory park`, `memory reject`, `set_state` and an expected refusal,
    citing task-095. The privacy check of the branch's diff is recorded in the Execution Notes.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-17: written under plan-076 step 2, from point 2 of its outline as ruled; `pack`
  comment and `tags` filled by editing the draft (W-02).
