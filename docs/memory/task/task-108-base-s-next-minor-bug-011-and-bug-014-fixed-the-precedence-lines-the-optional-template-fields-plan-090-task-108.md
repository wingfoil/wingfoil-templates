---
id: task-108-base-s-next-minor-bug-011-and-bug-014-fixed-the-precedence-lines-the-optional-template-fields-plan-090-task-108
type: task
title: "base's next minor: bug-011 and bug-014 fixed, the Precedence lines, the optional template fields (plan-090 task-108)"
status: approved
pack: "pack-foundation-base"
depends_on: []
tags: ["packs","base"]
---

## Context

plan-090 hosts this task (its Steps 3; points 3, 4 and 5 of its outline, ruled on 2026-11-27): the
content of `base`'s next minor, 2.1.0 (`prel-009`, prepared after this task and task-109 …
task-111). A pack task under `kanban-delivery` v7, pack-author, charter `pack-foundation-base`;
the CHANGELOG entry, the version and the range are `prepare`'s, not this task's.

**What it fixes and adds**, the register's Open rows (`docs/owed-items.md`):
- **bug-011's fix** (`approved`, `minor`): `security-secrets` forbids "a personal email … into a
  file, a commit, an element or a message", while `base`'s own `dna.yaml` fragment writes
  `team.members[].email` (WingFoil authorises an approval by the approving git identity's email and
  routes it by name and email) and every commit's author header carries the git identity's email.
  Expected (bug-011): the directive names the two exceptions, and a personal email is written
  nowhere else (not in Memory, a commit message's text, or a message). **A departure from
  bug-011's Expected,** for the approver to rule at the backlog gate: WingFoil itself writes an
  `Approver: <name> <<email>> (approver)` line in the body of every approval commit (0.3.0 and
  0.3.2, `core/provenance-record.js`, `core/workflow-finalize.js`; on `main`, `7faf8255`), so
  "nowhere else … a commit message's text" read literally brings the contradiction back; the fix
  names it as a third exception, and "a commit message's text" covers what a person or an agent
  writes.
- **bug-014's fix** (`approved`, `minor`): `governance-evolution` › `apply` asks for "AGENTS.md
  updated", but the region the packs write is generated (spec-001 §10) and a hand edit inside it is
  lost. Expected (bug-014): `apply` asks for AGENTS.md updated outside the generated region, and
  says the region changes only with a pack version, a parameter value or the composition,
  regenerated (pasted by hand until WingFoil exports AGENTS.md).
- **The `Precedence:` lines** (dl-025 D2, spec-001 §10.1, `pack-authoring`): each directive's first
  line after its `# ` title; `base`'s section states §10.1's table and its rules (plan-090 point 4).
- **The optional template fields** (plan-074 point 6, plan-090 point 5): `decision-log` gets
  `contributor`, `credit` and `reported_by`; `task` gets `reported_by`.
- **"`base` composed without `software`"** (task-099 › Execution Notes; owner claude, trigger
  `base`'s next minor): composed alone, `workflow start decision-log-ingest` reports `no directives
  assigned to role 'product-owner'`, the role of its `capture` phase; `base`'s `roles.yaml`
  assigns only `facilitator: [traceability]`, besides its `global` directives. The run goes on.
  WingFoil (0.3.0, 0.3.2, `core/context.js`) warns when a role has no assignment of its own, the
  `global` directives not counted. `software` assigns no `product-owner` either, so the warning
  also comes with `base` and `software`, and with the governance packs; only `methodology/scrum`
  and `methodology/kanban` assign it (`[scrum]`, `[kanban]`). Two options, ruled at this task's
  backlog gate (plan-090 point 3):
  - **(a) recommended:** `base` assigns `product-owner: [traceability]`, the directive that asks a
    captured decision to name where it comes from; `assignments.<role>` is a set merged across packs
    (spec-001 §7.4), so with a methodology the role gets `[traceability, scrum]` or `[traceability,
    kanban]`; the `product-owner` warning goes in every composition (the `approver` role of the
    approve phases has no assignment in any pack, and `workflow next` still warns there). The agent
    already reads `traceability` as facilitator (`executes_as: [facilitator, product-owner]`).
  - **(b):** the reading that the advice stands: the `global` directives apply to every role, the
    warning is WingFoil's advice; a note on this task, the row Closed at plan-090's close citing it.
- **README step 3 "own entries"** (plan-052 › close, task-067; trigger the next README pass,
  plan-090 point 3): `base`'s step 3 re-adds "Memory types" among the project's own entries, which
  reads as re-adding what `init` scaffolded; `methodology/kanban`'s step 3 answers it ("only what
  the project wrote itself, … never the Memory types, roles or workflows WingFoil's `init`
  scaffolded").

**What exists today** (`main` at `6668e0e4`, `base` 2.0.1 tagged): `packs/base/directives/`
(`claim-sources`, `doc-versioning`, `security-secrets`, `traceability`), `agents/section.md`,
`fragments/roles.yaml`, `workflows/governance-evolution.yaml`, `memory-templates/decision-log.md`
and `task.md` (no optional field), `README.md` with "Updating from 1.0.0" and "Updating from 2.0.0".
WingFoil 0.3.2's `init` writes the provenance fields on its `adr`, `bug`, `decision-log` and
`tech-spec` templates (`contributor: ""`, `credit: ""`, `reported_by: []`, each with an `#
optional — …` comment), none on `task`.

## Acceptance

1. **bug-011:** `security-secrets`' rule names three exceptions: the team members' emails in
   `dna.yaml` › `team.members` (WingFoil authorises and routes approvals by them); the git
   identity's email in a commit's author header; and the `Approver:` line WingFoil writes in an
   approval commit's body. A personal email is written nowhere else: not in Memory, in a file other
   than `dna.yaml`, in the text of a commit message a person or an agent writes, or in a message.
   The rest of the directive unchanged. (The third exception departs from bug-011's Expected, see
   Context; ruled at the backlog gate.)
2. **bug-014:** `governance-evolution` › `apply`'s description asks for AGENTS.md updated outside
   the generated region, and says the region changes only with a pack version, a parameter value or
   the composition, regenerated by the composer and pasted by hand until WingFoil exports AGENTS.md
   (spec-001 §10). In `agents/section.md`, "this file" in the line on a change of governance reads
   "this file outside its generated region". `propose`'s "AGENTS.md" and the file's header comment
   stay (a proposal may change the region through a pack or a parameter). The workflow's `version`
   moves by one (as 2.0.0 did, `16760ec6`).
3. **The `Precedence:` lines:** `security-secrets` `Precedence: security`; `claim-sources`,
   `doc-versioning` and `traceability` `Precedence: foundation`; each the first line after the `#
   ` title, followed by a blank line. No lint checks it (plan-090 point 4): the Design lists each
   directive's first line, and the build review reads them.
4. **The section's precedence:** `agents/section.md` states spec-001 §10.1's table, its seven rows
   as §10.1's (from the strongest), and every one of its rules: the stricter rule always wins and
   precedence decides only between rules not comparable by strictness; classes 1 … 3 by subject,
   the others by pack or axis; a bridge directive's class; a project's `custom/` directives declare
   their class, only add or tighten, never claim classes 1 … 3 against a pack's rule of those
   classes, never reuse a pack's directive id; escalation: an agent that meets a contradiction stops
   and opens a decision-log through `decision-log-ingest`.
5. **The template fields:** `decision-log.md` gains `contributor: ""`, `credit: ""` and
   `reported_by: []`; `task.md` gains `reported_by: []`; each with a `# optional — …` comment as
   0.3.2's, `reported_by`'s adapted: "list of the feedback ids or feedback note paths this element
   answers, as provenance only; restate each in this element, never copy it" (0.3.2's second half
   kept). Neither template gains `id` or `status`; no type's `frontmatter.required` changes. On
   0.3.0 and 0.3.2, on `core-records`, the frontmatter of the decision-log and the task the
   scenarios of criterion 9 add is read, and whether the fields and their comments are kept is
   recorded in the Execution Notes.
6. **"`base` composed without `software`":** as ruled at the backlog gate: (a)
   `fragments/roles.yaml` assigns `product-owner: [traceability]`, and `workflow start
   decision-log-ingest --format json` on each of `base`'s README examples, on 0.3.0 and 0.3.2,
   gives an empty `directiveWarnings`, the command and its output recorded in the Execution Notes;
   or (b) a note on this task, the row Closed at plan-090's close citing it (plan-090 ruling 11).
7. **The README:** step 3 re-adds only what the project wrote itself, never the Memory types, roles
   or workflows `init` scaffolded, as `methodology/kanban`'s; an **"Updating from 2.0.1."**
   paragraph: recompose and copy the `.wingfoil/` files as in steps 2 and 3, regenerate the
   AGENTS.md region and paste it again (the section's precedence and, with (a), the assignment
   change it), and the optional fields reach a project only through its copied templates (elements
   already written are not changed). "What it adds" is a generated region: it changes only through
   `npm run index` (with (a), its line for `traceability` gains `product-owner`).
8. **Not this task's:** the CHANGELOG entry, `pack.yaml`'s `version` and the range (`prepare`);
   the notes on the charter `pack-foundation-base` (whose body names `assignments.facilitator:
   [traceability]` and the templates without the fields: "the body stays as approved") and on
   bug-011 and bug-014, which are plan-090 point 11's, after the tag; no file under `src/`,
   `.wingfoil/`, `presets/` or another pack changes; a change found needed there stops the task and
   goes to the approver (dl-019).
9. **Validation:** `npm test`, `npm run lint`, `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` pass with no warning, `tolerance applied: none`; the overlays `software-exit`,
   `scrum-exit`, `kanban-exit` and `feedback-exit` and the golden tree pass; `npm run check:runs`
   passes, with a run of its own added to `tests/fixtures/runs/base.yaml` (read by
   `tests/runs.test.ts`), limited by its `only` to `core-records` (the other two examples set a
   `task_path` with `{release}`, which nothing in `base` fills and the runner's `add` cannot give),
   that adds a `task`, on 0.3.0 and 0.3.2; the existing `governance-evolution` run, whose `submit:
   added` and `approve: added` act on the last element added, unchanged. `catalog.yaml`,
   `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged until `prepare`. Tests that read
   `base`'s files updated where their expectations change.
10. **The counts** the tooling tests take on this repository (the lint's files, the index's, the
    compositions and runs): each that moves stated in the Execution Notes with the test it changes,
    measured, not assumed.
11. **Checks** (`kanban-delivery` › `review`, dl-039): the build review and its amendments; then,
    once, on the frozen commit, the branch CI `success`, its run id and every job's duration (a job
    over 25 minutes goes to the approver); dl-039's local list on Node.js 22.21.0 from a clean
    tree after `npm ci` and `npm run build`, as task-107 ran it.
12. **Delivery:** the branch `task/task-108-…` from `main`, in a worktree; after `approve`, a
    `--no-ff` merge on the approver's OK, `main` pushed by the approver (plan-090 ruling 13), its CI
    read, and `approved → done`; the privacy check of the branch's diff recorded
    (`repository-practice` rule 2).

## Design

The approver's rulings at the backlog gate (`401efd3d`, 2026-11-27): option (a); bug-011's third
exception.

**Files** (all under `packs/base/` except the scenario):
- `directives/security-secrets.md`: the rule's bullet rewritten with the three exceptions
  (criterion 1); `Precedence: security` after the title.
- `directives/claim-sources.md`, `doc-versioning.md`, `traceability.md`: `Precedence:
  foundation` after the title. The four first lines listed in the Execution Notes (criterion 3).
- `workflows/governance-evolution.yaml`: `apply`'s description (criterion 2); `version: 2 → 3`.
- `agents/section.md`: "this file outside its generated region"; a "Precedence of directives"
  block after the workflows' list: the rule that the stricter wins, the table of §10.1's seven
  classes, then the rules of criterion 4, one bullet each.
- `fragments/roles.yaml`: `product-owner: [traceability]` beside `facilitator` (option (a)).
- `memory-templates/decision-log.md`, `task.md`: the fields of criterion 5, between `title` and
  the closing `---`, each with its comment.
- `README.md`: step 3 (criterion 7), the "Updating from 2.0.1." paragraph after 2.0.0's;
  the generated regions by `npm run index`.
- `tests/fixtures/runs/base.yaml`: a run `main: decision-log-ingest`, `only: [core-records]`,
  `name` naming it, steps `start` then `add: { type: task, title: … }` (no step named, as
  `src/runs.ts` allows).

**The checks with the real WingFoil** (criteria 5, 6), a script outside the repository, on 0.3.0
and 0.3.2 from the matrix cache: each of `base`'s three README examples composed with `npm run
compose`, into a scratch repository (`git init`, the composed `.wingfoil/` and the AGENTS region
committed, a fictional identity); `workflow start decision-log-ingest --format json`, its
`directiveWarnings` read; on `core-records`, `memory add` of a `decision-log` and a `task`, their
frontmatter read. Before the change (the red), the start's warning is expected on each example;
after it, none. The commands and outputs recorded in the Execution Notes.

**The steps:** 1. the red: the script on `main`'s `base`, and `check:runs` with the new run (it
passes before the change, the fields being optional: recorded as such, no red for it); 2. the
changes; 3. the script again, `npm test`, `check:runs` and the list of criterion 9; 4. the
counts (criterion 10).

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-27: independent review of the body (dl-017): approve after amendments; one blocker, nine
  should-fix, five nits, all applied in the next commit. **Blocker:** bug-011's Expected, read
  literally, forbids the `Approver:` line WingFoil writes in every approval commit: a third
  exception, recorded in Context as a departure for the approver to rule. **Should-fix:** criterion
  6(a)'s check is `workflow start --format json` on the README examples (`check:runs` reads no
  `directiveWarnings`); the warning also comes with `software` and the governance packs; (b)'s row
  Closed at plan-090's close; "What it adds" changes only through `npm run index`; "Updating from
  2.0.1" copies the files; the `task` add step in `tests/fixtures/runs/base.yaml`; the fields read
  on the added elements; `reported_by`'s comment keeps 0.3.2's second half; criterion 2's target
  text for the section. **Nits:** the overlays and `npm test` named; the catalog files unchanged;
  the first lines listed in the Design (no lint); the charter's and the bugs' notes plan-090 point
  11's; criterion 4 checkable.
- 2026-11-27: re-review: approve after amendments; no blocker, one should-fix, one nit, both
  applied in the next commit. **Should-fix:** the `task` add in a run of its own, limited to
  `core-records` (the other examples' `task_path` holds `{release}`), so the existing run's
  `submit: added` and `approve: added` keep their element; the fields read on `core-records`.
  **Nit:** only the `product-owner` warning goes.
- 2026-11-27: Design (`9b25b793`), `backlog → in-progress` (`62331117`), on `task/task-108-…`
  from `main` at `401efd3d`.
- 2026-11-27: the red (criteria 5, 6), with the real WingFoil 0.3.0 and 0.3.2 of the matrix cache:
  each of `base`'s three README examples composed by `compose-cli` from the tree, into a scratch
  repository committed under the example's approver; `workflow start decision-log-ingest --format
  json`: `next.directiveWarnings` `["no directives assigned to role 'product-owner'"]` on all six;
  on `core-records`, `memory add --type decision-log` and `--type task`: no `contributor`,
  `credit` or `reported_by` in either element's frontmatter. The new `check:runs` run passes
  before the change too (the fields optional), recorded as such.
- 2026-11-27: build (`ee198ebe`). The four directives' first lines after the title (criterion 3):
  `claim-sources` `Precedence: foundation`, `doc-versioning` `Precedence: foundation`,
  `security-secrets` `Precedence: security`, `traceability` `Precedence: foundation`. The same
  checks after it: `next.directiveWarnings` `[]` on all six; on 0.3.0 and 0.3.2, the added
  `decision-log` carries `contributor: ""`, `credit: ""` and `reported_by: []` and the `task`
  `reported_by: []`, each with its comment kept (criterion 5).
- 2026-11-27: a consequence beyond the Design: with `reported_by` declared by `base`'s templates,
  the fixture-element check of `governance/feedback` (FA-6, `tests/support/fixture-elements.ts`)
  reads a back-reference from that field instead of the body, and 21 tests of
  `tests/feedback-elements.test.ts` failed (the valid projects `defaults`, `added-outcome`, and the
  invalid elements checked against `defaults`). The five target elements of
  `tests/fixtures/feedback-elements/` (`dl-001`, `dl-002`, `dl-900`, `task-001` of `defaults`;
  `dl-1-offline-maps` of `added-outcome`) gain `reported_by: [<the feedback id>]`, their body's
  citation kept; `dl-901` (cites nothing) unchanged. The check is the pack's FA-6 working as
  meant; no file under `src/` changed.
- 2026-11-27: validation (criterion 9), Node.js 24.22.3: `npm test` 1537 tests, 0 failing;
  eslint, `check:texts -- --base main`, `check:packs` (101 files, 0 problems), `index -- --check`,
  `validate` (32 runs, `tolerance applied: none`), the golden step (26 runs), the four overlays
  (40, 40, 40, 48 runs), each exit 0; `check:runs` 94 runs, 0 failed (`base-task-template` on
  `core-records`, 0.3.0 and 0.3.2). `npm run index` regenerated `packs/base/README.md`'s "What it
  adds" (`traceability`: `facilitator`, `product-owner`). Catalog files unchanged.
- 2026-11-27: the counts (criterion 10): `check:runs` 92 → 94 runs (no test asserts it); the lint's
  files (101), the index's (9), `validate`'s runs and the tests' count (1537) unchanged.
- 2026-11-27: the command of criterion 6, as run for each example `<x>` and release `<v>`:
  `node dist/src/compose-cli.js --tree . --out <dir> <the example's --param values> base`, the
  composed `.wingfoil/` committed in a scratch repository, then
  `.cache/wingfoil-matrix/<v>/node_modules/.bin/wingfoil workflow start decision-log-ingest
  --format json`, its `next.directiveWarnings` read: before, `["no directives assigned to role
  'product-owner'"]`; after, `[]`.
- 2026-11-27: independent review of the build (dl-017): approve after amendments; no blocker,
  three should-fix, six nits, all applied in `7d6e846d`. **Should-fix:** "Updating from 2.0.1"
  said the region carries the assignment: the region states the precedence, the assignment
  reaches the project by the copied `roles.yaml`; the section gains §10.1's rules it had dropped
  (a class-1 or class-2 directive names its law or standard; a ruling that becomes a `custom/`
  directive is applied through `governance-evolution`; §10.1's sentence that precedence is not the
  composition order left out, the composition order being the composer's, not an agent's
  concern); the `governance/feedback` consequence: with `base` 2.1.0 a decision-log or task routed
  by that pack cites the item in `reported_by`, not its body, as the pack's own rule says for a
  template that has the field. Still a minor (`pack-semver`): the field is optional, nothing fails
  validation, and it is the outcome `governance/feedback` expected (plan-074 point 6); "Updating
  from 2.0.1" says it, and an Open row carries `governance/feedback`'s README sentence that
  becomes half-stale, owner approver, trigger that pack's next release. **Nits:** 913's expected
  message pinned to the field's branch; `apply`'s text reflowed; "bridge directive" glossed; the
  gloss of "not comparable by strictness" kept; criterion 6's command written out above;
  `security-secrets` names the author and committer headers.
- 2026-11-27: re-review: approve; three nits, applied in the next commit: this note's command
  rewritten (one name, the path whole); 913's case line broken; and a departure from criterion 1
  recorded: criterion 1 names "the git identity's email in a commit's author header", and the
  directive names "author and committer headers", since git writes the identity's email in both
  and naming only the author header would leave every commit's committer header in breach; the
  "nowhere else" list is unchanged. For the approver to read at `approve` (dl-019); the
  Acceptance's text stays as approved.
- 2026-11-27: dl-039's checks (criterion 11), once, on the frozen commit `44b10c2b`:
  - the branch CI 46012186819 `success`: `validate (22.21.0, 1)` 14m50s, `validate (22.12.0, 1)`
    11m08s, `validate (22.12.0, 2)` 5m24s, `validate (22.21.0, 2)` 5m13s;
  - the local list on Node.js 22.21.0, a clean tree, after `npm ci` and `npm run build`, every
    command exit 0: `npm test` (1537 tests, 0 failing), `lint`, `check:pins`, `check:schemas`,
    `check:packs` (101 files, 0 problems), `index -- --check`, `validate` (32 runs), the golden step
    (26 runs), the four overlays (40, 40, 40, 48 runs), `workflow list`, `check:runs` (94 runs, 0
    failed), `npm audit --omit=dev` and `npm audit` in each `src/matrix/wingfoil-*/`; the tree clean
    after.
  - The privacy check of the branch's diff and its commit messages (`repository-practice` rule 2):
    no local path, no session or transcript of this work, no project outside this repository's
    named (the directive's existing "a message to another session" is the pack's own wording,
    unchanged).
- 2026-11-27: `in-review → approved` by the approver (`51b1fb65`), criterion 1's author and
  committer headers accepted; on the approver's OK, merged `--no-ff` into `main` (`0be6a781`);
  `main` pushed by the approver. The task stays `approved` until `main`'s CI on the merge.
- 2026-11-27: `main` pushed by the approver; its CI on `f5c8a31e` (the merge `0be6a781` and its
  note) `success` (CI run 46043800402, Pages 46043800209); `approved → done`.
