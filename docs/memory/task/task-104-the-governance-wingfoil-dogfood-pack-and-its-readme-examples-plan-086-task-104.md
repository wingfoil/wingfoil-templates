---
id: task-104-the-governance-wingfoil-dogfood-pack-and-its-readme-examples-plan-086-task-104
type: task
title: "The governance/wingfoil-dogfood pack and its README examples (plan-086 task-104)"
status: in-progress
pack: "pack-governance-wingfoil-dogfood"
depends_on: []
tags: ["packs","dogfood","governance"]
---

## Context

plan-086 (`pack-cycle › author` of `pack-governance-wingfoil-dogfood`), points 1 and 2 and their
rulings of 2026-11-24. This task writes `packs/governance/wingfoil-dogfood` from three sources:
- **the charter** (accepted under plan-085): Ships, Adaptations, Commitments, Adoption,
  Acceptance, Open points;
- **dl-051** (approved): D1 … D5, D2 ruling Q1 (a) … Q4 (a);
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
2. **`fragments/roles.yaml`**: beside `format: 1`, `global: [wingfoil-cli]` and `assignments:
   { facilitator: [wingfoil-channel] }`, nothing else (spec-001 §7.4).
3. **`directives/wingfoil-cli.md`**, WingFoil 0.3.0's directive frontmatter as
   `governance/feedback`'s directives have it (`kind: built-in`, `format: 1`), `tags: [wingfoil,
   cli, governance]` (no `custom`), no version line and no version in a heading:
   - **Scope:** global, every role, human or agent, that runs the WingFoil CLI in the project.
   - **Rules 1 … 7** of custom 1.6, their content unchanged but for (charter Ships, WD-6, plan-086
     point 2):
     - rule 1's command written as `{{wingfoil_command}} …`, the ` --` part of the value (as
       `npm run -s wingfoil --`), its "never a global `wingfoil`" kept;
     - the inbox written as `{{wingfoil_inbox_path}}` in rule 3, and its README as
       `{{wingfoil_inbox_path}}/README.md` in rule 7;
     - rules 2 … 5 pointing at the entries file `{{wingfoil_known_behaviours_path}}`, not at
       "where an entry says so", "an entry below", "the entry" or "this directive's version";
       rule 5's bump the entries file's *Checked against*;
     - "the project" for "this repository" in the scope line and rule 7;
     - rule 7's source key read from the inbox's **Source key** line, with the clause that while
       the line is empty WingFoil has not registered the project and there is nothing to sync.

     Rule 6, with "WingFoil cites a note as `<service id>/F-<nnn>@<sha>`", stays verbatim.
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
   - the note's row added to the ledger in `{{wingfoil_inbox_path}}/README.md`.
5. **Names:** neither directive id nor a parameter name equals a built-in of WingFoil 0.3.0 …
   0.3.2, a `custom/` file of `init --template Scrum` or `--template Kanban`, or a name of the
   catalog's packs, of `presets/` or of `tests/fixtures/`, except `wingfoil-cli` in this
   repository's own `custom/`, kept as ruled (charter Names). Checked by listing them in this
   task, as task-096 did.
6. **`CHANGELOG.md`**, whose first line is a whole sentence naming what 1.0.0 holds.
   **`README.md`**, per spec-002 §2:
   - **Generated sections** by `npm run index`.
   - **"When to use it":** a WingFoil project that sends its feedback about WingFoil back to it;
     when not to use it.
   - **"Install and update":** §2.3's temporary mark, the catalog's install link, the generic hand
     steps as `governance/feedback`'s README has them (compose with `base` and
     `governance/feedback`, copy `.wingfoil/`, record the adopted version; CB-3), and as text,
     with no WingFoil CLI command in code (CB-3, `isCliCommand`):
     - the inbox's `README.md` at the inbox path, with its skeleton: Rules naming the pack's
       `wingfoil-cli`, Ledger, Context, and the lines `**Source key:**` and `**Last sync:**` (the
       form `assertLedger` matches), the **Source key** line empty (nothing after the label)
       until WingFoil registers the project;
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
   - The README names no real adopter, and section 7 quotes no example's `wingfoil_command` in
     a code span (`readme-command`).
7. **The examples** (spec-002 §2.4: fictional projects only, `.example` addresses), under
   `tests/fixtures/examples/wingfoil-dogfood/`, each described in section 7 with its `Fixture:`
   line, a situation, what the project gets and how one route runs; each composes and validates,
   and each sets `base`'s four required parameters, `wingfoil_command` and `feedback_targets`
   with `upstream:wingfoil`:
   - `defaults`: `base@^2`, `governance/feedback@^1` and the pack; the pack's other parameters on
     their defaults;
   - `with-software`: `software@^1` and `methodology/kanban@^1` added, and its own
     `wingfoil_inbox_path` and `wingfoil_known_behaviours_path`.

   The other packs' READMEs and examples are unchanged.
8. **The tests**, in a new `tests/wingfoil-dogfood-pack.test.ts`, on the pack's files and the
   composed output of both examples:
   - **WD-2:** `wingfoil_command` has no default; no parameter default and no text of the
     composed directives holds `svc-018`; in the pack's directive files as written (before
     substitution), no code span is a command for `isCliCommand(text, false)` and no fenced line
     one for `isCliCommand(text, true)` (`src/readme-rules.ts`), nor is any parameter default
     a command for `isCliCommand(value, false)`; the two examples' parameter values differ and
     both compose.
   - **WD-3** (`src/feedback-channel.ts`, as `check:packs` and `validate` call it):
     `channelProblems` on the pack's directive files, with `requiredIds` the ids of its
     `requires` (`base`, `governance/feedback`), returns nothing;
     `isChannel` holds for `wingfoil-channel.md` only, and its `servedTargets` equal
     `['upstream:wingfoil']`; `channelConflicts` on each example's composed
     `.wingfoil/directives/built-in/*.md`, each given as `path: directives/<name>.md` as
     `validate` maps them (`src/validate.ts`), returns nothing, and at least one of them
     `isChannel`.
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
   - **WD-7:** `git diff --exit-code main -- presets/` exit 0, and `npm run validate`'s preset
     lines equal to `main`'s.
   - `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged (an
     unpublished pack, spec-002 §3.1).
10. **The counts** that the tooling tests take on this repository move (the lint's files, the
    index's files, `validate`'s compositions and runs, the exit overlays' compositions and runs,
    the publication run): each stated in the Execution Notes with the test it changes (dl-018),
    measured, not assumed, and any other moved count named. No file under
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

Branch `task/task-104-wingfoil-dogfood-pack` from `main` at `3216607c` (the approve), in a
worktree of its own.

**Names (criterion 5), checked 2026-11-24:** `wingfoil-channel`, `wingfoil_command`,
`wingfoil_inbox_path`, `wingfoil_known_behaviours_path` and `governance/wingfoil-dogfood` occur
nowhere in `packs/`, `presets/`, `tests/fixtures/` or `src/wingfoil-builtins.ts`, nor in the
`dist/` of WingFoil 0.3.0, 0.3.1 and 0.3.2 (whose built-in directives are the same six:
`architecture`, `code-quality`, `code-review`, `documentation`, `security`, `testing`; `init`'s
`custom/` files come from that `dist/`); `wingfoil-cli` occurs only in this repository's
`.wingfoil/directives/custom/`. The charter's names stand (Open point 1).

**Files:**
- `packs/governance/wingfoil-dogfood/`: `pack.yaml`, `fragments/roles.yaml`,
  `directives/wingfoil-cli.md`, `directives/wingfoil-channel.md`, `README.md`, `CHANGELOG.md`;
- `tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml` (Shearwater Docs, a fictional
  documentation site with no methodology) and `with-software/example.yaml` (Fulmar Tickets, a
  fictional ticketing service flowing its work with Kanban, its inbox under
  `docs/upstream/wingfoil` and its entries in `docs/upstream/wingfoil-known-behaviours.md`); each
  `wingfoil_command` a fictional pinned script (`npm run -s wf --`), not a WingFoil command for
  `isCliCommand`;
- `tests/wingfoil-dogfood-pack.test.ts` (criterion 8), on the model of
  `tests/feedback-pack.test.ts`: the examples composed with `composeDocuments`, the pack's files
  read from `packs/`;
- the count tests that move (criterion 10), found by running the suite after the pack lands.

**The directives' text:** `wingfoil-cli`'s rules 1 … 7 copied from custom 1.6 and changed only
as criterion 3 lists; its known-behaviours section states the entries file's form with an empty
table header and rule 5's re-check. `wingfoil-channel`'s text follows criterion 4 and FA-8's
fixture channel for the "Serves the target" line.

**Order and red (dl-018):** the test file first, run before the pack exists: WD-2 and the
bindings fail on a composition error (the red run's command and failing count recorded); then
the pack, its README and the examples; then `npm run index` for the generated sections; then the
validation of criterion 9 and the counts.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-24: independent review of the body (dl-017, `f8964e69`): approve after amendments; no
  blocker, four should-fix (WD-2's command check on the directive files as written, with
  `isCliCommand`'s `codeLine` stated; both examples setting `wingfoil_command` and
  `feedback_targets`; rule 7's and the ledger's file the inbox's `README.md`; WD-3's checks named
  as `src/feedback-channel.ts` exports them) and eight nits (the tags and the heading's version;
  rule 2's phrase and rule 6 kept verbatim; `format: 1` beside the roles; the `**Source key:**`
  and `**Last sync:**` lines and "empty"; the generic install steps; no example's command quoted
  in the README; the names check over 0.3.0 … 0.3.2 and `presets/`; dl-051 D2's rulings, WD-7's
  check, the counts listed), all applied in the commit that records this note.
- 2026-11-24: re-review of the amendments (`996dcb42`): approve after amendments; no blocker, one
  should-fix (`channelConflicts` given the composed files as `validate` maps them, with at least
  one channel, so the check cannot pass empty) and four nits (`requiredIds` stated; criterion 7's
  sentence; the ` --` part of `wingfoil_command`'s value; criterion 8's missing noun), all
  applied in the commit that records this note; "empty" kept to the **Source key** line, since
  this repository's inbox writes `**Last sync:** none.` No further re-review: the fixes state
  the checks' inputs, no criterion's intent changes.
- 2026-11-24: red (dl-018, `2bae0a88`): `node --test dist/tests/wingfoil-dogfood-pack.test.js`
  before the pack existed, 8 tests, 8 failing (the pack's files and examples missing). WD-3's
  two tests were red too, on the missing files, not on a rule: criterion 8's "green when
  written" reads the channel's own check, which passed at its first run beside the channel.
- 2026-11-24: build (`a2439389`): the pack, its README and CHANGELOG, the two examples, and the
  moved counts. `npm run index` wrote the README's generated sections; the Versions section's
  catalog link is a link reference, so that its line stays under the 100-character rule
  (dl-046 P1 exempts a link reference line). The source key's adaptation is the README's fourth
  bullet beside the charter's three (the rules' generalisation, the known behaviours, the inbox
  skeleton).
- 2026-11-24: the counts (criterion 10), measured on this branch: the lint's files 93 → 101
  (`tests/check-packs.test.ts`, `tests/validate-2-run.test.ts`: the six pack files and the two
  examples); the schemas 9 → 10 (one more `pack.yaml`); the index's files 8 → 9
  (`tests/index.test.ts`: one more README); `validate`'s compositions 14 → 16 and runs 28 → 32;
  each exit overlay +2 compositions and +4 runs (`software-exit`, `scrum-exit`, `kanban-exit`
  18 → 20 and 36 → 40; `feedback-exit` 22 → 24 and 44 → 48); the publication run 28 → 32. No
  other count moved: the full suite before the update had 1497 tests, 8 failing, exactly these.
  After it the four files ran 179 tests, 0 failing. `npm run validate`: 0 failed, `tolerance
  applied: none`, each example on 0.3.0 and 0.3.2 (`defaults[+software]` skipped, no
  methodology). `check:packs`, `index -- --check`, `check:pins`, `check:schemas` and eslint pass.
- 2026-11-24: build review (dl-017, `a8785db6`): approve after amendments; no blocker, two
  should-fix (criterion 9's evidence recorded below; `with-software`'s example teaching the
  wrong kind, now an `observation` sent as a `request`, its route told to the close) and seven
  nits (`conflicts: []` written; the channel's evidence citing `wingfoil-cli` rule 3, with the
  commit; rule 7's source-key clause back in a parenthesis, as custom 1.6's; the inbox's Rules
  naming both directives; the schemas' count's test, `tests/validate-2-run.test.ts`; the WD-2
  scan asserting it sees code spans), applied in `409d3828`; one nit not applied: "its trailing
  `--` included" kept, as criterion 3 writes it. The review's WD-6 list: thirteen differences
  from custom 1.6 (the heading and version line, the scope line, rules 1 … 5's parameters and
  entries file, rule 7's source key, Last sync path and empty-key sentence, rule 8 and the
  table's entries absent), each one criterion 3 allows; rule 6 verbatim. No re-review: the fixes
  change the example's text and the test's guard, not a criterion or a recommendation.
- 2026-11-24: criterion 9, on `409d3828`: `npm run check:runs` 84 runs, 0 failed, the count of
  `main` (task-098's); the golden tree (`npm run validate -- --tree tests/fixtures/compose/tree
  --param project_name=Golden`) 26 runs, 0 failed, the tolerance its test expects (`0.2.2`);
  `npm run validate` 16 compositions, 32 runs, 0 failed, `tolerance applied: none`; WD-7: `git
  diff --exit-code main -- presets/` exit 0, and `validate`'s 14 preset lines equal to `main`'s;
  `catalog.yaml`, `CATALOG.md`, `catalog-index.json`, `llms.txt`, `src/` and `.wingfoil/`
  unchanged (`git diff --stat main`); the exit overlays through `tests/validate-2-run.test.ts`
  (179 tests, 0 failing, above).
- 2026-11-24: dl-039's checks (R2), after the build review and its amendments, on the frozen head
  `73a1c452` (the code frozen at `409d3828`, the later commit documentation only): branch CI run
  45430259230 `success`, its jobs (22.12.0, 1) 10 min 24 s, (22.21.0, 1) 10 min 25 s, (22.12.0,
  2) 9 min 1 s, (22.21.0, 2) 8 min 57 s, none over 25 minutes, the step "Texts, the lines this
  branch adds" `success`; locally on Node.js 22.21.0, from a clean working tree after `npm ci`
  and `npm run build`: `npm run validate:publication` exit 0 (32 runs, 0 failed, `tolerance
  applied: none`), the golden tree in publication mode exit 0 (26 runs, 0 failed) and `npm run
  -s wingfoil -- workflow list` exit 0. The privacy check of the branch's diff is clean
  (`repository-practice` rule 2). This note is documentation only: no new run.
