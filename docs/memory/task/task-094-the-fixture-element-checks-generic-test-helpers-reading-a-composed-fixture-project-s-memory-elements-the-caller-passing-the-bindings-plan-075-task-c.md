---
id: task-094-the-fixture-element-checks-generic-test-helpers-reading-a-composed-fixture-project-s-memory-elements-the-caller-passing-the-bindings-plan-075-task-c
type: task
title: "The fixture-element checks: generic test helpers reading a composed fixture project's Memory elements, the caller passing the bindings (plan-075 task C)"
status: draft
pack: ""            # tooling task (tooling-delivery v4), plan-075 task (C)
depends_on: []
tags: ["tooling","tests","governance"]
---

## Context

plan-075 (task (C) of its outline, point 5) hosts this task, a tooling task under
`tooling-delivery` v4, after task-093 (task (B), `done`). It delivers the other half of the row
"The fixture-element checks" of `docs/owed-items.md` (dl-012 D8; pack-governance-feedback ›
Acceptance; plan-074 rulings; spec-003 §11): the checks marked [E], which read a fixture
project's Memory elements. task-093 delivered the composer's and the lint's checks; this task's
close moves the row to Closed, settled by task-093 and task-094 (plan-075 point 7).

**Why generic.** WingFoil 0.3.2's `memory.yaml` declares neither allowed values nor references
(spec-003 §3.1; F-043, F-050), so a composed project cannot say which field holds which list or
which reference. The functions name no pack: the caller passes the bindings. The bindings to
`governance/feedback` (its type's fields; `feedback_outcomes` plus the entry's `bug`; `outcome`
and `resulting` on `closed`; `bug` refused in `feedback_outcomes`) are tests of that pack's
`author` phase, which does not exist yet; this task's close adds an Open row for them
(plan-075 point 5, `repository-practice` rule 4).

**The checks** (spec-003 §11 [E]; the charter's FA-3 … FA-6):
- required fields, from the composed `memory.yaml` (FA-3);
- allowed values: for each bound field, the items of the list parameter that governs it and the
  items the composed entries add (FA-4);
- references that resolve, for the bound fields, of FA-5's three kinds: an existing element id, a
  declared workflow and phase, a version (F-043);
- back-references: a bound field naming the elements an element routed to, each of which cites it
  back through `reported_by` or its body (spec-003 §8, FA-6);
- the fields a given state requires (for `governance/feedback`, `outcome` and `resulting` on
  `closed`);
- an item refused in a list parameter of every preset and README example (for
  `governance/feedback`, `bug` in `feedback_outcomes`), read from `presets/*.yaml` and the
  examples' `example.yaml` files.

**The code:** no helper reads a fixture project's Memory elements today; `src/frontmatter.ts`
reads a frontmatter; `tests/support/inbox.ts` reads the feedback inbox's notes, a precedent of a
test helper reading Markdown elements; `tests/support/examples.ts` writes example fixtures;
`src/parameters.ts` › `listItemProblem` (task-093) splits and checks a list value.

**A reading for the approver:** spec-003 §4.4 and the charter's fields list a commit among a
feedback item's context references, while FA-5 names three kinds that resolve (an element id, a
declared workflow and phase, a version). The helper offers a fourth kind, `commit`; whether
`governance/feedback`'s FA-5 counts a commit is that pack's binding, ruled with this body: if
yes, the charter's FA-5 gains "or a commit" as an erratum recorded with the `author` phase.

## Acceptance

`npm run build` precedes the commands.

1. **One module,** `tests/support/fixture-elements.ts`, naming no pack, no type and no field.
   Each check is a function returning its problems as `<file>: <message>` strings, sorted, empty
   when the elements pass; it takes the project's or the tree's root (the test passes its
   temporary one) and the bindings as data, and reads nothing else a binding does not name.
   - `readElements(project)`: every Memory element of a composed project, as WingFoil 0.3.2 finds
     them (`dist/memory/query.js`): from each type's `path` in `.wingfoil/memory.yaml`, the static
     directory prefix (up to the last `/` before the first `{`), nested roots once, walked
     recursively for `.md` files, each file read once through `src/frontmatter.ts`; an element's
     type is its frontmatter `type`, which must be a declared type; a `.md` file with no
     frontmatter (a README) is skipped; a frontmatter that does not parse, or a `type` that is not
     declared, is a problem.
   - `listItems(value)`: a list parameter's items, exported by `src/parameters.ts` and used there
     by `listItemProblem`, with no change of behaviour (the one change to `src/`, criterion 10).
2. **Required fields** (FA-3), as WingFoil 0.3.2's `memory submit` checks them
   (`dist/memory/submit.js`), on every element whose `status` is not `draft`: `title` and each
   field of its type's `template.frontmatter.required` present and filled; a list is filled only
   on a field of `template.frontmatter.lists` (where `[]` is filled), elsewhere a list is
   missing; an id in `exempt` for a field need not carry it; `n/a — <reason>` (case and spacing
   free, the em dash, a reason) passes only on a field of `not_applicable_allowed`, a bare `n/a`
   or another separator does not.
3. **Allowed values** (FA-4): for a binding `{ type, field, allowed }`, an element whose field (a
   string, or each item of a list) is not among `allowed` is a problem; an absent or empty field is
   left to criteria 2 and 6, and a not-applicable value passes; the caller builds `allowed` from
   `listItems` of the parameter's value plus the entries' items.
4. **References** (FA-5, F-043): for a binding `{ type, field, kinds, split, mode }`:
   - the candidates: the whole value, or with `split` its comma-separated parts, or each item of a
     list;
   - a candidate resolves by one of the binding's `kinds`: `element` (an element's id, or a
     project-relative path of an element or of any file under the project), `workflow-phase`
     (`<workflow>` or `<workflow>.<phase>` among the declared workflows and phases the caller
     passes; this task's reading of a "declared workflow and phase", which the `author` phase
     follows), `version` (among the versions the caller passes), `commit` (a commit of the
     project's git repository, `git cat-file -e <sha>^{commit}`);
   - `mode: every` (each candidate resolves, as for `resulting`) or `mode: some` (at least one
     does, as FA-5 asks); a not-applicable value passes.
5. **Back-references** (FA-6, spec-003 §8): for a binding `{ type, field, through }`, every element
   or file the field names (an id or a path, or a list of them) exists and cites the element back:
   through the field `through` (a list, as `reported_by`) when the target is an element whose
   type's composed template (its `template.file`) declares that field, else through its body
   naming the element's id or path; either failure is a problem.
6. **Fields per state:** for a binding `{ type, status, fields }`, an element of that type and
   status with one of the fields missing or empty is a problem.
7. **A refused item** (spec-003 §11): for a binding `{ parameter, item }`, a preset in
   `presets/*.yaml` or an example in `tests/fixtures/examples/**/example.yaml` whose `parameters`
   give the parameter a string value whose `listItems` hold the item is a problem; the pack's own
   default is the lint's (task-093), not this check's.
8. **Tests,** `tests/fixture-elements.test.ts`, on fixtures the test writes in a temporary
   directory (a composed-project layout with `.wingfoil/memory.yaml`, templates and elements, a
   git repository where a `commit` reference is tested, a tree with presets and examples): each
   check passes a clean fixture and reports each failure it names, with a type, field and list of
   the test's own (no published pack's).
9. **Test first** (dl-018): the tests run red against stub functions returning `[]` (so the count
   is of failing tests, not a type error), each red run's command and failing count in the
   Execution Notes; `listItems`' export characterized by the existing item-rule tests, green
   before and after.
10. **Nothing else changes:** besides `listItems`' export, no file under `src/`, `packs/`,
    `presets/`, `catalog.yaml` or `tests/fixtures/` changes; `npm run check:packs` and `npm run
    validate` exit 0.
11. **Checks** (`tooling-delivery` v4 › `review`, dl-039): the build review and its amendments
    first; then once on the frozen commit the branch CI `success`, its run id and every job's
    duration recorded (a job over 25 minutes to the approver, R3), and dl-039's local list on
    Node.js 22.21.0 from a clean working tree after `npm ci` and `npm run build`
    (`validate:publication`, the golden tree in publication mode, `workflow list`); `npm test` and
    `npm run lint` exit 0.
12. **An erratum** found while building (a rule of spec-003 or of the charter that a check cannot
    follow as written) goes to the approver when found (dl-019) and is recorded in the
    tech-spec's Execution Notes (dl-019 R5, dl-020 R1) once ruled.
13. **The owed rows,** in this task's close (plan-075 points 5, 7; `repository-practice` rule 4):
    "The fixture-element checks" moves to Closed, settled by task-093, task-094 (plan-075); a new
    Open row, "The bindings of the fixture-element checks to `governance/feedback`" (its fields,
    `feedback_outcomes` plus the entry's `bug`, `outcome` and `resulting` on `closed`, `bug`
    refused in `feedback_outcomes`, FA-5's kinds and mode), Source plan-075 point 5, task-094,
    owner the approver, trigger "`governance/feedback`'s `author` task".
14. **Delivery:** branch `task/task-094-fixture-element-checks`, merged `--no-ff` into `main` on
    the approver's OK (plan-075 point 2); `main`'s CI read after the merge, its run id and every
    job's duration recorded; the close records the privacy check of the branch's diff and
    messages; the untracked fixture draft in `main`'s working tree stays unstaged.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-17: written under plan-075 (step 4), added on `main` (`578af624`) once task-093 was
  `done`, no other task added meanwhile (W-14).
- 2026-11-17: independent review of the body: approve after amendments, nothing blocking; eight
  should-fix and six nits, applied in the commit that records this note: `readElements` as
  WingFoil 0.3.2 finds elements (static prefixes, nested once, recursive, the type from the
  frontmatter); the required-fields rules of 0.3.2's `memory submit` (`title`, `lists`, `exempt`,
  the `n/a — <reason>` form, drafts skipped); FA-5's candidates and its "at least one" mode; a
  commit as a fourth kind, its reading to the approver; paths as references and files as
  back-reference targets; the template deciding `reported_by`; `listItems` exported by
  `src/parameters.ts`; the erratum criterion; nits: the roots a check reads, absent and
  not-applicable values, red against stubs, the Closed row's format, presets and examples only,
  the untracked draft.
