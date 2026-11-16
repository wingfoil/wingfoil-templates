---
id: plan-075-tooling-change-before-governance-feedback-s-author-the-spec-003-and-fixture-element-checks-and-feedback-notes-f-048-to-f-051
type: plan
title: "tooling-change: before governance/feedback's author, the spec-003 and fixture-element checks and feedback notes F-048 to F-051"
status: draft
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","feedback","governance","W10"]
---

## Context

W10's order (the sequencer, "W10's order") holds `governance/feedback` after the presets. Its
charter (plan-073) and its design (plan-074, spec-003 approved) are done. Two rows of
`docs/owed-items.md` are due "before `governance/feedback`'s first `author` task", each with the
approver as owner:
- **"The fixture-element checks"** (dl-012 D8; pack-governance-feedback › Acceptance; plan-074
  rulings; spec-003 §11): a test helper reading a fixture project's Memory elements, with the
  composer's and the lint's checks of spec-003;
- **"Two feedback notes to WingFoil"** (plan-073 ruling 5, step 2; plan-074 point 10): the two
  defects of plan-073's run on 0.3.2, with the two requests of spec-003 S3-O1 and S3-O2.

This plan delivers both through `tooling-change` v3 › `deliver`, each task through
`tooling-delivery` v4 with `pack: ""`. The approver asked for it on 2026-11-16, after plan-074's
close.

**The tech-specs this wave builds on** (dl-020): spec-001 and spec-003, both on `main` with
plan-074's fold-back; no erratum waits to be folded back.

**`main`'s CI before this plan** (dl-038 C3): run 43877166222 on `795e8ee5` (plan-074's close
and submit), `success`.

**The code the checks touch** (read for this plan):
- `src/parameters.ts`: `checkValue` (the type check), `referencesIn` (every `{{name}}` with its
  offset), `resolveParameters` (every value type-checked before substitution), `substitute`;
- `src/pack-files.ts` › `readPackFiles`: the lint's `parameter-default` and `parameter-scope`
  rules, walking `referencesIn` with offsets;
- `src/tree-rules.ts` › `presetChecks` (`preset-value`), reused by `src/example-rules.ts` for
  README examples (`example-fixture`);
- `src/pack-rules.ts` › `conditionalProblems` (§18's conditional rules);
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

   Recommended. The alternative keeps (B) and (C) as one task, as the row reads.
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

   Each note: the six fields by hand, `wingfoil_version: 0.3.2`, "New note (task-…).", `##
   Observed` with 0.3.2's commit, commands, output and exit codes (for a request, what 0.3.2
   does instead) and `## Expected`. The inbox searched for duplicates first (F-018 and F-043 are
   close to F-050). F-048 and F-049 are reproduced in a scratch project with 0.3.2 from
   `src/matrix/wingfoil-0.3.2/`, fictional `.example` identities, no pack named beyond what WingFoil
   alone shows; a point that does not reproduce goes to the approver. One commit per note with
   its ledger row. The red by mutation of the inbox tests, as task-077.
4. **(B) the composer and the lint** (spec-003 §3, §5.2, §7.2, §11; spec-001 §8.1, §8.2, §18):
   - **list parameter:** a `string` whose `description` begins with "List of", read in one place
     (`src/parameters.ts`);
   - **the item rule** (at least one item, unique, the regex, none of the nine words): the
     composer on every value before substitution (`resolveParameters`); the lint on defaults
     (`parameter-default`), presets (`preset-value`) and examples (`example-fixture`), under
     those rule ids;
   - **the placement rule:** in a substituted YAML file or a Markdown file's YAML frontmatter,
     every `{{name}}` of a type other than `integer` and `boolean` stands inside a double-quoted
     scalar, or, for a list parameter in the files of the pack that declares it, as the whole
     content of a flow sequence; the lint (a new rule, `parameter-placement`, in
     `readPackFiles`) and the composer before substitution;
   - **an entry's `agent.execute`:** an action of a conditional entry's workflows that names a
     directive names one in the entry's scope (the pack's own or its required packs', the entry's
     own, or the `with` pack's or its required packs'); a new rule, `entry-directive-scope`, next
     to `conditionalProblems`;
   - **the `feedback-channel` checks** (spec-003 §5.2): a directive tagged `feedback-channel` is
     shipped by a pack that requires `governance/feedback`, holds one line ``Serves the target
     `upstream:<name>`.``, and no composition holds two channels for one target; per pack in the
     lint, and per composition where the lint composes;
   - **the published packs pass unchanged:** the build checks every pack of the tree against the
     new rules first; a published pack that fails goes to the approver before any rule changes
     (dl-019). The re-review of spec-003 found only `methodology/kanban`'s two `integer`
     parameters unquoted, which the placement rule exempts.
5. **(C) the fixture-element checks** (dl-012 D8, spec-003 §11), all [E], a test helper under
   `tests/support/` reading a composed fixture project's Memory elements through
   `src/frontmatter.ts`:
   - required fields, from the composed `memory.yaml`;
   - allowed values: a list parameter's items, plus those a composed entry adds;
   - references that resolve (F-043: WingFoil does not check them);
   - back-references through `reported_by` or the body (spec-003 §8);
   - `outcome` and `resulting` on a `closed` item;
   - `bug` refused in a preset's or an example's `feedback_outcomes`.

   Its own tests run on a fixture written by the test (as `tests/support/examples.ts` does),
   since `governance/feedback` is not written yet; the helper names no pack and reads a type's
   fields from the composed `memory.yaml`, so the `author` phase uses it on the pack's fixtures.
6. **Checks of every task** (dl-039): the build review and its amendments first, then once on the
   frozen commit the branch CI green, every job's duration recorded (R3, G12), and the local list
   on Node.js 22.21.0 from a clean working tree after `npm ci` and `npm run build`
   (`validate:publication`, the golden tree in publication mode, `workflow list`); (A) adds
   `node --test dist/tests/wingfoil-feedback.test.js dist/tests/feedback-note.test.js` and `npm
   run lint`.
7. **The owed rows:** "Two feedback notes to WingFoil" moves to Closed with (A), "The
   fixture-element checks" with (C) (or with the joint task), each in its task's close commit,
   with the task's id.
8. **An erratum found while building** (a rule of spec-001 or spec-003 that code cannot check as
   written) goes to the approver when found (dl-019) and is listed at the wave close (dl-020).

**Not in this plan:**
- `governance/feedback`'s `author` phase and its fixtures;
- `reported_by` in `base`'s and `software`'s templates (the pack release round, S3-O4);
- the adapter for `agent execute` (S3-O3, at the adoption);
- a rule on a workflow's `checks` string, which is a review rule at `pack-release-cycle` ›
  `prepare` (spec-001 §18), not a lint;
- `governance/wingfoil-dogfood`.

## Steps

1. **This plan:** an independent review (dl-017) and a re-review if a fix changes a point; the
   approver's OK on the outline; `submit` (`draft → active`).
2. **Task (A)** (`tooling-delivery` v4, `pack: ""`): added on `main` (`memory add --type task`,
   the printed id checked, W-14); its body reviewed; `pending → backlog` by the approver; on its
   branch, design, build, build review, checks, `in-review`; the approver's approval and merge
   OK; merged `--no-ff`, `main`'s CI read; its owed row moved to Closed.
3. **Task (B)**, the same way, once (A) is `done`.
4. **Task (C)**, the same way, once (B) is `done`; its owed row moved to Closed.
5. **Close:** dl-020: the errata and rulings per tech-spec listed (none expected), the approver's
   ruling recorded; this plan `active → done`; the CI of the close's push left to the next plan
   (dl-038 C3).

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
