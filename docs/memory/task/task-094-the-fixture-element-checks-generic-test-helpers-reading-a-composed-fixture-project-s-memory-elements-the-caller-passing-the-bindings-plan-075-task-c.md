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

## Acceptance

`npm run build` precedes the commands.

1. **One module,** `tests/support/fixture-elements.ts`, naming no pack, no type and no field:
   - `readElements(project)`: every Memory element of a composed project, read from the
     directories its `.wingfoil/memory.yaml` types' `path` patterns name (the part before the
     first `{`), each with its type, file, frontmatter fields and body; a file whose frontmatter
     does not parse is a problem, not a skipped file;
   - `listItems(value)`: a list parameter's items, trimmed, as `src/parameters.ts` reads them;
   - one function per check of Context, each returning its problems as `<file>: <message>`
     strings, sorted, empty when the elements pass; each takes the bindings as data (types,
     fields, states, lists, the declared workflows and phases, the versions) and reads nothing a
     binding does not name.
2. **Required fields:** an element missing a field its type's `template.frontmatter.required`
   lists, or holding it empty, is a problem; a type's `not_applicable_allowed` field holding
   `n/a — <reason>` passes, as WingFoil 0.3.2 accepts it.
3. **Allowed values:** for a binding `{ type, field, allowed }`, an element whose field (a string,
   or each item of a list) is not among `allowed` is a problem; the caller builds `allowed` from
   `listItems` of the parameter's value plus the entries' items.
4. **References:** for a binding `{ type, field, kind }`, kind `element` (the value is the id of
   an element read), `workflow-phase` (`<workflow>` or `<workflow>.<phase>` among the declared
   workflows and phases the caller passes) or `version` (among the versions the caller passes);
   a value that does not resolve is a problem, and a type's not-applicable value passes.
5. **Back-references:** for a binding `{ type, field, through }`, every element the field names
   (an id or a list of ids) exists and cites the element back, through the field `through` (a
   list, as `reported_by`) where the target's frontmatter has it, else through its body naming
   the element's id; either failure is a problem.
6. **Fields per state:** for a binding `{ type, status, fields }`, an element of that type and
   status with one of the fields missing or empty is a problem.
7. **A refused item:** for a binding `{ parameter, item }`, a preset in `presets/*.yaml` or an
   example in `tests/fixtures/examples/**/example.yaml` whose `parameters` give the parameter a
   value holding the item is a problem.
8. **Tests,** `tests/fixture-elements.test.ts`, on fixtures the test writes in a temporary
   directory (a composed-project layout with `.wingfoil/memory.yaml` and elements, a tree with
   presets and examples): each check passes a clean fixture and reports each failure it names,
   with a type, field and list of the test's own (no published pack's), written test first
   (dl-018, each red run's command and failing count in the Execution Notes).
9. **Nothing else changes:** no file under `src/`, `packs/`, `presets/`, `catalog.yaml` or
   `tests/fixtures/` changes; `npm run check:packs` and `npm run validate` exit 0.
10. **Checks** (`tooling-delivery` v4 › `review`, dl-039): the build review and its amendments
    first; then once on the frozen commit the branch CI `success`, its run id and every job's
    duration recorded (a job over 25 minutes to the approver, R3), and dl-039's local list on
    Node.js 22.21.0 from a clean working tree after `npm ci` and `npm run build`
    (`validate:publication`, the golden tree in publication mode, `workflow list`); `npm test` and
    `npm run lint` exit 0.
11. **The owed rows,** in this task's close (plan-075 points 5, 7; `repository-practice` rule 4):
    "The fixture-element checks" moves to Closed, settled by "task-093 and task-094 (plan-075)";
    a new Open row, "The bindings of the fixture-element checks to `governance/feedback`" (its
    fields, `feedback_outcomes` plus the entry's `bug`, `outcome` and `resulting` on `closed`, `bug`
    refused in `feedback_outcomes`), Source "plan-075 point 5", owner the approver, trigger
    "`governance/feedback`'s `author` task".
12. **Delivery:** branch `task/task-094-fixture-element-checks`, merged `--no-ff` into `main` on
    the approver's OK (plan-075 point 2); `main`'s CI read after the merge, its run id and every
    job's duration recorded; the close records the privacy check of the branch's diff and
    messages.

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
