---
id: task-096-the-governance-feedback-pack-and-its-readme-examples-plan-076-task-096
type: task
title: "The governance/feedback pack and its README examples (plan-076 task-096)"
status: draft
pack: "pack-governance-feedback"
depends_on: ["task-095"]
tags: ["packs","feedback","governance"]
---

## Context

plan-076 (`pack-cycle › author` of `pack-governance-feedback`), point 3 and its ruling. This task
writes `packs/governance/feedback` as three sources fix it:
- **the charter** (accepted under plan-073): Ships, Adaptations, Commitments, Adoption,
  Acceptance;
- **spec-003** (approved under plan-074): the list parameters (§3, §4), the upstream channel
  (§5), the entry's directive (§7), the back-reference (§8) and `pack.yaml` format 2 (§9);
- **the untracked draft** under `tests/fixtures/feedback-draft/`. plan-073 step 2 and plan-074
  step 2 ran it on WingFoil 0.3.2 and validated it on 0.3.0 and 0.3.2. Its `pack.yaml`,
  fragments, template and workflows are the source; its directives, AGENTS.md section and README
  are drafts, written again here from the charter and spec-003.

Every README example is a fixture (spec-002 §2.4), so the examples come in the same change. The
tests of point 8's [V] rows for this task (FA-3, FA-4, FA-6's routing table) come with it, as a
developer change under `tests/` inside a pack task, as task-068's was.

task-097 (the exit overlay `feedback-exit`, the scenarios and the fixture upstream pack),
task-098 (the fixture projects and the bindings) and task-099 (the run by hand) build on this
task. The draft stays untracked, and is deleted after task-097's merge.

**Format 2** departs from the charter's Compatibility line (format 1). spec-003 §9 rules it, and
the charter's Execution Note of plan-074 records it.

## Acceptance

1. **`packs/governance/feedback/pack.yaml`**:
   - **Identity:** `format: 2`, `id: governance/feedback`, `axis: governance`,
     `name: feedback`, `title: "Feedback"`, a `description` without the draft's "Draft for
     plan-073's run", and `version: 1.0.0`.
   - **Formats:** `roles`, `memory`, `workflow`, `directive` and `memory-template`, all 1.
   - **Requirements:** `requires: [base@^2]`, `requires_capabilities: [workflow-engine]`, no
     `conflicts`.
   - **Parameters:** five, each with a description:
     - `feedback_path` (path, `docs/memory/feedback/{id}.md`);
     - `feedback_id` (pattern, `feedback-{n}-{slug}`);
     - `feedback_kinds`, `feedback_targets` and `feedback_outcomes`: `string`, each description
       beginning "List of", with spec-003 §4.1's defaults. `feedback_outcomes`' description
       says it never holds `bug`.
   - **Contents:**
     - unconditional: the fragments `roles` and `memory`, the directive `feedback`, the
       workflows `feedback-ingest`, `feedback-review` and `feedback-item`, the memory template
       `feedback`, and the AGENTS.md section;
     - one entry, `with: software@^1`, holding the workflows `feedback-bug-route` and
       `feedback-bug-item` and the directive `feedback-bug-route`.
2. **`fragments/memory.yaml`** and **`memory-templates/feedback.md`**, as the draft has them:
   - the type `feedback`, its path and id from the two parameters;
   - `template.frontmatter.required: [title, kind, target, source, context]`;
   - `states.sequence: [draft, pending, triaged, closed]` and `gates: { pending: { reject: draft
     } }`;
   - the template's frontmatter (`kind`, `target`, `source`, `context`, `outcome`, `resulting`
     empty) and its three body sections, the comments saying what each holds.

   **`fragments/roles.yaml`**: `facilitator: [feedback]`, and nothing else. There is no
   `dna.yaml` fragment.
3. **The five workflows**, as the draft has them and the charter's table states them:
   - each with `format: 1` and no key newer than WingFoil 0.3.0;
   - each phase's `description` says what its role does, or what it iterates and includes;
   - `feedback-review`'s `where` reads `outcome: [{{feedback_outcomes}}]`, and
     `feedback-bug-route`'s reads `outcome: [bug]`;
   - `feedback-bug-item` › `bug` holds the action `'agent.execute(directive: feedback-bug-route)'`
     (spec-003 §7.2, path 2), which the lint's `entry-directive-scope` accepts;
   - `feedback-item` › `route` holds a plain `agent.execute`.
4. **`directives/feedback.md`** (unconditional, WingFoil 0.3.0's directive frontmatter), written
   as rules from the charter and spec-003:
   - **Feedback and its fields:** what counts as feedback; the required fields; the three lists
     named by their parameters (`{{feedback_kinds}}`, `{{feedback_targets}}`,
     `{{feedback_outcomes}}`); a project never adds `bug` (§4.2).
   - **The classification rules** (the charter's Directives): how a kind and a target are chosen.
     The agent writes only a listed value in `kind`, `target` and `outcome`; WingFoil checks no
     value, so the directive is the check at writing time (spec-003 §3.3).
   - **The triage:** the outcome is proposed before the triage and confirmed by the approver.
     The triage rule (§4.3): an empty or not allowed outcome is rejected to `draft`, except a
     would-be `bug` without `software`, proposed as `decision-log` naming it.
   - **The routing table**, without `bug`:
     - `decision-log` through `decision-log-ingest`, or a governance change through
       `governance-evolution`;
     - `task` in `draft`;
     - `upstream-note` through a channel;
     - `declined` and `duplicate` closed with the reason;
     - any other allowed outcome, and an `upstream-note` that no channel serves, as a
       decision-log naming it.

     Each target is added outside the pack's step and recorded with `workflow finalize`.
   - **The `feedback-route` reading duty** (§7.2, path 1): read every directive tagged
     `feedback-route` whenever an outcome is proposed and at every route step, and read the step
     with `workflow next` at a route step.
   - **The `feedback-channel` lookup:** the channel directive whose "Serves the target" line names
     the item's `target`. When none serves it, the item becomes a decision-log naming the target
     (§5.1). When two serve one target, the facilitator raises it to the approver (§5.2).
   - **The trace both ways:** `resulting` names the routed element, which cites the item back
     through `reported_by` where its template has it, and otherwise in its body (§8).
   - **Closing and the review run:** who closes an item (the facilitator, once `resulting` is
     written); how `feedback-review` is started at the project's cadence and ended when the
     project has reviewed (F-039).
   - **The agent** never approves, and hands the approver the command.

   **`directives/feedback-bug-route.md`** (in the entry):
   - `tags: [feedback-route]`;
   - `bug` added to the allowed outcomes;
   - a `bug` item goes through `software`'s `bug-ingest`, started on its own, and
     `feedback-bug-item` records it;
   - `resulting` names the bug, and the bug cites the item in its body until `software` ships
     `reported_by` (§8);
   - `feedback-bug-route` is started at the project's cadence and ended with `workflow end` when
     the project has routed its bugs (F-039). Isolation keeps this out of the unconditional
     directive.

   Neither directive id, and no workflow name of the pack, equals a WingFoil 0.3.2 built-in or a
   `custom/` file of `init --template Scrum` or `--template Kanban`, or one of this
   repository's `custom/` files. This is checked by listing
   them in this task, as task-067 did, and repeats plan-073 step 1's read.
5. **`agents/section.md`**: a level-2 section `## Feedback`, no level-1 heading, no markers. It
   covers:
   - capture with source and context through `feedback-ingest`, one item per run, the kind one of
     `{{feedback_kinds}}`;
   - only the approver triages, and `{{agent_name}}` never approves;
   - `feedback-review` routes and closes each item, the facilitator writing `resulting`;
   - the directive `feedback-bug-route`, named as present only with `software` (§7.2, path 3).
6. **`CHANGELOG.md`**, whose first line is a whole sentence naming what 1.0.0 holds; it becomes
   the tag annotation. **`README.md`**, per spec-002 §2:
   - **Generated sections** by `npm run index`.
   - **"When to use it":** the problem, the profiles it serves, and when not to use it.
   - **"Install and update":** §2.3's temporary mark, the catalog's install link, and the
     charter's Adoption for any project:
     - feedback kept elsewhere stays there;
     - a project's own `feedback` type, or a workflow or directive of the pack's names, is
       renamed or mapped first;
     - `upstream:<name>` is added to `feedback_targets` when an upstream pack is composed (§5.3);
     - no WingFoil CLI command in code (CB-3).
   - **"Sources and adaptations":** dl-012, the charter's four adaptations, and the routes'
     targets citing the item in their body until `base` and `software` ship `reported_by`.
   - **Section 7** links the examples, and **section 9** links the CHANGELOG and the catalog
     entry, as `kanban`'s.
   - The README names no real adopter.
7. **The examples** (spec-002 §2.4: fictional projects only, `.example` addresses), under
   `tests/fixtures/examples/feedback/`. Each is described in section 7 with its `Fixture:` line,
   a situation, what the project gets and how one phase runs, and each composes and validates:
   - `defaults`: `base@^2` and `governance/feedback@^1`, `base`'s four required parameters given
     and every other parameter on its default;
   - `with-software`: `software@^1`, `methodology/scrum@^1` and the pack, the `bug` route
     present;
   - `added-outcome`: `software@^1`, `methodology/kanban@^1` and the pack (each example gives
     only `base`'s four required parameters beyond its own), with its own
     `feedback_path` and `feedback_id`, and `deferred` added to `feedback_outcomes` (FA-2's
     second parameter set).

   The other packs' READMEs and examples are unchanged.
8. **The tests of point 8's [V] rows**, in a new `tests/feedback-pack.test.ts`, on the composed
   output of the `defaults` and `with-software` examples:
   - **FA-3:** the composed `feedback` type's `template.frontmatter.required` holds `kind`,
     `target`, `source` and `context`.
   - **FA-4:** `states.gates` holds `pending: { reject: draft }`, and `feedback-ingest` ›
     `triage` holds `memory.approve` with `approval: { by_role: approver }`.
   - **FA-6, the routing table:** the `feedback` directive holds the table under a fixed heading
     (`## Routes`), one row per outcome, each target workflow in backticks. The set of workflow
     names in that table is exactly `{decision-log-ingest, governance-evolution}`, each one of
     `base`'s workflows.
   - **FA-6, `bug` kept to the entry:**
     - no item `bug` in the composed `feedback-review` › `where.outcome`, nor in the list the
       directive substitutes from `{{feedback_outcomes}}`;
     - no file of the composed `defaults` output names `bug-ingest`: fragments, workflows,
       directives, template and AGENTS.md section. The lint's isolation checks read only
       `include`s and `roles.yaml`, not text.
   - **FA-1, the entry composed:** `with-software`'s composed output holds the workflows
     `feedback-bug-route` and `feedback-bug-item` and the directive `feedback-bug-route`;
     `defaults`' holds none of them.

   Red first (dl-018): the tests run before the pack exists and fail, on a composition error, as
   task-068's did. The red run's command and failing count are recorded.
9. **Validation:**
   - `npm run check:packs`, `npm run index -- --check` and `npm run validate` pass with no
     warning. Every new composition passes WingFoil 0.3.0's, 0.3.1's and 0.3.2's matrix
     (`tolerance applied: none`).
   - The overlays `software-exit`, `scrum-exit` and `kanban-exit`, and the golden tree, pass
     with 0 failed.
   - `npm run check:runs` passes, its count unchanged: no scenario names `feedback`'s examples
     before task-097.
   - `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and `llms.txt` are unchanged (an
     unpublished pack, spec-002 §3.1).
10. **The counts** that the tooling tests take on this repository move. Each is stated in the
    Execution Notes with the test it changes (dl-018): the lint's files, the index's files, the
    schemas, `validate`'s compositions and runs, the exit overlays' compositions and runs, and
    the publication run. The numbers are measured, not assumed, and any other moved count is
    named. No file under `src/` or `.wingfoil/` changes.
11. **Checks** (`kanban-delivery` › `review`, dl-039):
    - first, the build review and its amendments;
    - then, once, on the frozen commit: the branch CI `success`, its run id and every job's
      duration recorded (a job over 25 minutes goes to the approver, R3);
    - dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and
      `npm run build`: `npm run validate:publication`, the golden tree in publication mode and
      `npm run -s wingfoil -- workflow list`, each exit 0.
12. **A criterion that cannot hold as written**, or a fact of the charter or spec-003 the pack
    cannot follow, goes to the approver when found (dl-019), and the work on it waits.
13. **Delivery:**
    - the branch `task/task-096-feedback-pack` from `main`, in a worktree of its own;
    - the untracked draft is never staged;
    - after `approve`, a `--no-ff` merge on the approver's OK, `main` pushed, its CI read, and
      `approved → done`;
    - the privacy check of the branch's diff recorded (`repository-practice` rule 2).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-17: written under plan-076 step 2, from point 3 of its outline as ruled; `pack`,
  `depends_on` and `tags` filled by editing the draft (W-02).
- 2026-11-17: independent review (dl-017): approve after amendments; one blocker, six
  should-fix, seven nits, all applied; format 2, the examples' parameters, the composed output's
  reach and `entry-directive-scope` confirmed in the code.
  - **Blocker:** the FA-6 test could not ask the directive to name no `bug`, which criterion 4
    requires it to name (§4.2, §4.3). It now tests the item lists.
  - **Should-fix:**
    - no composed unconditional file names `bug-ingest`, since the lint's isolation reads no
      text;
    - the routing table read under a fixed heading, its set exact;
    - the entry composed in `with-software` and absent from `defaults`;
    - the kinds in the AGENTS.md section;
    - the classification rules, and the agent writing only listed values (§3.3);
    - the entry's directive: `feedback-bug-route` started and ended, `resulting` and the bug's
      citation.
  - **Nits:** §5.1 and §5.2 cited apart; this repository's `custom/` files in the name check;
    `base`'s four required parameters; the iterating phases; the draft deleted after task-097;
    format 2's departure cited; dl-039's three commands and `main` pushed.

  Criteria 4, 5 and 8 change: re-review.
