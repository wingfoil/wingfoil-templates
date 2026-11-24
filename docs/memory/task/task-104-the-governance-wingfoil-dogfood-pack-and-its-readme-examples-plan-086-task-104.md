---
id: task-104-the-governance-wingfoil-dogfood-pack-and-its-readme-examples-plan-086-task-104
type: task
title: "The governance/wingfoil-dogfood pack and its README examples (plan-086 task-104)"
status: draft
pack: "pack-governance-wingfoil-dogfood"
depends_on: []
tags: ["packs","dogfood","governance"]
---

## Context

plan-086 (`pack-cycle › author` of `pack-governance-wingfoil-dogfood`), points 1 and 2 and their
rulings of 2026-11-24. This task writes `packs/governance/wingfoil-dogfood` from three sources:
- **the charter** (accepted under plan-085): Ships, Adaptations, Commitments, Adoption,
  Acceptance, Open points;
- **dl-051** (approved): D1 … D5, Q2 (a) and Q3 (a);
- **this repository's custom `wingfoil-cli`** (1.6, `.wingfoil/directives/custom/wingfoil-cli.md`):
  rules 1 … 7 and the known behaviours' table form, the source of the pack's directive.

The pack, its README and its examples come in one change: the layout and the README rules make a
pack directory without them fail the lint (plan-086 point 1). The tests of WD-2 and WD-3 come with
it, as a developer change under `tests/` inside a pack task, as task-096's were. task-105 (the
route through the channel in `check:runs`, the note's checks, the adoption run prepared) builds on
this task's examples.

**plan-086's ruling on the source key** (point 2, option (b)): the pack has no
`wingfoil_source_key`; the inbox's **Source key** line is the one source, and rule 7 reads it.
The departures from dl-051 Q3 (a) and from the charter are recorded on both at plan-086's close.

## Acceptance

1. **`packs/governance/wingfoil-dogfood/pack.yaml`**:
   - **Identity:** `format: 2`, `id: governance/wingfoil-dogfood`, `axis: governance`,
     `name: wingfoil-dogfood`, `title: "WingFoil dogfood"`, a `description`, `version: 1.0.0`.
   - **Formats:** `roles` and `directive`, both 1.
   - **Requirements:** `requires: [base@^2, governance/feedback@^1]`, `conflicts: []`,
     `requires_capabilities: []`, no entry, no `tensions`.
   - **Parameters:** three, each with a description saying what the value is:
     - `wingfoil_command` (string, no default): the command that runs the project's pinned
       WingFoil CLI;
     - `wingfoil_inbox_path` (path, `docs/wingfoil-feedback`);
     - `wingfoil_known_behaviours_path` (path, `docs/wingfoil-known-behaviours.md`).

     No default holds a project value of this repository (`svc-018`, its CLI command).
   - **Contents:** the fragment `roles` and the directives `wingfoil-cli` and
     `wingfoil-channel`; no workflow, no Memory type or template, no `agents/section.md`.
2. **`fragments/roles.yaml`**: `global: [wingfoil-cli]` and `assignments: { facilitator:
   [wingfoil-channel] }`, nothing else (spec-001 §7.4).
3. **`directives/wingfoil-cli.md`**, WingFoil 0.3.0's directive frontmatter as
   `governance/feedback`'s directives have it (`kind: built-in`, `format: 1`), no version line:
   - **Scope:** global, every role, human or agent, that runs the WingFoil CLI in the project.
   - **Rules 1 … 7** of custom 1.6, their content unchanged but for (charter Ships, WD-6, plan-086
     point 2):
     - rule 1's command written as `{{wingfoil_command}}`;
     - the inbox written as `{{wingfoil_inbox_path}}` in rules 3 and 7;
     - rules 2 … 5 pointing at the entries file `{{wingfoil_known_behaviours_path}}`, not at "an
       entry below", "the entry" or "this directive's version"; rule 5's bump the entries file's
       *Checked against*;
     - "the project" for "this repository" in the scope line and rule 7;
     - rule 7's source key read from the inbox's **Source key** line, with the clause that while
       the line is empty WingFoil has not registered the project and there is nothing to sync.
   - **The known behaviours:** the entries file's form (a *Checked against* line, the table `#`,
     Behaviour, How to work with it, Note, WingFoil element) and that its entries are the
     project's, for its own pin.
   - No rule 8 and no entry of this repository's table.
4. **`directives/wingfoil-channel.md`**, the same frontmatter with `tags: [feedback-channel]`,
   holding the line ``Serves the target `upstream:wingfoil`.`` once, outside frontmatter and
   fences (spec-003 §5.1, §11), and as the charter's Ships says:
   - the kind mapped onto dl-163's: `defect`, `gap` and `request` one to one, `observation` to
     `request` (dl-012 D3);
   - the note written as `F-<nnn>-<slug>.md` in `{{wingfoil_inbox_path}}` with dl-163 R4's six
     fields, `## Observed` and `## Expected`, and no `## Replies` section;
   - the feedback id cited in the note's body, the item's `resulting` naming the note's path;
   - the note's row added to the inbox's ledger.
5. **Names:** neither directive id nor a parameter name equals a WingFoil 0.3.2 built-in, a
   `custom/` file of `init --template Scrum` or `--template Kanban`, or a name of the catalog's
   packs or of `tests/fixtures/`, except `wingfoil-cli` in this repository's own `custom/`, kept
   as ruled (charter Names). Checked by listing them in this task, as task-096 did.
6. **`CHANGELOG.md`**, whose first line is a whole sentence naming what 1.0.0 holds.
   **`README.md`**, per spec-002 §2:
   - **Generated sections** by `npm run index`.
   - **"When to use it":** a WingFoil project that sends its feedback about WingFoil back to it;
     when not to use it.
   - **"Install and update":** §2.3's temporary mark, the catalog's install link, and as text, with
     no WingFoil CLI command in code (CB-3, `isCliCommand`):
     - the inbox at the inbox path, with its skeleton: Rules naming the pack's `wingfoil-cli`,
       Ledger, Context, the **Source key** and **Last sync** lines;
     - the empty entries file at the entries path;
     - `upstream:wingfoil` added to `feedback_targets`;
     - the CLI command to set, described ("the command that runs the project's pinned WingFoil
       CLI"), and the **Source key** line filled once WingFoil registers the project;
     - a project's own `wingfoil-cli` directive removed in the same change (one id per
       composition).
   - **"Sources and adaptations":** dl-012 D3, dl-051, and the charter's three adaptations plus a
     fourth, rule 7's key read from the inbox's line (plan-086 point 2).
   - **Section 7** links the examples, and **section 9** links the CHANGELOG and the catalog
     entry, as `governance/feedback`'s.
   - The README names no real adopter.
7. **The examples** (spec-002 §2.4: fictional projects only, `.example` addresses), under
   `tests/fixtures/examples/wingfoil-dogfood/`, each described in section 7 with its `Fixture:`
   line, a situation, what the project gets and how one route runs; each composes and validates:
   - `defaults`: `base@^2`, `governance/feedback@^1` and the pack; `base`'s four required
     parameters, `wingfoil_command` and `feedback_targets` (with `upstream:wingfoil`) set; the
     pack's other parameters on their defaults;
   - `with-software`: `software@^1` and `methodology/kanban@^1` added, its own
     `wingfoil_inbox_path` and `wingfoil_known_behaviours_path`.

   The other packs' READMEs and examples are unchanged.
8. **The tests**, in a new `tests/wingfoil-dogfood-pack.test.ts`, on the pack's files and the
   composed output of both examples:
   - **WD-2:** `wingfoil_command` has no default; no parameter default and no text of the
     composed directives holds `svc-018`, and no default holds a WingFoil command as
     `isCliCommand` (`src/readme-rules.ts`) reads one; the two examples' parameter values differ
     and both compose.
   - **WD-3:** the lint's `feedback-channel` checks, run on the tree with the pack, report
     nothing, and read `wingfoil-channel` as the one channel serving `upstream:wingfoil`.
   - **The bindings:** the composed `roles.yaml` holds `wingfoil-cli` in `global` and
     `wingfoil-channel` under `facilitator`.

   Red first (dl-018) where the test can fail before the pack exists (WD-2, the bindings: a
   composition error), the red run's command and failing count recorded; WD-3's is green when
   written, since the channel lands in the same commit as its test's first run (plan-086 point 2).
9. **Validation:**
   - `npm run lint`, `npm run check:packs`, `npm run index -- --check` and `npm run validate`
     pass with no warning; the new compositions pass WingFoil 0.3.0's and 0.3.2's matrix
     (`tolerance applied: none`).
   - The overlays `software-exit`, `scrum-exit`, `kanban-exit` and `feedback-exit`, and the golden
     tree, pass with 0 failed.
   - `npm run check:runs` passes, its count unchanged: no scenario names this pack's examples
     before task-105.
   - **WD-7:** `presets/` unchanged and `npm run validate`'s preset compositions unchanged.
   - `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged (an
     unpublished pack, spec-002 §3.1).
10. **The counts** that the tooling tests take on this repository move: each stated in the
    Execution Notes with the test it changes (dl-018), measured, not assumed. No file under
    `src/`, `.wingfoil/` or `presets/` changes.
11. **Checks** (`kanban-delivery` › `review`, dl-039): first the build review and its
    amendments; then, once, on the frozen commit, the branch CI `success`, its run id and every
    job's duration recorded (a job over 25 minutes goes to the approver, R3); dl-039's local list
    on Node.js 22.21.0, from a clean working tree after `npm ci` and `npm run build`: `npm run
    validate:publication`, the golden tree in publication mode and `npm run -s wingfoil --
    workflow list`, each exit 0.
12. **WD-6 [A]:** the review reads rules 1 … 7 against custom 1.6 and lists every difference;
    the approver reads them at `approve`.
13. **A criterion that cannot hold as written**, or a fact of the charter the pack cannot
    follow, goes to the approver when found (dl-019), and the work on it waits; a change under
    `src/` found needed stops the task (plan-086 point 4).
14. **Delivery:** the branch `task/task-104-wingfoil-dogfood-pack` from `main`, in a worktree of
    its own; after `approve`, a `--no-ff` merge on the approver's OK, `main` pushed by the
    approver, its CI read, and `approved → done`; the privacy check of the branch's diff recorded
    (`repository-practice` rule 2).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
