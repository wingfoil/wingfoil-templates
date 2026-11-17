---
id: task-093-spec-003-s-composer-and-lint-checks-the-list-parameters-item-rule-the-placement-rule-an-entry-s-directive-scope-and-the-feedback-channel-checks-plan-075-task-b
type: task
title: "spec-003's composer and lint checks: the list parameters' item rule, the placement rule, an entry's directive scope and the feedback-channel checks (plan-075 task B)"
status: in-review
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
  scope, five sources: the pack's own, its directly required packs', the entry's own, the `with`
  pack's, and the `with` pack's directly required packs' ("required" as `workflowProblems`
  computes it, spec-001 §6.3). `agent.*` is a built-in token, so WingFoil's binding warning
  cannot catch a wrong id.
- **The `feedback-channel` checks** (§5.1, §5.2): a directive tagged `feedback-channel` comes from
  a pack that requires `governance/feedback` and holds one line, exactly ``Serves the target
  `upstream:<name>`.``; no composition of the tree holds two channel directives serving one target.
  §5.2 leaves that case in a project to the facilitator and the approver, so the check runs on the
  compositions the lint and `validate` make, not in `npm run compose`. The pack id and the tag are
  this pack's (§10.1, §11): one module holds them, the first rule of `src/` that names a pack.
  "Requires" is direct: the directive scope is direct, as spec-001 §6.3 and `workflowProblems`
  have it; §8.1's transitive reach is the parameters' only.
  The lint composes two non-overlay packs together only when one reaches the other through
  `requires`, a declared tension or a stage overlay (`src/overlay-rules.ts`); two independent
  upstream packs serving one target are therefore caught only by a preset or README example that
  composes both, through `validate`.

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
Tests: the lint rules in `tests/check-packs.test.ts`, the parameter functions in
`tests/parameters.test.ts`, the composer in `tests/compose-documents.test.ts`, examples in
`tests/example-rules.test.ts`, the per-composition check in a `tests/validate-*.test.ts`.

1. **One reading of a list parameter** in `src/parameters.ts`: a function that says whether a
   declaration is a list parameter (`type: string`, `description` beginning with "List of"), and
   one that returns the item rule's first failure for a value, or none; every check below uses
   them.
2. **The item rule in the composer:** `resolveParameters` refuses a list parameter's value (its
   default, or a value given, as text or not) that fails the item rule, before substitution, with
   a message naming the parameter, its pack and the failure (`npm run compose` exits 1, as for
   the type rule). Each case of spec-003 §3.2 has a test: the empty value, `task, task`,
   `x], kind: [defect`, `null, task`, `yes, task`, `on`, `bug,`, `Yes`, `bug:`, `catalog/pack`,
   refused; `bug, task`,
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
   files, not a Markdown body. A reference outside the scope is left to `parameter-scope` and to
   `substitute`, with no placement problem. Tests, each a fixture pack, each case through both the
   lint and the composer: a double-quoted scalar, `"a {{s}} b"`, a double-quoted key
   (`"{{s}}": 1`), an `integer` and a `boolean`
   unquoted, `[{{list}}]` and `[ {{list}} ]` in the declaring pack, `{{s}}` in a Markdown body,
   accepted; plain, single-quoted, a block scalar, a comment, `[{{list}}, x]`, `[{{list}}]` in a
   pack that does not declare it, a non-list `string` as `[{{s}}]`, a plain `{{s}}` in a
   directive's frontmatter, refused.
5. **An entry's directive scope:** a new rule `entry-directive-scope` in `workflowProblems`: an
   `agent.execute(…)` action of a conditional entry's workflows whose `directive:` argument (alone
   or among other arguments) names an id outside the entry's scope (Context's five sources) is a
   problem at the action's line. A plain `agent.execute`, one with no `directive:` argument, and
   one naming a directive in scope pass. A WingFoil built-in directive id passes: a reading of a
   gap, since spec-003 §7.2's and spec-001 §6.5's scope lists name pack sources only, while
   spec-001 §7.4 has a role's directive "shipped by a pack or built into WingFoil" and
   `checkRoleDirectives` (`src/merge.ts`) and `workflowProblems`' `roles.yaml` check accept
   `BUILTIN_DIRECTIVE_IDS`; ruled by the approver with this body. The composer, which runs
   `workflowProblems`, refuses the same (spec-001 §18's general rule). Tests: in scope through
   each of the five sources and a built-in id, accepted; an id of a pack outside the scope,
   another entry's directive, and an unknown id, refused.
6. **The `feedback-channel` checks:**
   - per pack, a new rule `feedback-channel`: a directive whose `tags` hold `feedback-channel`,
     shipped by a pack whose `requires` does not hold `governance/feedback`, or whose text holds
     no line, or more than one, matching exactly ``Serves the target `upstream:<name>`.``
     (`<name>` matching `[a-z0-9-]+`, the item rule's second part), is a problem;
   - per composition, a new rule `feedback-channel-target`: two `feedback-channel` directives
     serving one target in one composition of the tree is a problem naming both and the target,
     checked on the lint's overlay combinations and on every composition `validate` composes
     (presets, README examples, the entries given, an overlay's compositions, each with its
     legs), for example by reading the composed output, since `validate` composes in a child
     process (its `use` callback must not throw and returns early without `compat`, so the
     problem is collected there and reported after `composeTwice`); on `validate`'s
     line for a failing composition the message begins with the rule id
     (`composition <label>: feedback-channel-target: …`); `npm run compose` of a set holding two
     channels for one target still exits 0 (spec-003 §5.2);
   - the pack id `governance/feedback` and the tag `feedback-channel` are constants in one
     module of `src/`, which nothing else in `src/` duplicates.

   Tests on fixture trees: a channel in a pack requiring `governance/feedback` with one line,
   accepted; no `requires`, no line, two lines, a malformed line (no backticks, `upstream:` with
   a `/`), refused; two channel packs serving one target, one requiring the other, refused by the
   lint; two independent channel packs serving one target composed by a preset the lint never
   composes, refused by `validate`; both sets composed by `npm run compose` (exit 0).
7. **The published packs pass unchanged:** before any new rule is wired in, the build runs it on
   every pack of the tree and records the result; a published pack that fails goes to the
   approver (dl-019) before the rule changes. At the end, `npm run validate` and `npm run
   check:packs` exit 0 on the tree with no file under `packs/`, `presets/`, `catalog.yaml`,
   `tests/fixtures/examples/` or `tests/fixtures/*-exit/` changed.
8. **Tests the placement rule pre-empts:** the two tests of `tests/compose-documents.test.ts` that
   place a `string` unquoted (`x: {{s}}`, `d: {{s}}`) to reach a parse failure after
   substitution are rewritten in Design so that they still reach that failure through a duplicate
   key (`"{{s}}": 1` beside `a: 2`, default `s: a`; `parseYaml` refuses duplicate keys), since the
   type rule forbids `"`, `\` and control characters and the item rule keeps `[{{list}}]`
   well-formed; the reason recorded (dl-018). `readFiles`' parse check after substitution stays as
   a defence, reached after this task only through a duplicate key, an implicit key over 1024
   characters, or a file malformed on its own.
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

Branch `task/task-093-spec-003-checks` from `main` at this task's `backlog` (`ac195ca7`).

**Code:**
- `src/parameters.ts`: `isListParameter(declaration)`; `listItemProblem(value)` (the first
  failure: no item, an empty item, an item off the regex, a YAML word, an item twice);
  `valueProblem(declaration, value)` = `checkValue` then the item rule, used by `defaultMessage`
  (so `parameter-default` and the composer's default check), by `resolveParameters` for a value
  given, and by `presetChecks` (`preset-value`, `example-fixture`); `Parameter` gains `list`;
  `misplacedReferences(text, path, inScope, ownPack)`: a token scan of a `.yaml` file (not
  `pack.yaml`) or of a `.md` file's frontmatter, tracking double- and single-quoted scalars,
  comments and block scalars, returning each reference of a non-`integer`, non-`boolean`
  parameter in scope that stands outside a double-quoted scalar, unless it is a list parameter of
  `ownPack` standing alone in `[ … ]`, with its offset and placement.
- `src/pack-files.ts`: `scopeOf` keeps each parameter's declaring pack; `readPackFiles` adds
  `parameter-placement` problems on the raw text.
- `src/compose-documents.ts` › `readFiles`: the first misplaced reference refuses the composition
  before `substitute`.
- `src/workflow-rules.ts`: in a conditional entry's workflow files, each `agent.execute(…)` action
  whose `directive:` argument names an id outside `known.directives` and outside
  `BUILTIN_DIRECTIVE_IDS` is an `entry-directive-scope` problem.
- `src/feedback-channel.ts` (new): `FEEDBACK_PACK`, `CHANNEL_TAG`; `servedTargets(text)`;
  `channelProblems(pack, files)` per pack (rule `feedback-channel`), run from `check-packs.ts`'s
  pack group; `channelConflicts(directives)` per composition (rule `feedback-channel-target`),
  over `{ pack, path, text }` directive files: the lint's `src/overlay-rules.ts` › `refusal` runs
  it on `composeDocuments`' files and reports it under that rule; `src/validate.ts` runs it in
  `composeTwice`'s `use` callback on the output's `.wingfoil/directives/built-in/*.md` (before the
  `compat` return, never throwing) and reports `composition <label>: feedback-channel-target: …`
  as a failure after `composeTwice` returns.

**Red steps** (dl-018), each test written and run red before its code:
1. `tests/parameters.test.ts`: `isListParameter`, `listItemProblem` on criterion 2's cases,
   `misplacedReferences` on criterion 4's cases (no code: they fail to import).
2. `tests/compose-documents.test.ts`: the composer refuses a list default and a given value that
   fail the item rule, and each misplaced reference; the two tests at 258 and 261 rewritten to a
   duplicate key (green before and after: characterization, recorded).
3. `tests/check-packs.test.ts`: `parameter-default` on a list default, `preset-value` on a
   preset's value, `parameter-placement` cases, `entry-directive-scope` cases (five sources, a
   built-in, refused ids), `feedback-channel` cases, `feedback-channel-target` through a channel
   pack requiring the other; `tests/example-rules.test.ts`: `example-fixture` on an example's
   value.
4. A `tests/validate-*.test.ts` case: a preset composing two independent channel packs serving
   one target fails `validate` with `feedback-channel-target`, and `npm run compose` of the same
   set exits 0.

**The published packs first** (criterion 7): once the functions exist and before they are wired
in, a scratch script runs `listItemProblem`, `misplacedReferences` and the channel checks over
every pack, preset and example of the tree; its result recorded here.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-17: written under plan-075 (step 3), added on `main` (`b749040b`) once task-092 was
  `done`, no other task added meanwhile (W-14).
- 2026-11-17: independent review of the body: approve after amendments, nothing blocking; five
  should-fix and five nits, applied in the commit that records this note: criterion 8's route to
  the parse failure (a duplicate key); "requires" direct, as spec-001 uses it; the
  per-composition check against `src/validate.ts` (every composition it composes, read from its
  output, the rule id on its line, the lint's and `validate`'s test fixtures, the limit in
  Context); the placement cases, through lint and composer, out-of-scope references left to
  `parameter-scope`; the entry scope's five sources and another entry's directive; nits: the
  target's slug, more item-rule cases, the action's exact form and built-in ids, the test files,
  the CI's fixture trees unchanged. The review checked every published pack against the rules:
  all pass unchanged.
- 2026-11-17: re-review of the amendments: approve after amendments, nothing blocking; two
  should-fix and four nits, applied in the commit that records this note: a built-in directive
  id accepted in criterion 5, as a reading of a gap for the approver's ruling with this body
  (spec-001 §7.4, `merge.ts`'s and `workflowProblems`' precedent), with its test; the Context's
  "requires" sentence (§6.3 direct, §8.1 the parameters' only); nits: a double-quoted key among
  the accepted placements, the key over 1024 characters as a parse route, "each with its legs"
  and the output read as an example with `use`'s constraints, a `directive:` argument among
  others checked.
- 2026-11-17: Design written (`400ea18b`) and started (backlog → in-progress) on
  `task/task-093-spec-003-checks` from `main` at `ac195ca7`.
- 2026-11-17, build (dl-018), each red run on `npm run build` then `node --test`:
  - functions: `tests/parameters.test.ts`'s new cases first; `npm run build` failed, 4 type
    errors (`listItemProblem`, `misplacedReferences`, `ScopedParameter` not exported); then
    green, 38 passing (`6b018ab3`). Departure: the item rule was wired into `defaultMessage` and
    `resolveParameters` in that commit, before its composer test; that test
    (`compose-documents` "refuses a list default, or a value given …") passed on its first run,
    so it was checked by mutation: both calls reverted to `checkValue`, 1 more failing; restored.
  - the published packs first (criterion 7): before wiring the placement rule and the channel
    checks, a scratch script ran `misplacedReferences`, `isListParameter` and a search for
    `feedback-channel` and `agent.execute(…)` with arguments over every pack of this tree, the
    golden tree, `software-exit`, `merge/example-1`, `merge/example-2` and `resolve/full`: 49
    references in this tree and 7 in the golden tree, none misplaced; no list parameter, no
    channel directive, no `agent.execute` with arguments; presets and examples set no list
    parameter. Nothing went to the approver.
  - composer: the two tests at `tests/compose-documents.test.ts:258`/`:261` rewritten to a
    duplicate key (`"{{s}}": 1` beside `a: 2`), green before the placement rule (a
    characterization, criterion 8); the placement tests red, 1 failing; green after wiring
    `readFiles` (`a137002e`), 77 passing with `parameters`.
  - lint: `tests/check-packs.test.ts`'s spec-003 suite red, 5 failing (`preset-value`,
    `parameter-placement`, `entry-directive-scope`'s refusals, `feedback-channel`,
    `feedback-channel-target`); `parameter-default` on a list default passed at once (wired
    with the functions) and was checked by mutation (`defaultMessage` back to `checkValue`: 1
    failing); `example-fixture`'s item-rule test in `tests/example-rules.test.ts` passed at once
    (it shares `presetChecks`) and was checked by mutation (the item rule off in `presetChecks`:
    1 failing); green after wiring (`a2af93df`, lines wrapped in `2e27c28a`).
  - `validate`: `tests/validate-11-channels.test.ts` red, 1 failing; green after the check in
    `composeTwice`'s `use` callback (`e5db7a68`). The test's new packs carry no README
    examples, so the lint reports them too: the composition's line is the evidence, not the
    exit code.
  - then `npm test` 1326 passing, 0 failing; `npm run check:packs` "lint: checked 76 files, 0
    problems"; `npx eslint --max-warnings 0
    src tests` exit 0. No file under `packs/`, `presets/`, `catalog.yaml`,
    `tests/fixtures/examples/` or `tests/fixtures/*-exit/` changed.
- 2026-11-17: independent build review of `6a2b99bd`: request changes; two blockers, four
  should-fix, six nits. Applied in `c2e2432d`:
  - B1 (criterion 4): one case table, `tests/support/placement-cases.ts`, run through both the
    lint and the composer; B2 (criterion 6): the lint's channel set composed by `runCompose`,
    exit 0;
  - S1–S3, the scanner: a quote or a block indicator opens only where a node starts (after a
    line's sequence dashes, `: `, `[`, `{`, `,`, a tag or an anchor); a block scalar's parent is
    its key's column, or its dash's; the frontmatter read as `src/frontmatter.ts` reads it, BOM
    and CRLF included. Red first: 3 failing in `tests/parameters.test.ts`, then 41 passing; the
    reviewer's probe found a tag before a quote (`!!str "{{s}}"`) too, tested and fixed;
  - S4: the item rule's other cases and a `givenAsText` value through the composer;
  - nits: a quoted `directive:` id read without its quotes, an unusual one refused (red: 2
    failing); the composer's `entry-directive-scope` refusal tested; the "Serves the target"
    line exact, not in the frontmatter or a fenced block (red: 1 failing); `validate` reports a
    directive directory it cannot read instead of hiding it (no test: a read failure needs a
    broken output); line checks for `parameter-default` and `preset-value`. N6 (the output's
    label names no pack) kept: directive ids are unique in a composition.
  - Correction of the build note above: `npm run validate -- --param project_name=X` exits 1, on
    this branch as on `main`, because the README examples set `project_name` themselves; `npm
    run validate`, without it, exits 0.
  - Then `npm test` 1330 passing, 0 failing; `npm run check:packs` 0 problems; `npm run
    validate` exit 0; eslint exit 0. A re-review follows: the fixes change behaviour.
- 2026-11-17: re-review of `c2e2432d`: approve after amendments, nothing blocking; one should-fix,
  four nits. Applied in `2ea81eb0`: S-1, `[`, `{` and `,` start a node only inside a flow
  collection (a depth counter), so `a: foo, "{{s}}" bar` is refused and an unbalanced quote in
  plain text no longer hides what follows (red: 1 failing in `tests/parameters.test.ts`); N-a, a
  quoted key's `:` without a space inside a flow collection; N-c, a fenced block closes only on
  its own character and run (red: 1 failing); N-d, `example-fixture`'s line checked (green at
  once: the line was already right) and `validate`'s read-failure message says no channel was
  checked. N-b (a plain scalar's continuation line beginning with a quote) recorded as a known
  limit in the scanner's comment. The reviewer's four probe scripts rerun: no case wrong but
  N-b's. A focused re-review of the scanner follows.
- 2026-11-17: focused re-review of the scanner at `2ea81eb0`: approve after one minor amendment;
  no regression. Applied in `2596166c`: F1, a flow collection opened by a plain continuation
  line beginning with `[` or `{` no longer carries past it (the depth resets when a line returns
  to the indentation the collection opened at; red: 1 failing), the known limit's comment
  widened to it; F2, a backtick fence whose info string holds a backtick is text (red: 1
  failing). The reviewers' six probe scripts rerun: no case wrong but the known limit's. A run of
  `npm test` started before `2596166c` failed 51 tests because `dist/` was rebuilt while it ran;
  rerun undisturbed on `2596166c`: 1330 passing, 0 failing; `npm run check:packs` 0 problems;
  `npm run validate` exit 0; eslint exit 0. The code is frozen at `2596166c`.
- 2026-11-17: checks (dl-039 R1, R2), once, on `0f6d1a08` (the code frozen at `2596166c`, the
  commits after it `docs/memory` only): the branch CI, run 44056401671, `success`, jobs
  `validate (22.12.0, 1)` 10 min 31 s, `(22.12.0, 2)` 5 min 14 s, `(22.21.0, 1)` 8 min 28 s,
  `(22.21.0, 2)` 6 min 17 s (none over 25 minutes); from a clean working tree on Node.js 22.21.0
  after `npm ci` and `npm run build`: `npm run validate:publication`, the golden tree in
  publication mode and `npm run -s wingfoil -- workflow list` exit 0, `directives list --format
  json` with `"warnings": []`, the tree still clean. This commit changes only `docs/memory`: no
  new run. Privacy check of the branch's diff and messages: no local or scratch path, no
  maintainer name or email, no private project, no intermediary session.
