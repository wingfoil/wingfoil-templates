---
id: task-084-the-composer-per-entry-active-entries-their-order-and-parameter-scopes-the-notices-of-tensions-the-mcp-refusal-plan-066-task-c
type: task
title: "The composer per entry: active entries, their order and parameter scopes, the notices of tensions, the mcp refusal (plan-066 task C)"
status: in-review
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (C)
depends_on: ["task-082-schemas-at-format-2-pack.yaml-catalog.yaml-and-the-index-format-1-frozen-validation-by-format-plan-066-task-a"]
tags: ["tooling","format","composer"]
---

## Context

plan-066 (rulings 1, 2, 5, 6 and 9), its third task, after task-082 (the schemas at format 2, every
`pack.yaml` read against the schema its `format` names) and task-083 (the catalog at format 2).
spec-001 §6.5, §7.1, §7.7, §8.1 and §17 at format 2: a conditional part of one or more entries, each
counting only when the composition holds the pack its `with` names (an unsatisfied range an error, a
`with` never adding a pack), its files after the pack's own and the earlier entries', each list in
its written order, its parameter scope its own (the pack's, and its `with` pack's with the packs
that one requires); a `with` counts as a requirement for §7.1's rule against a later pack; §17 step
8, each tension the composition holds printed as a notice that never fails the composition (§6.2).

What exists (`main`, read on 2026-11-08): the resolver reads `conditional` as one entry with
`software` (`src/resolve.ts`, `checkConditional`, `ResolvedPack.conditionalActive: boolean`); the
composer's files and `workflows.yaml` add `conditional[0]`'s lists (`src/compose-documents.ts`,
`readFiles`; `src/output.ts`, `workflowsYaml`); the scopes have one `conditional` set, the union of
every `with` (`src/parameters.ts`, `parameterScopes`); `order` already counts every entry's `with`
for §7.1. The resolver refuses what the lint rejects (§17 step 3) through `pack-rules`' helpers,
which read entry 0 only (`conditionalContents`, `conditionalFiles`) or format 1's rules
(`foundationProblems`: a pack requiring `software` carries no conditional part): so a format-2 pack
with two entries cannot be composed today. `compose` prints nothing on success, and `composeTwice`
(`src/determinism.ts`) drops a successful run's stderr.

The boundary with task (D): plan-066 gives (D) the lint's conditional rules by format and per entry,
inventory and `formats` among them. The composer applies five of them itself: the resolver's
`inventoryProblems`, `formatKindsProblems`, `slotProblems` and `foundationProblems`, and
`composeDocuments`' `checkWorkflows`, which runs `workflowProblems` and `deliveryProblems`
(`src/workflow-rules.ts`, reading entry 0, its known names adding `software`'s only). This task
reads those per entry and by format, as far as composing a format-2 pack needs; (D) keeps every rule
the composer does not apply (the scopes of `pack-files`, `tensions`' rules, `with`'s manifest rules
beyond `software` (naming the pack itself, a pack of its `requires` or `conflicts`, two entries for
one pack id), one owner and slots on the compositions with an entry's pack left out, the isolation
messages and each problem's pointer at its entry). Ruling 6: a pack shipping `mcp` is refused by the
composer here and by the lint in (D), until the row "The `mcp` kind's tooling" of
`docs/owed-items.md`. No published pack moves to format 2 (plan-063 ruling 3): the evidence is
fixture packs (ruling 2).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 7 committed before the code, so that the
   build passes and they fail by assertion, except the tests already green on `main` (format 1's
   schema refusals of Acceptance 5), recorded as such; the failing run recorded with its command and
   count.
2. **The active entries** (§6.5, §17 step 1): `ResolvedPack` records the active entries by index
   (replacing `conditionalActive`); an entry is active when the composition holds its `with` pack,
   whose version must satisfy its range, otherwise an error naming the pack, the entry's `with` and
   the version (§6.5, never a reason to leave the entry out); an entry whose pack is absent is left
   out, and no pack is added. Format 1's packs compose as today (their one entry names `software`).
   Tested on a format-2 fixture pack with two entries (one naming `software`, one naming another
   pack composed earlier): each composition with both, with one and with neither.
3. **Order and files** (§6.5, §7.7): each active entry's workflows and directives come after the
   pack's own and after the earlier active entries', each list in its written order, in the composed
   files and in `workflows.yaml`'s `include`; an inactive entry's files and their `include` are left
   out. Tested on Acceptance 2's compositions, the `include` list asserted.
4. **Parameter scopes per entry** (§8.1, §6.5): an entry's files may use the pack's parameters, its
   `with` pack's and those of the packs that one requires, and no other entry's `with` pack's; a
   `{{name}}` outside its entry's scope fails as today. Tested with two entries whose `with` packs
   are unrelated by `requires`: a parameter of the first entry's `with` pack used in the first
   entry's file composes, used in the second entry's file fails.
5. **§7.1** (§6.5): in a composition holding it, an entry's `with` pack later in the composition
   order is an error, the message
   `<pack>: its entry with <with> names <id>, later in the composition order (spec-001 §7.1)`
   (tested with a pack whose `with` names a `stage` pack; a `requires` keeps today's message). The
   other format-2 shapes the resolver applies: a format-2 pack requiring `software` with an entry
   naming another pack composes; a format-2 pack with an entry naming `software` and requiring it is
   refused (§6.5's "Who"); a format-1 pack with two entries, with `tensions` or with a `with` other
   than `software` is refused by its schema (task-082's v1 schema, one test each through `resolve`).
   `inventoryProblems`, `formatKindsProblems` and `slotProblems` read every entry's files: a file
   listed in two entries, or in `contents` and an entry, is refused; every entry's files count for
   `formats`; a methodology not requiring `software` ships `delivery` in its entry naming
   `software`. `workflowProblems` and `deliveryProblems`, as the composer applies them, read per
   entry: a file's part is its entry, and an entry's known workflows, directives, roles and Memory
   types add its `with` pack's and those of the packs that pack requires; `delivery`'s same part is
   its entry; the roles fragment, always composed, assigns no directive of any entry. Tested through
   `composeDocuments`: a workflow of the second entry using a role of its `with` pack composes; a
   methodology with `delivery` in its `software` entry at the second position composes with
   `software`.
6. **The notices** (§17 step 8, ruling 5): `composeDocuments` returns the notices; `compose` prints
   each on stderr as `notice: <pack> and <other>: <resolution>`, one line per tension the
   composition holds (the pack named present, its range satisfied when given; the resolution's line
   breaks folded to single spaces), in composition order of the declaring pack and then in its
   `tensions`' order, with exit 0; a tension whose pack is absent or outside its range prints
   nothing. `composeTwice` keeps a successful run's notices (the two runs' notices equal, or the
   check fails as not deterministic), and `validate` prints them after the composition's line, each
   prefixed by two spaces. Tested in `tests/compose-cli.test.ts`, `tests/compose-documents.test.ts`
   and `tests/determinism.test.ts`, and a `validate` test reading its output; a composition with no
   tension prints no notice line.
7. **The `mcp` refusal** (ruling 6): a pack whose `contents.fragments` or `formats` holds `mcp` is
   refused by the resolver, before the inventory and `formats` checks, with a message naming the
   pack and saying no WingFoil release reads the kind yet (spec-001 §7.8), until the `mcp` tooling's
   row; tested on a format-2 fixture pack.
8. **Nothing else moves:** the golden trees, the four published packs' compositions, `validate`,
   `check:packs`, `check:schemas` and the generated root files unchanged; `npm test` and
   `npm run lint` exit 0. No schema change, so no schema note.
9. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   (G12's 25 minutes), and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's
   diff recorded.

## Design

Branch `task/task-084-composer-per-entry` from `main` at this task's add. The test helper
`tests/support/pack-tree.ts`'s `PackSpec` gains `format`, `conditional` (entries of `with`,
`workflows`, `directives`) and `tensions`, written into `pack.yaml` (format 1 when absent, so no
existing test changes); `formatsFor` counts the entries' files and `writePack` writes them. Red
steps: (1) the tests of Acceptance 2 … 7 in `tests/resolve.test.ts`,
`tests/compose-documents.test.ts`, `tests/parameters.test.ts`, `tests/compose-cli.test.ts` and
`tests/validate.test.ts`, with the new functions' signatures and no body (they throw), as in
task-080 (`conditionalEntries`, the per-entry file sets, `PackScopes`' per-entry field, the notices'
return); (2) the resolver, the `pack-rules` helpers per entry (`conditionalEntries`, the files and
contents of one entry, of every entry, and of the active ones) and `foundationProblems` by format,
committed; (3) the scopes per entry and the files and `include` by active entry, committed; (4) the
notices through `composeDocuments`, `compose`, `composeTwice` and `validate`, and the `mcp` refusal,
committed. `workflowProblems` and `deliveryProblems` per entry go with step (3). The `validate` test
of the notices runs on a temporary tree (the golden tree, a format-2 pack declaring a tension and a
preset holding both packs) that today's checks accept (its tension pack with no conditional part);
if one of `validate`'s checks refuses a format-2 pack before (D) or (G), the test reaches
`composeTwice` through `validate`'s injected options instead, recorded in the notes. The other
readers of entry 0 (`pack-files`, `validate`'s legs, `overlay-rules`, the index and README
generators) are left for (D), (F) and (G), reading the format-1 packs as today; `workflowProblems`
per entry is shared with the lint, which reads format-2 packs by it from this task on (format 1
unchanged), and (D) builds on it. The fixtures: the methodology axis is required with `software` and
of cardinality one, and Kahn's order ignores a `with` inside an axis, so an entry's other pack sits
in an earlier axis (or sorts earlier in its own). No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-08: written as plan-066 task (C), after task-083's merge; `pack` and `depends_on` filled
  by editing the draft (W-02).
- 2026-11-08: independent review: approve after amendments, one blocking (the composer applies
  `workflowProblems` and `deliveryProblems` through `checkWorkflows`, reading entry 0, so they are
  read per entry here, Acceptance 5); applied with the others: the red run's exception for the
  tests already green on `main`, the §7.1 message for a `with` fixed, `with`'s manifest rules named
  as (D)'s, the `mcp` refusal before the inventory and `formats` checks, the notices' line breaks
  folded and no notice line without a tension, Acceptance 4's entries named and their `with` packs
  unrelated, `PackSpec`'s writing of the entries, the `validate` test's tree and its fallback.
- 2026-11-08: re-review: approve, nothing blocking; applied: the §7.1 message on one line, the roles
  fragment assigning no directive of any entry, the fallback for any of `validate`'s checks, the
  fixtures' axes, `workflowProblems` per entry shared with the lint from this task on.
- 2026-11-08: started (`backlog → in-progress`) on `task/task-084-composer-per-entry`. Red
  (dl-018), step (1): the tests of Acceptance 2 … 7, in a new file `tests/compose-entries.test.ts`
  (Acceptance 2 … 5 and 7, and the notices through `composeDocuments`) and in
  `tests/compose-cli.test.ts`, `tests/determinism.test.ts` and `tests/validate.test.ts`, with
  `PackSpec`'s `format`, `conditional` and `tensions`, and the signatures of `tensionNotices`
  (`src/notices.ts`), `conditionalEntries` and `entryFiles` (they throw); `npm run build` and
  `npm run lint` exit 0; `npm test`: 1239 tests, 19 failing, each by assertion or by today's
  refusal of the shape under test (an entry's files "present but not listed", a format-2 pack
  requiring `software` refused), none by the throwing signatures; format 1's three schema
  refusals green on `main`, as Acceptance 1 allows. The `validate` test runs on the golden tree
  with a format-2 pack declaring a tension, which today's checks accept (no fallback needed).
- 2026-11-08: green, steps (2) … (4) in one commit (`compose-documents` carries both the files per
  entry and the notices, so the steps do not split cleanly). One test fixed after the red commit:
  "a format-2 pack requiring software with an entry naming another pack" used a blueprint naming
  `governance/g`, a later pack, refused by §7.1 as it should be; the pack is now a `team-mode`.
  `npm test` 1239 tests, 0 failing; `validate`, `check:schemas`, `check:packs`, `check:pins` exit
  0; `npm run index -- --check` 0 not up to date; the golden trees unchanged. Shared with the lint
  from here on (format 1 unchanged, (D) builds on them): `workflowProblems` and `deliveryProblems`
  per entry, `inventoryProblems` per entry, `conditionalFiles` over every entry (`pack-files`'
  scopes still give every entry `software`'s, (D)'s), `foundationProblems` by format, the
  `mcp` refusal in the resolver only (the lint's in (D)).
- 2026-11-08: independent build review: approve after amendments, nothing blocking; applied:
  `composeTwice` keeps only a successful run's `notice: ` lines (a runtime warning on stderr was
  read as a notice, and its process id would differ between the runs); tests added for each
  entry's directives in written order, a workflow of one entry including one of another, `delivery`
  in an entry not naming `software`, notices from two declaring packs in composition order, and
  `mcp` in `formats` only; the `mcp` problem's pointer at `/formats/mcp` when only `formats` holds
  it; `output.ts` reading the entries through `conditionalEntries`; long lines wrapped. A format-1
  message changed by Acceptance 2: software outside an entry's range now ends "for its conditional
  entry with software@^<major>", not "for its conditional part" (its test matches both). The
  notices are tested in `tests/compose-entries.test.ts`, not `tests/compose-documents.test.ts`
  (Acceptance 6 names the latter). No decision changed, so no re-review. `npm test` 1242 tests,
  0 failing; `validate` and `check:packs` exit 0.
- 2026-11-08: the checks (dl-039), once on the frozen commit `53530bb`: the branch CI run
  42487729736 `success` (22.12.0 14 min 34 s, 22.21.0 15 min 10 s, under G12's 25 minutes);
  dl-039's local list on Node.js 22.21.0 on a clean worktree of `53530bb`: `npm ci`, `npm run
  build`, `npm run validate:publication` (18 runs, 0 failed), the golden tree in publication (26
  runs, 0 failed), `workflow list`, `directives list --format json` (`warnings []`), each exit 0;
  `npm run lint` 0. The privacy check of the branch's diff: no local or scratch path, no private
  project. This note is documentation-only (dl-039 R2).
