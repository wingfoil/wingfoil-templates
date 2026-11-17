---
id: plan-075-tooling-change-before-governance-feedback-s-author-the-spec-003-and-fixture-element-checks-and-feedback-notes-f-048-to-f-051
type: plan
title: "tooling-change: before governance/feedback's author, the spec-003 and fixture-element checks and feedback notes F-048 to F-051"
status: active
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","feedback","governance","W10"]
---

## Context

The sequencer's W10 order holds `governance/feedback` after the presets. Its charter (plan-073)
and its design (plan-074, spec-003 approved) are done. Two rows of
`docs/owed-items.md` are due "before `governance/feedback`'s first `author` task", each with the
approver as owner:
- **"The fixture-element checks"** (dl-012 D8; pack-governance-feedback › Acceptance; plan-074
  rulings; spec-003 §11): a test helper reading a fixture project's Memory elements, with the
  composer's and the lint's checks of spec-003;
- **"Two feedback notes to WingFoil"** (plan-073 ruling 5, step 2; plan-074 point 10): the two
  defects of plan-073's run on 0.3.2, with the two requests of spec-003 S3-O1 and S3-O2.

This plan delivers both through `tooling-change` v3 › `deliver`, each task through
`tooling-delivery` v4 with `pack: ""`. The approver asked for it on 2026-11-16, after
plan-074's close.

**The tech-specs this wave builds on** (dl-020): spec-001 and spec-003, both on `main` with
plan-074's fold-back; no erratum waits to be folded back.

**`main`'s CI before this plan** (dl-038 C3): run 43877166222 on `795e8ee5` (plan-074's close
and submit), `success`.

**The code the checks touch** (read for this plan):
- `src/parameters.ts`: `checkValue` (the type check), `referencesIn` (every `{{name}}` with its
  offset), `resolveParameters` (every value type-checked before substitution), `substitute`;
- `src/pack-files.ts` › `readPackFiles`: the lint's `parameter-default` and `parameter-scope`
  rules, walking `referencesIn` with offsets;
- `src/compose-documents.ts` › `composeDocuments`, which calls `resolveParameters`, and
  `readFiles`, which holds each file's raw text before `substitute`;
- `src/workflow-rules.ts` › `workflowProblems`, run by the lint and the composer, which builds
  each conditional entry's known directives (the pack's, its required packs', the `with` pack's
  and its required packs', the entry's own) and walks the entry's workflows;
- `src/tree-rules.ts` › `presetChecks` (`preset-value`), reused by `src/example-rules.ts` for
  README examples (`example-fixture`); `src/preset-stand-ins.ts`, the validation's stand-ins
  for `base`'s required parameters;
- no helper reads a fixture project's Memory elements today; `src/frontmatter.ts` reads a
  frontmatter.

## Proposed outline (ruled by the approver before `submit`)

1. **Three tasks, not two.** The fixture-element row holds two different pieces of work: the
   composer's and the lint's rules of spec-003 §11, which change what `npm run validate` and the
   composer accept for every pack, and a test helper for fixture projects, which changes nothing
   that runs on the published packs. One task per piece keeps each review on one subject:
   - **(A) the feedback notes** F-048 … F-051 (content-only);
   - **(B) spec-003's composer and lint checks**;
   - **(C) the fixture-element checks** (the helper and its tests).

   Recommended. The alternative keeps (B) and (C) as one task, as the row reads. plan-074's
   ruling joined the tooling checks to the row of the fixture-element checks; the split changes
   how that one row is delivered, not that ruling.
2. **Order and branches**, as plan-066: WIP 1, (A) → (B) → (C), each task added on `main` once
   the one before is `done` (W-14), each on its own `task/<id>-<slug>` branch merged `--no-ff`
   into `main` on the approver's OK, `main`'s CI read after each merge. (A) first, since it is
   short and blocks nothing; (C) after (B), since its allowed values read the list parameters
   that (B) defines in code.
3. **(A) the notes**, as task-077:
   - **F-048** (`defect`): a later run of a main workflow names its plan (id, `phase`,
     `element`) after the previous run's element;
   - **F-049** (`defect`): the refusal to adopt an element another run owns names `workflow
     transfer`, which 0.3.2 does not have;
   - **F-050** (`request`): an allowed-values key for a frontmatter field in `memory.yaml`, so a
     value outside a list is refused at `memory submit` (spec-003 S3-O1);
   - **F-051** (`request`): a directive binding per workflow phase, so a conditional entry's
     directive reaches the agent at its step without naming it in an action text (spec-003
     S3-O2).

   Each note: the six fields by hand, `wingfoil_version: 0.3.2`, "New note (task-…).", `## Observed`
   with 0.3.2's commit, commands, output and exit codes (for a request, what 0.3.2 does instead) and
   `## Expected`. The inbox searched for duplicates first: F-043 (and F-018, which it cites) for
   F-050; F-016 (a phase cannot declare its method) and F-026 (directives per role, one role per
   phase) for F-051. F-048 and F-049 are reproduced in a scratch project with 0.3.2 from
   `src/matrix/wingfoil-0.3.2/`, fictional `.example` identities, no pack named beyond what WingFoil
   alone shows; a point that does not reproduce goes to the approver. One commit per note with its
   ledger row. The red by mutation of the inbox tests, as task-077.
4. **(B) the composer and the lint** (spec-003 §3, §5.2, §7.2, §11; spec-001 §6.5, §8.1, §8.2,
   §18):
   - **list parameter:** a `string` whose `description` begins with "List of", read in one place
     (`src/parameters.ts`);
   - **the item rule** (at least one item, unique, the regex, none of the nine words): the
     composer on every value before substitution (`resolveParameters`); the lint on defaults
     (`parameter-default`), presets (`preset-value`) and examples (`example-fixture`), under
     those rule ids; no list parameter is required today, and a required one would need its
     own stand-in in `src/preset-stand-ins.ts`, passing the item rule, added with it;
   - **the placement rule:** in a substituted YAML file or a Markdown file's YAML frontmatter
     (not `pack.yaml`), every `{{name}}` of a type other than `integer` and `boolean` stands
     inside a double-quoted scalar, or, for a list parameter in the files of the pack that
     declares it, as the whole content of a flow sequence. One lexical function in
     `src/parameters.ts` (a token scan, since raw YAML with an unquoted `{{name}}` may not parse)
     serves the lint (a new rule, `parameter-placement`, in `readPackFiles`) and the composer
     (in `readFiles`, on the raw text before `substitute`);
   - **an entry's `agent.execute`:** an action of a conditional entry's workflows that names a
     directive names one in the entry's scope; a new rule, `entry-directive-scope`, in
     `workflowProblems`, which already holds that scope. The composer runs `workflowProblems`
     too, so it applies the rule as well; spec-003 §11 asks it of the lint only, and the
     composer refusing what the lint rejects is spec-001 §18's general rule;
   - **the `feedback-channel` checks** (spec-003 §5.2): a directive tagged `feedback-channel` is
     shipped by a pack that requires `governance/feedback` and holds one line ``Serves the target
     `upstream:<name>`.``, a lint rule per pack; no composition holds two channels for one
     target, a lint check "in a composition of the tree" (spec-003 §5.2, §11): run on the
     compositions the lint and `validate` make (presets, examples, entries, the lint's overlay
     combinations), not inside `composeDocuments`, so `npm run compose` does not refuse a project
     holding two channels, the case §5.2 leaves to the facilitator and the approver. The pack id
     and the tag are constants in one module, the first rule of `src/` that names a pack, as
     spec-003 §10.1 and §11 keep these checks this pack's;
   - **the published packs pass unchanged:** the build checks every pack of the tree against the
     new rules first; a published pack that fails goes to the approver before any rule changes
     (dl-019). spec-003 §3.1 found only `methodology/kanban`'s two `integer` parameters
     unquoted, which the placement rule exempts;
   - **tests the new rules pre-empt:** the two tests of `tests/compose-documents.test.ts` that
     place a `string` unquoted (`x: {{s}}`, `d: {{s}}`) to reach a parse failure after
     substitution are rewritten in design, the reason recorded (dl-018), never left passing on
     another error; `readFiles`' parse check after substitution is kept as a defence.
5. **(C) the fixture-element checks** (dl-012 D8, spec-003 §11), all [E]: generic functions under
   `tests/support/`, reading a composed fixture project's Memory elements through
   `src/frontmatter.ts`. They name no pack: the composed `memory.yaml` declares neither allowed
   values nor references (spec-003 §3.1, F-043), so the caller passes the bindings:
   - required fields, from the composed `memory.yaml`;
   - allowed values: for each field, the list parameter that governs it and the items the
     composed entries add;
   - references that resolve, for the fields the caller names, of the three kinds of FA-5 (an
     element id, a declared workflow and phase, a version);
   - back-references through `reported_by` or the body (spec-003 §8);
   - the fields a given state requires (for `governance/feedback`, `outcome` and `resulting` on
     `closed`);
   - an item refused in a list parameter of every preset and example (for `governance/feedback`,
     `bug` in `feedback_outcomes`); it reads presets and `example.yaml` files, and spec-003 §11
     places it among the fixture-element checks [E].

   Their tests run on a fixture written by the test (as `tests/support/examples.ts` does). The
   bindings to `governance/feedback` (its fields, `feedback_outcomes` plus the entry's `bug`,
   `outcome` and `resulting` on `closed`, `bug` refused in `feedback_outcomes`) are its `author`
   phase's tests: (C)'s close adds an Open row for them, trigger "`governance/feedback`'s
   `author` task", cited by its note (rule 4).
6. **Checks of every task** (dl-039): the build review and its amendments first, then once on the
   frozen commit the branch CI green, every job's duration recorded (R3, G12), and the local list
   on Node.js 22.21.0 from a clean working tree after `npm ci` and `npm run build`
   (`validate:publication`, the golden tree in publication mode, `workflow list`); (A) adds
   `node --test dist/tests/wingfoil-feedback.test.js dist/tests/feedback-note.test.js` and `npm
   run lint`.
7. **The owed rows:** "Two feedback notes to WingFoil" moves to Closed in (A)'s close commit,
   settled by (A); "The fixture-element checks" in (C)'s, settled by (B) and (C) (plan-075), as
   the task-066 and task-070 row (or by the joint task).
8. **An erratum found while building** (a rule of spec-001 or spec-003 that code cannot check as
   written) goes to the approver when found (dl-019), is recorded in the tech-spec's Execution
   Notes (dl-019 R5, dl-020 R1) and is listed at the wave close (dl-020).

**Not in this plan:**
- `governance/feedback`'s `author` phase and its fixtures;
- `reported_by` in `base`'s and `software`'s templates (the pack release round, S3-O4);
- the adapter for `agent execute` (S3-O3, at the adoption);
- a rule on a workflow's `checks` string, which is a review rule at `pack-release-cycle` ›
  `prepare` (spec-001 §18), not a lint;
- `governance/wingfoil-dogfood`;
- the charter's FA-8 (factoring `tests/wingfoil-feedback.test.ts`'s checks) and FA-7 (a commit
  citing the decision-log): the `author` phase's.

## Steps

1. **This plan:** an independent review (dl-017) and a re-review if a fix changes a point; the
   approver's OK on the outline; `submit` (`draft → active`).
2. **Task (A)** (`tooling-delivery` v4, `pack: ""`): added on `main` (`memory add --type task`,
   the printed id checked, W-14); its body reviewed; `pending → backlog` by the approver; on its
   branch, design, build, build review, checks, `in-review`; the approver's approval and merge
   OK; merged `--no-ff`, `main`'s CI read; its close records the privacy check of its branch's
   diff (rule 2); its owed row moved to Closed.
3. **Task (B)**, the same way, once (A) is `done`.
4. **Task (C)**, the same way, once (B) is `done`; its owed row moved to Closed, the row of the
   bindings added (point 5).
5. **Close:** the plan's own privacy check (rule 2); dl-020: the errata and rulings per
   tech-spec listed (none expected), the approver's ruling recorded; this plan `active → done`;
   the CI of the close's push left to the next plan (dl-038 C3).

## Handoff

- **The approver:** the OK on the outline; each task's `backlog`, approval and merge OK; any
  finding of point 4 or 8.
- **Alone:** each task's body, design, build, checks and notes; the reviews by an independent
  reviewer (a subagent with no part in the text). No pull request; files staged by name; the
  privacy check before every commit (`repository-practice` rule 2).
- **Done when:** F-048 … F-051 in the inbox with their ledger rows; `npm run validate` and the
  composer apply spec-003's item and placement rules, the entry-directive rule and the
  `feedback-channel` checks, every published pack passing; the fixture-element helper in
  `tests/support/` with its tests; the two owed rows Closed; `main`'s CI green after each merge,
  its jobs' durations recorded.

## Execution Notes

- 2026-11-16: written from the two owed rows and plan-074's close. Next free numbers when
  written: plan-076, spec-004, task-092, bug-017, dl-043, F-048.
- 2026-11-16: independent review (dl-017): approve after amendments; no blocker, eight
  should-fix, nine nits, all applied in the commit that records this note. The composer's sites
  named (`readFiles`, `composeDocuments`), one lexical placement function for the lint and the
  composer; `entry-directive-scope` in `workflowProblems`, which holds the entry's scope, the
  composer applying it too; one channel per target in `composeDocuments`, the pack id and tag as
  constants; (C)'s functions generic, the caller passing the bindings, the refused item read from
  presets and examples; the tests the placement rule pre-empts rewritten; F-016 and F-026 for
  F-051's duplicate search; the fixture row settled by (B) and (C); plan-074's ruling cited;
  nits: rule 1's phrase, spec-001 §6.5, `pack.yaml` excluded, the stand-ins, FA-5's three kinds,
  the erratum in the tech-spec's notes, FA-7 and FA-8 out of scope, each task's privacy check.
- 2026-11-16: re-review of the amendments: approve after amendments; no blocker, three
  should-fix, six nits, all applied in the commit that records this note. One channel per target
  as a lint check on the compositions of the tree, not in `composeDocuments`, so a project keeps
  §5.2's facilitator case; the constants' source as spec-003 §10.1 and §11; (C)'s close adds a
  row for the bindings to `governance/feedback`, left to its `author` phase; nits: the
  stand-ins, the parse check kept as a defence, the refused item's source, each task's privacy
  check in its step, two lines reflowed.
- 2026-11-16, step 2: task (A), task-092, `done`: F-048 … F-051 in the inbox with their ledger
  rows, merged `--no-ff` at `efae8655`, closed at `5ef0aa15`; the row "Two feedback notes to
  WingFoil" in Closed. Rulings during the task: F-048's `kind` `gap`, not point 3's `defect`;
  F-049 kept with its observation that ending or deprecating the owner does not release the
  element. `main`'s CI on `5ef0aa15`, run 43914265106, `success`, jobs `validate (22.12.0, 1)`
  12 min 0 s, `(22.12.0, 2)` 5 min 41 s, `(22.21.0, 1)` 7 min 13 s, `(22.21.0, 2)` 8 min 54 s.
- 2026-11-17, step 3: task (B), task-093, `done`: spec-003's composer and lint checks (the item
  rule, `parameter-placement`, `entry-directive-scope`, `feedback-channel`,
  `feedback-channel-target` in the lint and `validate`), every published pack passing unchanged;
  merged `--no-ff` at `fa36b2be`, closed at `9cb75163`. Ruling with its body: a WingFoil
  built-in directive id accepted in an entry's `agent.execute`. `main`'s CI on `9cb75163`, run
  44060912347, `success`, jobs `validate (22.12.0, 1)` 7 min 8 s, `(22.12.0, 2)` 5 min 31 s,
  `(22.21.0, 1)` 10 min 40 s, `(22.21.0, 2)` 6 min 32 s.

## The approver's rulings

- 2026-11-16: the outline approved as amended by the review and the re-review, with three tasks
  (point 1's recommendation: (A) the notes, (B) spec-003's composer and lint checks, (C) the
  fixture-element checks), in the order A→B→C; `submit` authorised.
