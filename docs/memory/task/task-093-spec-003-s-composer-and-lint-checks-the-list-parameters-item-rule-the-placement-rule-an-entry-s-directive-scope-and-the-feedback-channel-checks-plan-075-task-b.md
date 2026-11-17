---
id: task-093-spec-003-s-composer-and-lint-checks-the-list-parameters-item-rule-the-placement-rule-an-entry-s-directive-scope-and-the-feedback-channel-checks-plan-075-task-b
type: task
title: "spec-003's composer and lint checks: the list parameters' item rule, the placement rule, an entry's directive scope and the feedback-channel checks (plan-075 task B)"
status: draft
pack: ""            # tooling task (tooling-delivery v4), plan-075 task (B)
depends_on: []
tags: ["tooling","lint","composer","governance"]
---

## Context

plan-075 (task (B) of its outline, point 4) hosts this task, a tooling task under
`tooling-delivery` v4, after task-092 (task (A), `done`). It delivers the composer's and the
lint's checks of spec-003 §11, half of the row "The fixture-element checks" of
`docs/owed-items.md` (dl-012 D8; plan-074 rulings; spec-003 §11); task (C) delivers the other
half, and (C)'s close moves the row to Closed, settled by (B) and (C) (plan-075 point 7). The
rules come from spec-003, approved, and the spec-001 sections it amended (§6.3, §6.5, §8.1, §8.2,
§18):

- **List parameter** (spec-003 §3.1): a `string` parameter whose `description` begins with
  "List of"; its value is items separated by `,`, each trimmed.
- **The item rule** (§3.2): at least one item, items unique, each matching
  `^[a-z][a-z0-9-]*(:[a-z0-9-]+)?$` and none of `null`, `true`, `false`, `yes`, `no`, `on`, `off`,
  `y`, `n`. Today the composer accepts `x], kind: [defect`, `null, task`, the empty value and
  `task, task` (plan-074 step 2).
- **The placement rule** (§3.1): in a substituted YAML file (not `pack.yaml`) or a Markdown file's
  YAML frontmatter, every `{{name}}` of a type other than `integer` and `boolean` stands inside a
  double-quoted scalar; a list parameter may also stand as the whole content of a flow sequence,
  `[{{name}}]` (spaces allowed between brackets and braces), only in the files of the pack that
  declares it. Any other placement (plain, single-quoted, a block scalar, a comment) is an error.
- **An entry's `agent.execute`** (§7.2, spec-001 §6.5, §18): an action of a conditional entry's
  workflows that names a directive (`'agent.execute(directive: <id>)'`) names one in the entry's
  scope: the pack's own or its required packs', the entry's own, or the `with` pack's or its
  required packs'. `agent.*` is a built-in token, so WingFoil's binding warning cannot catch a
  wrong id.
- **The `feedback-channel` checks** (§5.1, §5.2): a directive tagged `feedback-channel` comes from
  a pack that requires `governance/feedback` and holds one line, exactly ``Serves the target
  `upstream:<name>`.``; no composition of the tree holds two channel directives serving one target.
  §5.2 leaves that case in a project to the facilitator and the approver, so the check runs on the
  compositions the lint and `validate` make, not in `npm run compose`. The pack id and the tag are
  this pack's (§10.1, §11): one module holds them, the first rule of `src/` that names a pack.

**The code** (plan-075 › Context): `src/parameters.ts` (`checkValue`, `referencesIn`,
`resolveParameters`, `substitute`); `src/pack-files.ts` › `readPackFiles` (`parameter-default`,
`parameter-scope`); `src/compose-documents.ts` › `readFiles` (the raw text before `substitute`) and
`composeDocuments`; `src/workflow-rules.ts` › `workflowProblems` (each conditional entry's known
directives; run by the lint and by the composer); `src/tree-rules.ts` › `presetChecks`
(`preset-value`), reused by `src/example-rules.ts` (`example-fixture`); `src/overlay-rules.ts`
(the lint's overlay combinations, composed through `composeDocuments`); `src/validate.ts` (the
compositions `validate` makes); `src/preset-stand-ins.ts`.

**The published packs** (spec-003 §3.1): only `methodology/kanban`'s two `integer` parameters stand
unquoted, which the placement rule exempts; no published pack declares a list parameter or ships a
`feedback-channel` directive, so every published pack is expected to pass unchanged.

## Acceptance

`npm run build` precedes the commands. Rule ids, as `npm run validate` prints them, in backticks.

1. **One reading of a list parameter** in `src/parameters.ts`: a function that says whether a
   declaration is a list parameter (`type: string`, `description` beginning with "List of"), and
   one that returns the item rule's first failure for a value, or none; every check below uses
   them.
2. **The item rule in the composer:** `resolveParameters` refuses a list parameter's value (its
   default, or a value given, as text or not) that fails the item rule, before substitution, with
   a message naming the parameter, its pack and the failure (`npm run compose` exits 1, as for
   the type rule). Each case of spec-003 §3.2 has a test: the empty value, `task, task`,
   `x], kind: [defect`, `null, task`, `Yes`, `bug:`, `catalog/pack`, refused; `bug, task`,
   ` bug , upstream:plover-vendor `, accepted.
3. **The item rule in the lint:** a default that fails it is a `parameter-default` problem, a
   preset's value a `preset-value` problem, a README example's value an `example-fixture`
   problem, each at its line. A required list parameter, if any, needs its own stand-in in
   `src/preset-stand-ins.ts` passing the item rule; none exists, so none is added.
4. **The placement rule:** one lexical function in `src/parameters.ts` (a token scan of the raw
   text, since YAML with an unquoted `{{name}}` may not parse) that returns each misplaced
   reference with its offset, given the declarations in scope and whether a list parameter is
   the file's pack's own. It serves:
   - the lint, a new rule `parameter-placement` in `readPackFiles`, one problem per misplaced
     reference at its line;
   - the composer, in `readFiles` on the raw text before `substitute`: the composition refused
     (exit 1), the message naming the file, the parameter and the placement.

   It covers substituted `.yaml` files other than `pack.yaml` and the YAML frontmatter of `.md`
   files, not a Markdown body. Tests, each a fixture pack: a double-quoted scalar, an `integer`
   and a `boolean` unquoted, `[{{list}}]` and `[ {{list}} ]` in the declaring pack, accepted;
   plain, single-quoted, a block scalar, a comment, `[{{list}}, x]`, and `[{{list}}]` in a pack
   that does not declare it, refused.
5. **An entry's directive scope:** a new rule `entry-directive-scope` in `workflowProblems`: an
   `agent.execute` action of a conditional entry's workflows that names a directive outside the
   entry's scope (Context) is a problem at the action's line. A plain `agent.execute` and one
   naming a directive in scope pass; the composer, which runs `workflowProblems`, refuses the
   same (spec-001 §18's general rule). Tests: in scope through each of the four sources,
   accepted; an id of a pack outside the scope, and an unknown id, refused.
6. **The `feedback-channel` checks:**
   - per pack, a new rule `feedback-channel`: a directive whose `tags` hold `feedback-channel`,
     shipped by a pack that does not require `governance/feedback` (directly or transitively),
     or whose text holds no line, or more than one, matching exactly ``Serves the target
     `upstream:<name>`.`` (`<name>` a slug), is a problem;
   - per composition, a new rule `feedback-channel-target`: two `feedback-channel` directives
     serving one target in one composition of the tree is a problem naming both and the target,
     checked on the lint's overlay combinations and on the compositions `validate` makes
     (presets, README examples, entries); `npm run compose` of a set holding two channels for
     one target still exits 0 (spec-003 §5.2);
   - the pack id `governance/feedback` and the tag `feedback-channel` are constants in one
     module of `src/`, which nothing else in `src/` duplicates.

   Tests on fixture trees: a channel in a pack requiring `governance/feedback` with one line,
   accepted; no `requires`, no line, two lines, a malformed line (no backticks, `upstream:` with
   a `/`), refused; two packs serving one target composed together, refused by the lint and by
   `validate`, and composed by `npm run compose`.
7. **The published packs pass unchanged:** before any new rule is wired in, the build runs it on
   every pack of the tree and records the result; a published pack that fails goes to the
   approver (dl-019) before the rule changes. At the end, `npm run validate` and `npm run
   check:packs` exit 0 on the tree with no file under `packs/`, `presets/` or `catalog.yaml`
   changed.
8. **Tests the placement rule pre-empts:** the two tests of `tests/compose-documents.test.ts` that
   place a `string` unquoted (`x: {{s}}`, `d: {{s}}`) to reach a parse failure after
   substitution are rewritten in Design so that they still reach that failure (a value the type
   rule allows that breaks the YAML inside a double-quoted scalar, or a list parameter in a flow
   sequence), the reason recorded (dl-018); `readFiles`' parse check after substitution stays as a
   defence.
9. **Test first** (dl-018): each new rule and each change to an existing check has a test that
   fails before the change, the red run's command and failing count in the Execution Notes.
10. **Checks** (`tooling-delivery` v4 › `review`, dl-039): the build review and its amendments
    first; then once on the frozen commit the branch CI `success`, its run id and every job's
    duration recorded (a job over 25 minutes to the approver, R3), and dl-039's local list on
    Node.js 22.21.0 from a clean working tree after `npm ci` and `npm run build`
    (`validate:publication`, the golden tree in publication mode, `workflow list`); `npm test`
    and `npm run lint` exit 0.
11. **An erratum** found while building (a rule of spec-001 or spec-003 that code cannot check as
    written) goes to the approver when found (dl-019) and is recorded in the tech-spec's Execution
    Notes (dl-019 R5, dl-020 R1) once ruled.
12. **Delivery:** branch `task/task-093-spec-003-checks`, merged `--no-ff` into `main` on the
    approver's OK (plan-075 point 2); `main`'s CI read after the merge, its run id and every job's
    duration recorded; the close records the privacy check of the branch's diff and messages.
    The owed row stays Open, for (C)'s close.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-17: written under plan-075 (step 3), added on `main` (`b749040b`) once task-092 was
  `done`, no other task added meanwhile (W-14).
